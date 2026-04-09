// 7-Year Audit Retention Service
// Implements enterprise-grade data retention policies for regulatory compliance

import { logger } from '../../utils/logger.js';
import { PrismaClient } from '@prisma/client';

export interface RetentionConfig {
  retentionPeriodYears: number;
  cleanupFrequency: 'daily' | 'weekly' | 'monthly';
  tables: string[];
  autoCleanup: boolean;
  lastCleanup?: Date;
  nextCleanup?: Date;
}

export interface RetentionStatus {
  tableName: string;
  totalRecords: number;
  recordsOverRetention: number;
  oldestRecord: Date;
  newestRecord: Date;
  storageSizeBytes?: number;
}

export class RetentionService {
  private prisma: PrismaClient;
  private readonly RETENTION_YEARS = 7;
  private readonly CLEANUP_INTERVAL = 30 * 24 * 60 * 60 * 1000; // 30 days in ms

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Get current retention configuration
   */
  async getConfig(): Promise<RetentionConfig> {
    return {
      retentionPeriodYears: this.RETENTION_YEARS,
      cleanupFrequency: 'monthly',
      tables: [
        'audit_logs',
        'decision_packets',
        'evidence_packages',
        'gateway_logs',
        'federation_audit_logs',
        'compliance_reports'
      ],
      autoCleanup: true
    };
  }

  /**
   * Get retention status for all configured tables
   */
  async getRetentionStatus(): Promise<RetentionStatus[]> {
    const query = `
      SELECT * FROM retention_status
    `;

    try {
      const results = await this.prisma.$queryRawUnsafe<any[]>(query);
      return results.map(row => ({
        tableName: row.table_name,
        totalRecords: parseInt(row.total_records),
        recordsOverRetention: parseInt(row.records_over_7_years),
        oldestRecord: new Date(row.oldest_record),
        newestRecord: new Date(row.newest_record)
      }));
    } catch (error) {
      logger.error('Failed to get retention status:', error);
      throw new Error('Unable to retrieve retention status');
    }
  }

  /**
   * Perform cleanup of expired audit data
   */
  async performCleanup(): Promise<{ deletedRecords: number; tablesProcessed: string[] }> {
    const query = `SELECT cleanup_old_audit_data()`;
    
    try {
      await this.prisma.$queryRawUnsafe(query);
      
      // Get cleanup results from maintenance logs
      const status = await this.getRetentionStatus();
      const totalDeleted = status.reduce((sum, table) => sum + table.recordsOverRetention, 0);
      
      logger.info(`Retention cleanup completed: ${totalDeleted} records deleted`);
      
      return {
        deletedRecords: totalDeleted,
        tablesProcessed: status.map(t => t.tableName)
      };
    } catch (error) {
      logger.error('Failed to perform retention cleanup:', error);
      throw new Error('Retention cleanup failed');
    }
  }

  /**
   * Schedule automatic cleanup
   */
  async scheduleCleanup(): Promise<Date> {
    const query = `SELECT schedule_retention_cleanup()`;
    
    try {
      await this.prisma.$queryRawUnsafe(query);
      const nextCleanup = new Date(Date.now() + this.CLEANUP_INTERVAL);
      
      logger.info(`Retention cleanup scheduled for: ${nextCleanup.toISOString()}`);
      return nextCleanup;
    } catch (error) {
      logger.error('Failed to schedule retention cleanup:', error);
      throw new Error('Unable to schedule retention cleanup');
    }
  }

  /**
   * Get storage statistics for retention planning
   */
  async getStorageStats(): Promise<{
    totalSize: number;
    projectedGrowth: number;
    retentionCompliance: number;
  }> {
    try {
      // Get table sizes
      const sizeQuery = `
        SELECT 
          schemaname,
          tablename,
          pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
          pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
        FROM pg_tables 
        WHERE tablename IN (
          'audit_logs', 'decision_packets', 'evidence_packages', 
          'gateway_logs', 'federation_audit_logs', 'compliance_reports'
        )
      `;
      
      const tables = await this.prisma.$queryRawUnsafe<any[]>(sizeQuery);
      const totalSize = tables.reduce((sum, table) => sum + parseInt(table.size_bytes), 0);
      
      // Get retention status
      const status = await this.getRetentionStatus();
      const totalRecords = status.reduce((sum, table) => sum + table.totalRecords, 0);
      const expiredRecords = status.reduce((sum, table) => sum + table.recordsOverRetention, 0);
      
      // Calculate compliance percentage
      const retentionCompliance = totalRecords > 0 ? 
        ((totalRecords - expiredRecords) / totalRecords) * 100 : 100;
      
      // Project growth (simple linear projection)
      const projectedGrowth = totalSize * 0.1; // 10% annual growth estimate
      
      return {
        totalSize,
        projectedGrowth,
        retentionCompliance
      };
    } catch (error) {
      logger.error('Failed to get storage stats:', error);
      throw new Error('Unable to retrieve storage statistics');
    }
  }

  /**
   * Validate retention configuration
   */
  async validateConfiguration(): Promise<{
    isValid: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    try {
      // Check if retention functions exist
      const functionCheck = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT proname FROM pg_proc 
        WHERE proname IN ('apply_7_year_retention', 'cleanup_old_audit_data', 'schedule_retention_cleanup')
      `);
      
      if (functionCheck.length < 3) {
        issues.push('Not all retention functions are properly configured');
        recommendations.push('Run migration 20260409_implement_7_year_retention');
      }
      
      // Check if retention view exists
      const viewCheck = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT viewname FROM pg_views WHERE viewname = 'retention_status'
      `);
      
      if (viewCheck.length === 0) {
        issues.push('Retention monitoring view is missing');
        recommendations.push('Create retention_status view');
      }
      
      // Check table indexes
      const indexCheck = await this.prisma.$queryRawUnsafe<any[]>(`
        SELECT indexname FROM pg_indexes 
        WHERE indexname LIKE '%_created_at' AND tablename IN (
          'audit_logs', 'decision_packets', 'evidence_packages', 
          'gateway_logs', 'federation_audit_logs', 'compliance_reports'
        )
      `);
      
      if (indexCheck.length < 6) {
        issues.push('Missing retention indexes on some tables');
        recommendations.push('Create created_at indexes for all retention tables');
      }
      
      // Get current retention status
      const status = await this.getRetentionStatus();
      const expiredRecords = status.reduce((sum, table) => sum + table.recordsOverRetention, 0);
      
      if (expiredRecords > 0) {
        issues.push(`${expiredRecords} records exceed 7-year retention limit`);
        recommendations.push('Run retention cleanup to remove expired records');
      }
      
      return {
        isValid: issues.length === 0,
        issues,
        recommendations
      };
    } catch (error) {
      logger.error('Failed to validate retention configuration:', error);
      return {
        isValid: false,
        issues: ['Unable to validate retention configuration'],
        recommendations: ['Check database connectivity and permissions']
      };
    }
  }

  /**
   * Generate retention compliance report
   */
  async generateComplianceReport(): Promise<{
    reportId: string;
    generatedAt: Date;
    retentionPeriod: number;
    status: string;
    tables: {
      name: string;
      totalRecords: number;
      expiredRecords: number;
      complianceRate: number;
    }[];
    summary: {
      totalRecords: number;
      totalExpired: number;
      overallCompliance: number;
      storageUtilization: number;
    };
  }> {
    const status = await this.getRetentionStatus();
    const storageStats = await this.getStorageStats();
    
    const tables = status.map(table => ({
      name: table.tableName,
      totalRecords: table.totalRecords,
      expiredRecords: table.recordsOverRetention,
      complianceRate: table.totalRecords > 0 ? 
        ((table.totalRecords - table.recordsOverRetention) / table.totalRecords) * 100 : 100
    }));
    
    const totalRecords = tables.reduce((sum, table) => sum + table.totalRecords, 0);
    const totalExpired = tables.reduce((sum, table) => sum + table.expiredRecords, 0);
    const overallCompliance = totalRecords > 0 ? ((totalRecords - totalExpired) / totalRecords) * 100 : 100;
    
    return {
      reportId: crypto.randomUUID(),
      generatedAt: new Date(),
      retentionPeriod: this.RETENTION_YEARS,
      status: overallCompliance >= 95 ? 'compliant' : 'non-compliant',
      tables,
      summary: {
        totalRecords,
        totalExpired,
        overallCompliance,
        storageUtilization: storageStats.totalSize
      }
    };
  }

  /**
   * Export retention configuration for backup
   */
  async exportConfiguration(): Promise<{
    version: string;
    exportedAt: Date;
    config: RetentionConfig;
    status: RetentionStatus[];
  }> {
    const [config, status] = await Promise.all([
      this.getConfig(),
      this.getRetentionStatus()
    ]);
    
    return {
      version: '1.0.0',
      exportedAt: new Date(),
      config,
      status
    };
  }
}

// Singleton instance
let retentionService: RetentionService | null = null;

export function getRetentionService(prisma: PrismaClient): RetentionService {
  if (!retentionService) {
    retentionService = new RetentionService(prisma);
  }
  return retentionService;
}
