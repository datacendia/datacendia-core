/**
 * Type Definitions — Ws D
 *
 * TypeScript type definitions and interfaces.
 * @module types/ws.d
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// WebSocket type declarations
declare module 'ws' {
  import { EventEmitter } from 'events';
  import { Server, IncomingMessage } from 'http';
  
  class WebSocket extends EventEmitter {
    static readonly CONNECTING: number;
    static readonly OPEN: number;
    static readonly CLOSING: number;
    static readonly CLOSED: number;
    
    readyState: number;
    
    constructor(address: string | URL, options?: WebSocket.ClientOptions);
    
    close(code?: number, reason?: string): void;
    ping(data?: any, mask?: boolean, cb?: (err: Error) => void): void;
    pong(data?: any, mask?: boolean, cb?: (err: Error) => void): void;
    send(data: any, cb?: (err?: Error) => void): void;
    send(data: any, options: { mask?: boolean; binary?: boolean; compress?: boolean; fin?: boolean }, cb?: (err?: Error) => void): void;
    terminate(): void;
    
    on(event: 'close', listener: (code: number, reason: string) => void): this;
    on(event: 'error', listener: (err: Error) => void): this;
    on(event: 'message', listener: (data: WebSocket.Data) => void): this;
    on(event: 'open', listener: () => void): this;
    on(event: 'ping' | 'pong', listener: (data: Buffer) => void): this;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
  }
  
  namespace WebSocket {
    type Data = string | Buffer | ArrayBuffer | Buffer[];
    
    interface ClientOptions {
      protocol?: string;
      handshakeTimeout?: number;
      perMessageDeflate?: boolean | PerMessageDeflateOptions;
      localAddress?: string;
      protocolVersion?: number;
      headers?: { [key: string]: string };
      origin?: string;
      agent?: any;
      host?: string;
      family?: number;
      checkServerIdentity?(servername: string, cert: any): boolean;
      rejectUnauthorized?: boolean;
      maxPayload?: number;
    }
    
    interface PerMessageDeflateOptions {
      serverNoContextTakeover?: boolean;
      clientNoContextTakeover?: boolean;
      serverMaxWindowBits?: number;
      clientMaxWindowBits?: number;
      zlibDeflateOptions?: {
        flush?: number;
        finishFlush?: number;
        chunkSize?: number;
        windowBits?: number;
        level?: number;
        memLevel?: number;
        strategy?: number;
        dictionary?: Buffer | Buffer[] | DataView;
        info?: boolean;
      };
      zlibInflateOptions?: object;
      threshold?: number;
      concurrencyLimit?: number;
    }
    
    interface ServerOptions {
      host?: string;
      port?: number;
      backlog?: number;
      server?: Server;
      verifyClient?: VerifyClientCallbackAsync | VerifyClientCallbackSync;
      handleProtocols?: any;
      path?: string;
      noServer?: boolean;
      clientTracking?: boolean;
      perMessageDeflate?: boolean | PerMessageDeflateOptions;
      maxPayload?: number;
    }
    
    type VerifyClientCallbackAsync = (info: { origin: string; secure: boolean; req: IncomingMessage }, callback: (res: boolean, code?: number, message?: string, headers?: object) => void) => void;
    type VerifyClientCallbackSync = (info: { origin: string; secure: boolean; req: IncomingMessage }) => boolean;
    
    class Server extends EventEmitter {
      clients: Set<WebSocket>;
      
      constructor(options?: ServerOptions, callback?: () => void);
      
      close(cb?: (err?: Error) => void): void;
      handleUpgrade(request: IncomingMessage, socket: any, upgradeHead: Buffer, callback: (client: WebSocket) => void): void;
      shouldHandle(request: IncomingMessage): boolean;
      
      on(event: 'connection', cb: (socket: WebSocket, request: IncomingMessage) => void): this;
      on(event: 'error', cb: (error: Error) => void): this;
      on(event: 'headers', cb: (headers: string[], request: IncomingMessage) => void): this;
      on(event: 'listening' | 'close', cb: () => void): this;
      on(event: string | symbol, listener: (...args: any[]) => void): this;
    }
  }
  
  export = WebSocket;
}
