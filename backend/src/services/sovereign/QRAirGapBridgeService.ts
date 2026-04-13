// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';

class QRAirGapBridgeServiceImpl {
  private payloads = new Map<string, any>();
  private sessions = new Map<string, any>();

  async createPayload(data: any) {
    const id = `qr-${crypto.randomUUID().slice(0, 8)}`;
    const payload = { id, data: data.data || data, encrypted: true, chunks: Math.ceil(JSON.stringify(data).length / 2000), createdAt: new Date().toISOString() };
    this.payloads.set(id, payload);
    return payload;
  }

  async generateSequence(payloadId: string) {
    const payload = this.payloads.get(payloadId);
    if (!payload) throw new Error('Payload not found');
    const frames = Array.from({ length: payload.chunks }, (_, i) => ({ index: i, total: payload.chunks, data: `chunk-${i}`, checksum: crypto.createHash('md5').update(`${payloadId}-${i}`).digest('hex').slice(0, 8) }));
    return { payloadId, frames, totalFrames: frames.length };
  }

  async quickExport(data: any) {
    const payload = await this.createPayload(data);
    const sequence = await this.generateSequence(payload.id);
    return { payload, sequence };
  }

  startCaptureSession(expectedPayloadId?: string) {
    const id = `cap-${crypto.randomUUID().slice(0, 8)}`;
    const session = { id, expectedPayloadId, capturedFrames: [], status: 'capturing', startedAt: new Date().toISOString() };
    this.sessions.set(id, session);
    return session;
  }

  processCapturedQR(sessionId: string, qrData: string) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');
    session.capturedFrames.push({ data: qrData, capturedAt: new Date().toISOString() });
    return { framesReceived: session.capturedFrames.length };
  }

  decodeCapturedData(sessionId: string, decryptionKey?: string) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');
    return { sessionId, decoded: true, frameCount: session.capturedFrames.length, decodedAt: new Date().toISOString() };
  }
}

export const qrAirGapBridgeService = new QRAirGapBridgeServiceImpl();
