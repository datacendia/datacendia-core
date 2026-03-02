/**
 * Connector — F I X Connector
 *
 * External system connector for third-party integrations.
 *
 * @exports FIX_MSG_TYPES, FIX_TAGS, FIXConnectorConfig, FIXMessage, FIXOrder, FIXExecution
 * @module connectors/core/FIXConnector
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * FIX PROTOCOL CONNECTOR - Financial Information eXchange
 * =============================================================================
 * Enterprise FIX 4.2/4.4/5.0 protocol implementation for trading systems,
 * order routing, and market data with session management and message sequencing.
 */

import { EventEmitter } from 'events';
import net from 'net';
import tls from 'tls';
import crypto from 'crypto';
import { BaseConnector, ConnectorConfig, ConnectorMetadata, ConnectorStatus } from '../BaseConnector.js';
import { logger } from '../../utils/logger.js';

// =============================================================================
// FIX MESSAGE TYPES
// =============================================================================

export const FIX_MSG_TYPES = {
  HEARTBEAT: '0',
  TEST_REQUEST: '1',
  RESEND_REQUEST: '2',
  REJECT: '3',
  SEQUENCE_RESET: '4',
  LOGOUT: '5',
  LOGON: 'A',
  NEW_ORDER_SINGLE: 'D',
  ORDER_CANCEL_REQUEST: 'F',
  ORDER_CANCEL_REPLACE: 'G',
  ORDER_STATUS_REQUEST: 'H',
  EXECUTION_REPORT: '8',
  ORDER_CANCEL_REJECT: '9',
  MARKET_DATA_REQUEST: 'V',
  MARKET_DATA_SNAPSHOT: 'W',
  MARKET_DATA_INCREMENTAL: 'X',
  SECURITY_LIST_REQUEST: 'x',
  SECURITY_LIST: 'y',
  QUOTE_REQUEST: 'R',
  QUOTE: 'S',
} as const;

export const FIX_TAGS = {
  BeginString: 8,
  BodyLength: 9,
  MsgType: 35,
  SenderCompID: 49,
  TargetCompID: 56,
  MsgSeqNum: 34,
  SendingTime: 52,
  CheckSum: 10,
  TestReqID: 112,
  HeartBtInt: 108,
  EncryptMethod: 98,
  ResetSeqNumFlag: 141,
  Text: 58,
  ClOrdID: 11,
  Symbol: 55,
  Side: 54,
  OrderQty: 38,
  OrdType: 40,
  Price: 44,
  TimeInForce: 59,
  ExecType: 150,
  OrdStatus: 39,
  ExecID: 17,
  OrderID: 37,
  LastPx: 31,
  LastQty: 32,
  CumQty: 14,
  AvgPx: 6,
  MDReqID: 262,
  SubscriptionRequestType: 263,
  MarketDepth: 264,
  MDUpdateType: 265,
  NoMDEntryTypes: 267,
  MDEntryType: 269,
  NoRelatedSym: 146,
  SecurityReqID: 320,
  SecurityListRequestType: 559,
} as const;

// =============================================================================
// TYPES
// =============================================================================

export interface FIXConnectorConfig extends ConnectorConfig {
  fixVersion: '4.2' | '4.4' | '5.0';
  host: string;
  port: number;
  senderCompId: string;
  targetCompId: string;
  heartbeatInterval?: number;
  useTLS?: boolean;
  tlsOptions?: tls.ConnectionOptions;
  resetSeqNum?: boolean;
  username?: string;
  password?: string;
}

export interface FIXMessage {
  msgType: string;
  fields: Map<number, string>;
  raw?: string;
}

export interface FIXOrder {
  clOrdId: string;
  symbol: string;
  side: '1' | '2'; // 1=Buy, 2=Sell
  quantity: number;
  orderType: '1' | '2' | '3' | '4'; // 1=Market, 2=Limit, 3=Stop, 4=StopLimit
  price?: number;
  timeInForce?: '0' | '1' | '3' | '4'; // 0=Day, 1=GTC, 3=IOC, 4=FOK
}

export interface FIXExecution {
  execId: string;
  orderId: string;
  clOrdId: string;
  execType: string;
  ordStatus: string;
  symbol: string;
  side: string;
  lastPx?: number;
  lastQty?: number;
  cumQty?: number;
  avgPx?: number;
}

// =============================================================================
// FIX CONNECTOR
// =============================================================================

export abstract class FIXConnector extends BaseConnector {
  protected fixConfig: FIXConnectorConfig;
  protected socket?: net.Socket | tls.TLSSocket;
  protected inSeqNum = 1;
  protected outSeqNum = 1;
  protected heartbeatTimer?: NodeJS.Timeout;
  protected testRequestTimer?: NodeJS.Timeout;
  protected messageBuffer = '';
  protected pendingMessages = new Map<string, FIXMessage>();

  constructor(config: FIXConnectorConfig) {
    super(config);
    this.fixConfig = {
      heartbeatInterval: 30,
      resetSeqNum: true,
      ...config,
    };
  }

  // ---------------------------------------------------------------------------
  // CONNECTION
  // ---------------------------------------------------------------------------

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.status = 'connecting';
      this.emit('status', this.status);

      const connectHandler = () => {
        this.log('info', 'TCP connection established, sending logon');
        this.sendLogon();
      };

      const dataHandler = (data: Buffer) => {
        this.messageBuffer += data.toString();
        this.processBuffer();
      };

      const errorHandler = (error: Error) => {
        this.log('error', `Socket error: ${error.message}`);
        this.emit('error', error);
        if (this.status === 'connecting') {
          reject(error);
        }
      };

      const closeHandler = () => {
        this.log('info', 'Socket closed');
        this.cleanup();
        this.status = 'disconnected';
        this.emit('status', this.status);
      };

      if (this.fixConfig.useTLS) {
        this.socket = tls.connect(
          this.fixConfig.port,
          this.fixConfig.host,
          this.fixConfig.tlsOptions || {},
          connectHandler
        );
      } else {
        this.socket = net.createConnection(
          this.fixConfig.port,
          this.fixConfig.host,
          connectHandler
        );
      }

      this.socket.on('data', dataHandler);
      this.socket.on('error', errorHandler);
      this.socket.on('close', closeHandler);

      // Wait for logon response
      const logonTimeout = setTimeout(() => {
        if (this.status === 'connecting') {
          reject(new Error('Logon timeout'));
          this.socket?.destroy();
        }
      }, 30000);

      this.once('logon', () => {
        clearTimeout(logonTimeout);
        this.status = 'connected';
        this.emit('status', this.status);
        this.startHeartbeat();
        resolve();
      });
    });
  }

  async disconnect(): Promise<void> {
    if (this.status === 'connected') {
      this.sendLogout('Normal disconnect');
      await this.sleep(1000);
    }

    this.cleanup();
    this.socket?.destroy();
    this.socket = undefined;
    this.status = 'disconnected';
    this.emit('status', this.status);
  }

  async testConnection(): Promise<boolean> {
    if (!this.socket || this.status !== 'connected') {
      return false;
    }

    const testReqId = crypto.randomUUID();
    this.sendTestRequest(testReqId);

    return new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(false), 10000);
      this.once('heartbeat', () => {
        clearTimeout(timeout);
        resolve(true);
      });
    });
  }

  // ---------------------------------------------------------------------------
  // MESSAGE BUILDING
  // ---------------------------------------------------------------------------

  protected buildMessage(msgType: string, fields: Map<number, string>): string {
    const version = this.getBeginString();
    const body = new Map<number, string>();

    // Add standard header fields
    body.set(FIX_TAGS.MsgType, msgType);
    body.set(FIX_TAGS.SenderCompID, this.fixConfig.senderCompId);
    body.set(FIX_TAGS.TargetCompID, this.fixConfig.targetCompId);
    body.set(FIX_TAGS.MsgSeqNum, String(this.outSeqNum++));
    body.set(FIX_TAGS.SendingTime, this.getUTCTimestamp());

    // Add message-specific fields
    for (const [tag, value] of fields) {
      body.set(tag, value);
    }

    // Build body string
    let bodyStr = '';
    for (const [tag, value] of body) {
      bodyStr += `${tag}=${value}\x01`;
    }

    // Add BeginString and BodyLength
    const header = `${FIX_TAGS.BeginString}=${version}\x01${FIX_TAGS.BodyLength}=${bodyStr.length}\x01`;

    // Calculate checksum
    const fullMessage = header + bodyStr;
    let sum = 0;
    for (let i = 0; i < fullMessage.length; i++) {
      sum += fullMessage.charCodeAt(i);
    }
    const checksum = String(sum % 256).padStart(3, '0');

    return `${fullMessage}${FIX_TAGS.CheckSum}=${checksum}\x01`;
  }

  protected getBeginString(): string {
    switch (this.fixConfig.fixVersion) {
      case '4.2': return 'FIX.4.2';
      case '4.4': return 'FIX.4.4';
      case '5.0': return 'FIXT.1.1';
      default: return 'FIX.4.4';
    }
  }

  protected getUTCTimestamp(): string {
    const now = new Date();
    return now.toISOString().replace('T', '-').replace('Z', '').replace(/[:-]/g, '').slice(0, -4);
  }

  // ---------------------------------------------------------------------------
  // MESSAGE PARSING
  // ---------------------------------------------------------------------------

  protected processBuffer(): void {
    const SOH = '\x01';

    while (true) {
      // Find complete message
      const checksumMatch = this.messageBuffer.match(/10=\d{3}\x01/);
      if (!checksumMatch) break;

      const endIndex = checksumMatch.index! + checksumMatch[0].length;
      const rawMessage = this.messageBuffer.slice(0, endIndex);
      this.messageBuffer = this.messageBuffer.slice(endIndex);

      // Parse message
      const message = this.parseMessage(rawMessage);
      if (message) {
        this.handleMessage(message);
      }
    }
  }

  protected parseMessage(raw: string): FIXMessage | null {
    const fields = new Map<number, string>();
    const parts = raw.split('\x01').filter(p => p);

    for (const part of parts) {
      const [tagStr, value] = part.split('=');
      if (tagStr && value !== undefined) {
        fields.set(parseInt(tagStr, 10), value);
      }
    }

    const msgType = fields.get(FIX_TAGS.MsgType);
    if (!msgType) return null;

    return { msgType, fields, raw };
  }

  protected handleMessage(message: FIXMessage): void {
    this.emit('message', message);

    switch (message.msgType) {
      case FIX_MSG_TYPES.LOGON:
        this.handleLogon(message);
        break;
      case FIX_MSG_TYPES.LOGOUT:
        this.handleLogout(message);
        break;
      case FIX_MSG_TYPES.HEARTBEAT:
        this.handleHeartbeat(message);
        break;
      case FIX_MSG_TYPES.TEST_REQUEST:
        this.handleTestRequest(message);
        break;
      case FIX_MSG_TYPES.EXECUTION_REPORT:
        this.handleExecutionReport(message);
        break;
      case FIX_MSG_TYPES.MARKET_DATA_SNAPSHOT:
      case FIX_MSG_TYPES.MARKET_DATA_INCREMENTAL:
        this.handleMarketData(message);
        break;
      case FIX_MSG_TYPES.REJECT:
        this.handleReject(message);
        break;
      default:
        this.onMessage(message);
    }
  }

  // ---------------------------------------------------------------------------
  // SESSION MESSAGES
  // ---------------------------------------------------------------------------

  protected sendLogon(): void {
    const fields = new Map<number, string>();
    fields.set(FIX_TAGS.EncryptMethod, '0');
    fields.set(FIX_TAGS.HeartBtInt, String(this.fixConfig.heartbeatInterval));
    if (this.fixConfig.resetSeqNum) {
      fields.set(FIX_TAGS.ResetSeqNumFlag, 'Y');
    }

    const message = this.buildMessage(FIX_MSG_TYPES.LOGON, fields);
    this.socket?.write(message);
    this.log('info', 'Sent logon');
  }

  protected sendLogout(reason?: string): void {
    const fields = new Map<number, string>();
    if (reason) {
      fields.set(FIX_TAGS.Text, reason);
    }

    const message = this.buildMessage(FIX_MSG_TYPES.LOGOUT, fields);
    this.socket?.write(message);
    this.log('info', 'Sent logout');
  }

  protected sendHeartbeat(testReqId?: string): void {
    const fields = new Map<number, string>();
    if (testReqId) {
      fields.set(FIX_TAGS.TestReqID, testReqId);
    }

    const message = this.buildMessage(FIX_MSG_TYPES.HEARTBEAT, fields);
    this.socket?.write(message);
  }

  protected sendTestRequest(testReqId: string): void {
    const fields = new Map<number, string>();
    fields.set(FIX_TAGS.TestReqID, testReqId);

    const message = this.buildMessage(FIX_MSG_TYPES.TEST_REQUEST, fields);
    this.socket?.write(message);
  }

  protected handleLogon(message: FIXMessage): void {
    this.inSeqNum = 1;
    this.emit('logon');
    this.log('info', 'Received logon acknowledgment');
  }

  protected handleLogout(message: FIXMessage): void {
    const text = message.fields.get(FIX_TAGS.Text);
    this.log('info', `Received logout: ${text || 'no reason'}`);
    this.emit('logout', text);
  }

  protected handleHeartbeat(message: FIXMessage): void {
    this.emit('heartbeat');
  }

  protected handleTestRequest(message: FIXMessage): void {
    const testReqId = message.fields.get(FIX_TAGS.TestReqID);
    this.sendHeartbeat(testReqId);
  }

  protected handleReject(message: FIXMessage): void {
    const text = message.fields.get(FIX_TAGS.Text);
    this.log('warn', `Message rejected: ${text}`);
    this.emit('reject', message);
  }

  // ---------------------------------------------------------------------------
  // HEARTBEAT
  // ---------------------------------------------------------------------------

  protected startHeartbeat(): void {
    const interval = (this.fixConfig.heartbeatInterval || 30) * 1000;

    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeat();
    }, interval);

    // Test request if no message received
    this.testRequestTimer = setInterval(() => {
      this.sendTestRequest(crypto.randomUUID());
    }, interval * 2);
  }

  protected stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = undefined;
    }
    if (this.testRequestTimer) {
      clearInterval(this.testRequestTimer);
      this.testRequestTimer = undefined;
    }
  }

  // ---------------------------------------------------------------------------
  // TRADING OPERATIONS
  // ---------------------------------------------------------------------------

  sendNewOrder(order: FIXOrder): void {
    const fields = new Map<number, string>();
    fields.set(FIX_TAGS.ClOrdID, order.clOrdId);
    fields.set(FIX_TAGS.Symbol, order.symbol);
    fields.set(FIX_TAGS.Side, order.side);
    fields.set(FIX_TAGS.OrderQty, String(order.quantity));
    fields.set(FIX_TAGS.OrdType, order.orderType);
    if (order.price) {
      fields.set(FIX_TAGS.Price, String(order.price));
    }
    if (order.timeInForce) {
      fields.set(FIX_TAGS.TimeInForce, order.timeInForce);
    }

    const message = this.buildMessage(FIX_MSG_TYPES.NEW_ORDER_SINGLE, fields);
    this.socket?.write(message);
    this.log('info', `Sent new order: ${order.clOrdId}`);
  }

  sendOrderCancel(origClOrdId: string, clOrdId: string, symbol: string, side: string): void {
    const fields = new Map<number, string>();
    fields.set(FIX_TAGS.ClOrdID, clOrdId);
    fields.set(41, origClOrdId); // OrigClOrdID
    fields.set(FIX_TAGS.Symbol, symbol);
    fields.set(FIX_TAGS.Side, side);

    const message = this.buildMessage(FIX_MSG_TYPES.ORDER_CANCEL_REQUEST, fields);
    this.socket?.write(message);
    this.log('info', `Sent cancel request: ${origClOrdId}`);
  }

  protected handleExecutionReport(message: FIXMessage): void {
    const execution: FIXExecution = {
      execId: message.fields.get(FIX_TAGS.ExecID) || '',
      orderId: message.fields.get(FIX_TAGS.OrderID) || '',
      clOrdId: message.fields.get(FIX_TAGS.ClOrdID) || '',
      execType: message.fields.get(FIX_TAGS.ExecType) || '',
      ordStatus: message.fields.get(FIX_TAGS.OrdStatus) || '',
      symbol: message.fields.get(FIX_TAGS.Symbol) || '',
      side: message.fields.get(FIX_TAGS.Side) || '',
      lastPx: message.fields.get(FIX_TAGS.LastPx) ? parseFloat(message.fields.get(FIX_TAGS.LastPx)!) : undefined,
      lastQty: message.fields.get(FIX_TAGS.LastQty) ? parseFloat(message.fields.get(FIX_TAGS.LastQty)!) : undefined,
      cumQty: message.fields.get(FIX_TAGS.CumQty) ? parseFloat(message.fields.get(FIX_TAGS.CumQty)!) : undefined,
      avgPx: message.fields.get(FIX_TAGS.AvgPx) ? parseFloat(message.fields.get(FIX_TAGS.AvgPx)!) : undefined,
    };

    this.emit('execution', execution);
    this.onExecution(execution);
  }

  // ---------------------------------------------------------------------------
  // MARKET DATA
  // ---------------------------------------------------------------------------

  subscribeMarketData(symbols: string[], reqId: string): void {
    const fields = new Map<number, string>();
    fields.set(FIX_TAGS.MDReqID, reqId);
    fields.set(FIX_TAGS.SubscriptionRequestType, '1'); // Snapshot + Updates
    fields.set(FIX_TAGS.MarketDepth, '0'); // Full book
    fields.set(FIX_TAGS.MDUpdateType, '0'); // Full refresh
    fields.set(FIX_TAGS.NoMDEntryTypes, '2');
    fields.set(FIX_TAGS.MDEntryType, '0'); // Bid
    // Note: In real implementation, need repeating groups handling

    fields.set(FIX_TAGS.NoRelatedSym, String(symbols.length));
    symbols.forEach((sym, i) => {
      fields.set(FIX_TAGS.Symbol, sym);
    });

    const message = this.buildMessage(FIX_MSG_TYPES.MARKET_DATA_REQUEST, fields);
    this.socket?.write(message);
  }

  protected handleMarketData(message: FIXMessage): void {
    this.emit('marketData', message);
    this.onMarketData(message);
  }

  // ---------------------------------------------------------------------------
  // CLEANUP
  // ---------------------------------------------------------------------------

  protected cleanup(): void {
    this.stopHeartbeat();
    this.messageBuffer = '';
    this.pendingMessages.clear();
  }

  protected sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ---------------------------------------------------------------------------
  // DATA FETCH
  // ---------------------------------------------------------------------------

  async fetchData(params?: Record<string, unknown>): Promise<FIXMessage[]> {
    return Array.from(this.pendingMessages.values());
  }

  // ---------------------------------------------------------------------------
  // ABSTRACT METHODS
  // ---------------------------------------------------------------------------

  abstract getMetadata(): ConnectorMetadata;
  protected abstract onMessage(message: FIXMessage): void;
  protected abstract onExecution(execution: FIXExecution): void;
  protected abstract onMarketData(message: FIXMessage): void;
}
