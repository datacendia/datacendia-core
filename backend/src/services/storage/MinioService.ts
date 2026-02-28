// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// MINIO SERVICE - Sovereign Object Storage (CendiaVault)
// =============================================================================
// S3-compatible object storage that runs locally. No cloud dependencies.
// Use for: PDFs, Documents, Model files, Backups, Large binary data
// =============================================================================

import { Client, BucketItem } from 'minio';
import { Readable } from 'stream';
import * as crypto from 'crypto';
import { getErrorMessage } from '../../utils/errors.js';

import { logger } from '../../utils/logger.js';
// MinIO connection config
const MINIO_CONFIG = {
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'datacendia_admin',
  secretKey: process.env.MINIO_SECRET_KEY || 'datacendia_secure_2024',
};

// Bucket names
export const BUCKETS = {
  DOCUMENTS: 'cendia-documents',      // PDFs, Office docs for CendiaGnosis
  COUNCIL_DOCUMENTS: 'council-documents',
  MODELS: 'cendia-models',            // AI model files
  BACKUPS: 'cendia-backups',          // Database backups
  EXPORTS: 'cendia-exports',          // Court exports, reports
  UPLOADS: 'cendia-uploads',          // User uploads (temp)
  AVATARS: 'cendia-avatars',          // User/Agent avatars
  ATTACHMENTS: 'cendia-attachments',  // Decision attachments
} as const;

// File metadata
export interface FileMetadata {
  organizationId: string;
  uploadedBy: string;
  originalName: string;
  mimeType: string;
  checksum: string;
  encrypted?: boolean;
  tags?: string[];
}

// Upload result
export interface UploadResult {
  success: boolean;
  bucket: string;
  objectName: string;
  etag?: string;
  versionId?: string;
  size?: number;
  error?: string;
}

// Download result
export interface DownloadResult {
  success: boolean;
  stream?: Readable;
  metadata?: Record<string, string>;
  size?: number;
  error?: string;
}

class MinioService {
  private client: Client;
  private isInitialized: boolean = false;

  constructor() {
    this.client = new Client(MINIO_CONFIG);
  }

  /**
   * Initialize buckets on startup
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    logger.info('[MinIO] Initializing buckets...');

    for (const bucketName of Object.values(BUCKETS)) {
      try {
        const exists = await this.client.bucketExists(bucketName);
        if (!exists) {
          await this.client.makeBucket(bucketName);
          logger.info(`[MinIO] Created bucket: ${bucketName}`);

          // Set bucket policy for uploads bucket (public read for avatars)
          if (bucketName === BUCKETS.AVATARS) {
            await this.setBucketPublicRead(bucketName);
          }
        }
      } catch (error: unknown) {
        console.error(`[MinIO] Failed to create bucket ${bucketName}:`, getErrorMessage(error));
      }
    }

    this.isInitialized = true;
    logger.info('[MinIO] Initialization complete');
  }

  /**
   * Set bucket policy to public read
   */
  private async setBucketPublicRead(bucketName: string): Promise<void> {
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    };

    await this.client.setBucketPolicy(bucketName, JSON.stringify(policy));
  }

  /**
   * Upload a file from buffer
   */
  async uploadBuffer(
    bucket: string,
    objectName: string,
    buffer: Buffer,
    metadata: Partial<FileMetadata> = {}
  ): Promise<UploadResult> {
    try {
      // Calculate checksum
      const checksum = crypto.createHash('sha256').update(buffer).digest('hex');

      const metaHeaders: Record<string, string> = {
        'x-amz-meta-checksum': checksum,
        'x-amz-meta-organization': metadata.organizationId || 'unknown',
        'x-amz-meta-uploaded-by': metadata.uploadedBy || 'system',
        'x-amz-meta-original-name': metadata.originalName || objectName,
      };

      if (metadata.mimeType) {
        metaHeaders['Content-Type'] = metadata.mimeType;
      }

      if (metadata.tags) {
        metaHeaders['x-amz-meta-tags'] = metadata.tags.join(',');
      }

      const result = await this.client.putObject(
        bucket,
        objectName,
        buffer,
        buffer.length,
        metaHeaders
      );

      return {
        success: true,
        bucket,
        objectName,
        etag: result.etag,
        versionId: result.versionId ?? undefined,
        size: buffer.length,
      };
    } catch (error: unknown) {
      console.error('[MinIO] Upload error:', getErrorMessage(error));
      return {
        success: false,
        bucket,
        objectName,
        error: getErrorMessage(error),
      };
    }
  }

  /**
   * Upload a file from stream
   */
  async uploadStream(
    bucket: string,
    objectName: string,
    stream: Readable,
    size: number,
    metadata: Partial<FileMetadata> = {}
  ): Promise<UploadResult> {
    try {
      const metaHeaders: Record<string, string> = {
        'x-amz-meta-organization': metadata.organizationId || 'unknown',
        'x-amz-meta-uploaded-by': metadata.uploadedBy || 'system',
        'x-amz-meta-original-name': metadata.originalName || objectName,
      };

      if (metadata.mimeType) {
        metaHeaders['Content-Type'] = metadata.mimeType;
      }

      const result = await this.client.putObject(
        bucket,
        objectName,
        stream,
        size,
        metaHeaders
      );

      return {
        success: true,
        bucket,
        objectName,
        etag: result.etag,
        versionId: result.versionId ?? undefined,
        size,
      };
    } catch (error: unknown) {
      console.error('[MinIO] Upload stream error:', getErrorMessage(error));
      return {
        success: false,
        bucket,
        objectName,
        error: getErrorMessage(error),
      };
    }
  }

  /**
   * Download a file as stream
   */
  async downloadStream(bucket: string, objectName: string): Promise<DownloadResult> {
    try {
      const stream = await this.client.getObject(bucket, objectName);
      const stat = await this.client.statObject(bucket, objectName);

      return {
        success: true,
        stream,
        metadata: stat.metaData,
        size: stat.size,
      };
    } catch (error: unknown) {
      console.error('[MinIO] Download error:', getErrorMessage(error));
      return {
        success: false,
        error: getErrorMessage(error),
      };
    }
  }

  /**
   * Download a file as buffer
   */
  async downloadBuffer(bucket: string, objectName: string): Promise<Buffer | null> {
    try {
      const stream = await this.client.getObject(bucket, objectName);
      const chunks: Buffer[] = [];

      return new Promise((resolve, reject) => {
        stream.on('data', (chunk: Buffer) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
      });
    } catch (error: unknown) {
      console.error('[MinIO] Download buffer error:', getErrorMessage(error));
      return null;
    }
  }

  /**
   * Get a presigned URL for temporary access
   */
  async getPresignedUrl(
    bucket: string,
    objectName: string,
    expirySeconds: number = 3600
  ): Promise<string | null> {
    try {
      return await this.client.presignedGetObject(bucket, objectName, expirySeconds);
    } catch (error: unknown) {
      console.error('[MinIO] Presigned URL error:', getErrorMessage(error));
      return null;
    }
  }

  /**
   * Get a presigned URL for upload
   */
  async getPresignedUploadUrl(
    bucket: string,
    objectName: string,
    expirySeconds: number = 3600
  ): Promise<string | null> {
    try {
      return await this.client.presignedPutObject(bucket, objectName, expirySeconds);
    } catch (error: unknown) {
      console.error('[MinIO] Presigned upload URL error:', getErrorMessage(error));
      return null;
    }
  }

  /**
   * Delete a file
   */
  async deleteObject(bucket: string, objectName: string): Promise<boolean> {
    try {
      await this.client.removeObject(bucket, objectName);
      return true;
    } catch (error: unknown) {
      console.error('[MinIO] Delete error:', getErrorMessage(error));
      return false;
    }
  }

  /**
   * List objects in a bucket
   */
  async listObjects(
    bucket: string,
    prefix?: string,
    recursive: boolean = true
  ): Promise<BucketItem[]> {
    try {
      const objects: BucketItem[] = [];
      const stream = this.client.listObjects(bucket, prefix, recursive);

      return new Promise((resolve, reject) => {
        stream.on('data', (obj: BucketItem) => objects.push(obj));
        stream.on('end', () => resolve(objects));
        stream.on('error', reject);
      });
    } catch (error: unknown) {
      console.error('[MinIO] List error:', getErrorMessage(error));
      return [];
    }
  }

  /**
   * Check if object exists
   */
  async objectExists(bucket: string, objectName: string): Promise<boolean> {
    try {
      await this.client.statObject(bucket, objectName);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get object metadata
   */
  async getObjectMetadata(
    bucket: string,
    objectName: string
  ): Promise<Record<string, any> | null> {
    try {
      const stat = await this.client.statObject(bucket, objectName);
      return {
        size: stat.size,
        lastModified: stat.lastModified,
        etag: stat.etag,
        metaData: stat.metaData,
      };
    } catch {
      return null;
    }
  }

  /**
   * Copy object within MinIO
   */
  async copyObject(
    sourceBucket: string,
    sourceObject: string,
    destBucket: string,
    destObject: string
  ): Promise<boolean> {
    try {
      await this.client.copyObject(
        destBucket,
        destObject,
        `/${sourceBucket}/${sourceObject}`
      );
      return true;
    } catch (error: unknown) {
      console.error('[MinIO] Copy error:', getErrorMessage(error));
      return false;
    }
  }

  // ===========================================================================
  // CENDIA-SPECIFIC METHODS
  // ===========================================================================

  /**
   * Upload a document for CendiaGnosis
   */
  async uploadDocument(
    organizationId: string,
    documentId: string,
    buffer: Buffer,
    metadata: {
      originalName: string;
      mimeType: string;
      uploadedBy: string;
      tags?: string[];
    }
  ): Promise<UploadResult> {
    const objectName = `${organizationId}/${documentId}/${metadata.originalName}`;
    
    return this.uploadBuffer(BUCKETS.DOCUMENTS, objectName, buffer, {
      organizationId,
      ...metadata,
    });
  }

  /**
   * Upload a court export for CendiaWitness
   */
  async uploadExport(
    organizationId: string,
    exportId: string,
    buffer: Buffer,
    format: 'pdf' | 'json' | 'xml'
  ): Promise<UploadResult> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const objectName = `${organizationId}/exports/${exportId}_${timestamp}.${format}`;

    return this.uploadBuffer(BUCKETS.EXPORTS, objectName, buffer, {
      organizationId,
      mimeType: format === 'pdf' ? 'application/pdf' 
        : format === 'json' ? 'application/json' 
        : 'application/xml',
      originalName: `export_${exportId}.${format}`,
    });
  }

  /**
   * Create a database backup
   */
  async uploadBackup(
    backupName: string,
    buffer: Buffer
  ): Promise<UploadResult> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const objectName = `${timestamp}/${backupName}`;

    return this.uploadBuffer(BUCKETS.BACKUPS, objectName, buffer, {
      organizationId: 'system',
      uploadedBy: 'system',
      originalName: backupName,
    });
  }

  /**
   * Get bucket statistics
   */
  async getBucketStats(bucket: string): Promise<{
    objectCount: number;
    totalSize: number;
  }> {
    const objects = await this.listObjects(bucket);
    
    return {
      objectCount: objects.length,
      totalSize: objects.reduce((sum: number, obj: BucketItem) => sum + (obj.size || 0), 0),
    };
  }
}

// Singleton instance
export const minioService = new MinioService();

export default minioService;
