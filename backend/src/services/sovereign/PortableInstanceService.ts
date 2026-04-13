// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';

class PortableInstanceServiceImpl {
  private configs = new Map<string, any>();
  private images = new Map<string, any>();

  async createConfig(data: any) {
    const id = `pconfig-${crypto.randomUUID().slice(0, 8)}`;
    const config = { id, organizationId: data.organizationId, createdBy: data.createdBy, name: data.name || 'Portable Config', services: data.services || ['council', 'evidence', 'crypto'], storageSize: data.storageSize || '8GB', createdAt: new Date().toISOString() };
    this.configs.set(id, config);
    return config;
  }

  listConfigs(orgId: string) { return [...this.configs.values()].filter(c => !orgId || c.organizationId === orgId); }
  getConfig(id: string) { return this.configs.get(id) || null; }

  async buildImage(configId: string) {
    const config = this.configs.get(configId);
    if (!config) throw new Error('Config not found');
    const id = `img-${crypto.randomUUID().slice(0, 8)}`;
    const image: any = { id, configId, status: 'building', progress: 0, size: null, createdAt: new Date().toISOString() };
    this.images.set(id, image);
    // Simulate build completion
    setTimeout(() => { image.status = 'ready'; image.progress = 100; image.size = '2.4GB'; }, 100);
    return image;
  }

  listImages(configId?: string) { return [...this.images.values()].filter(i => !configId || i.configId === configId); }
  getImage(id: string) { return this.images.get(id) || null; }

  getBuildProgress(id: string) {
    const image = this.images.get(id);
    if (!image) return null;
    return { id, status: image.status, progress: image.progress };
  }

  async downloadImage(id: string) {
    const image = this.images.get(id);
    if (!image) throw new Error('Image not found');
    if (image.status !== 'ready') throw new Error('Image not ready');
    return { id, downloadUrl: `/api/portable/images/${id}/binary`, size: image.size, checksum: crypto.createHash('md5').update(id).digest('hex') };
  }
}

export const portableInstanceService = new PortableInstanceServiceImpl();
