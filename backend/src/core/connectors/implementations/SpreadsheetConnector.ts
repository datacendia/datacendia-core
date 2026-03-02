// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - SPREADSHEET CONNECTOR
// Universal CSV/Excel file upload connector for enterprise data import
// Every enterprise has Excel - this is the universal fallback
// =============================================================================

import { BaseConnector, ConnectorConfig, SyncOptions, SyncResult } from '../BaseConnector.js';
import { ServiceHealth } from '../../services/BaseService.js';
// Database import - using in-memory storage for now
// import { prisma } from '../../../config/database.js';
import * as fs from 'fs';
import * as path from 'path';
import { parse as csvParse } from 'csv-parse/sync';
import ExcelJS from 'exceljs';
import { getErrorMessage } from '../../../utils/errors.js';

// =============================================================================
// TYPES
// =============================================================================

export interface SpreadsheetConfig extends ConnectorConfig {
  /** Upload directory for files */
  uploadDir?: string;
  
  /** Maximum file size in MB */
  maxFileSizeMB?: number;
  
  /** Allowed file extensions */
  allowedExtensions?: string[];
  
  /** Auto-detect column types */
  autoDetectTypes?: boolean;
  
  /** First row contains headers */
  hasHeaders?: boolean;
  
  /** Date format for parsing */
  dateFormat?: string;
  
  /** Decimal separator */
  decimalSeparator?: '.' | ',';
}

export interface SpreadsheetParseOptions {
  hasHeaders?: boolean;
  skipRows?: number;
  limitRows?: number;
  columns?: string[];
  sheet?: string | number;
  dateColumns?: string[];
  numberColumns?: string[];
}

export interface ParsedRow {
  [key: string]: string | number | boolean | Date | null;
}

export interface SpreadsheetParseResult {
  success: boolean;
  filename: string;
  fileType: 'csv' | 'xlsx' | 'xls';
  sheets?: string[];
  columns: SpreadsheetColumn[];
  rows: ParsedRow[];
  rowCount: number;
  errors: SpreadsheetError[];
  warnings: SpreadsheetWarning[];
  parseTime: number;
}

export interface SpreadsheetColumn {
  name: string;
  originalName: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'mixed';
  nullable: boolean;
  sampleValues: any[];
  uniqueCount: number;
  nullCount: number;
}

export interface SpreadsheetError {
  row?: number;
  column?: string;
  message: string;
  value?: any;
}

export interface SpreadsheetWarning {
  row?: number;
  column?: string;
  message: string;
  suggestion?: string;
}

export interface SpreadsheetImportResult {
  success: boolean;
  tableName: string;
  rowsImported: number;
  rowsSkipped: number;
  columnsCreated: number;
  errors: SpreadsheetError[];
  warnings: SpreadsheetWarning[];
  duration: number;
}

// =============================================================================
// SPREADSHEET CONNECTOR
// =============================================================================

export class SpreadsheetConnector extends BaseConnector {
  private uploadDir: string;
  private maxFileSizeMB: number;
  private allowedExtensions: string[];
  private autoDetectTypes: boolean;
  private hasHeaders: boolean;

  constructor(config: SpreadsheetConfig = { name: 'SpreadsheetConnector', version: '1.0.0', dependencies: [] }) {
    super(config);
    
    this.uploadDir = config.uploadDir || './uploads';
    this.maxFileSizeMB = config.maxFileSizeMB || 100;
    this.allowedExtensions = config.allowedExtensions || ['.csv', '.xlsx', '.xls'];
    this.autoDetectTypes = config.autoDetectTypes ?? true;
    this.hasHeaders = config.hasHeaders ?? true;
    
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  // ---------------------------------------------------------------------------
  // ABSTRACT METHOD IMPLEMENTATIONS
  // ---------------------------------------------------------------------------

  async connect(): Promise<void> {
    this.logger.info('Spreadsheet connector ready');
    this.connectionStatus.connected = true;
    this.connectionStatus.capabilities = this.getCapabilities();
  }

  async disconnect(): Promise<void> {
    this.logger.info('Spreadsheet connector disconnected');
    this.connectionStatus.connected = false;
  }

  async testConnection(): Promise<boolean> {
    // Spreadsheet connector is always "connected" if upload dir is writable
    try {
      const testFile = path.join(this.uploadDir, '.test');
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);
      return true;
    } catch {
      return false;
    }
  }

  getCapabilities(): string[] {
    return [
      'csv_import',
      'excel_import',
      'xlsx_import',
      'xls_import',
      'column_detection',
      'type_inference',
      'data_validation',
      'batch_import',
      'incremental_append',
      'schema_detection',
    ];
  }

  async sync(options: SyncOptions): Promise<SyncResult> {
    // For spreadsheet connector, sync means processing any pending uploaded files
    const startTime = Date.now();
    const errors: Array<{ entity: string; error: string }> = [];
    let entitiesSynced = 0;

    try {
      const pendingFiles = await this.getPendingUploads();
      
      for (const file of pendingFiles) {
        try {
          const result = await this.parseFile(file.path);
          if (result.success) {
            entitiesSynced += result.rowCount;
          } else {
            errors.push({ entity: file.name, error: result.errors[0]?.message || 'Parse failed' });
          }
        } catch (err: unknown) {
          errors.push({ entity: file.name, error: getErrorMessage(err) });
        }
      }

      return {
        success: errors.length === 0,
        entitiesSynced,
        errors,
        duration: Date.now() - startTime,
      };
    } catch (err: unknown) {
      return {
        success: false,
        entitiesSynced: 0,
        errors: [{ entity: 'sync', error: getErrorMessage(err) }],
        duration: Date.now() - startTime,
      };
    }
  }

  // ---------------------------------------------------------------------------
  // FILE VALIDATION
  // ---------------------------------------------------------------------------

  /**
   * Validate an uploaded file
   */
  validateFile(filePath: string): { valid: boolean; error?: string } {
    // Check file exists
    if (!fs.existsSync(filePath)) {
      return { valid: false, error: 'File not found' };
    }

    // Check extension
    const ext = path.extname(filePath).toLowerCase();
    if (!this.allowedExtensions.includes(ext)) {
      return { valid: false, error: `Invalid file type. Allowed: ${this.allowedExtensions.join(', ')}` };
    }

    // Check file size
    const stats = fs.statSync(filePath);
    const sizeMB = stats.size / (1024 * 1024);
    if (sizeMB > this.maxFileSizeMB) {
      return { valid: false, error: `File too large. Maximum: ${this.maxFileSizeMB}MB, Got: ${sizeMB.toFixed(2)}MB` };
    }

    return { valid: true };
  }

  // ---------------------------------------------------------------------------
  // FILE PARSING
  // ---------------------------------------------------------------------------

  /**
   * Parse a spreadsheet file (CSV or Excel)
   */
  async parseFile(
    filePath: string,
    options: SpreadsheetParseOptions = {}
  ): Promise<SpreadsheetParseResult> {
    const startTime = Date.now();
    const filename = path.basename(filePath);
    const ext = path.extname(filePath).toLowerCase();

    // Validate
    const validation = this.validateFile(filePath);
    if (!validation.valid) {
      return {
        success: false,
        filename,
        fileType: this.getFileType(ext),
        columns: [],
        rows: [],
        rowCount: 0,
        errors: [{ message: validation.error! }],
        warnings: [],
        parseTime: Date.now() - startTime,
      };
    }

    try {
      if (ext === '.csv') {
        return await this.parseCSV(filePath, options);
      } else if (ext === '.xlsx' || ext === '.xls') {
        return await this.parseExcel(filePath, options);
      } else {
        throw new Error(`Unsupported file type: ${ext}`);
      }
    } catch (err: unknown) {
      return {
        success: false,
        filename,
        fileType: this.getFileType(ext),
        columns: [],
        rows: [],
        rowCount: 0,
        errors: [{ message: `Parse error: ${getErrorMessage(err)}` }],
        warnings: [],
        parseTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Parse CSV file
   */
  private async parseCSV(
    filePath: string,
    options: SpreadsheetParseOptions
  ): Promise<SpreadsheetParseResult> {
    const startTime = Date.now();
    const filename = path.basename(filePath);
    const hasHeaders = options.hasHeaders ?? this.hasHeaders;
    
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Detect delimiter (comma, semicolon, tab)
    const delimiter = this.detectDelimiter(content);
    
    // Parse CSV
    const rawRecords = csvParse(content, {
      columns: hasHeaders,
      skip_empty_lines: true,
      skip_records_with_error: true,
      delimiter,
      from: (options.skipRows || 0) + 1,
      to: options.limitRows ? (options.skipRows || 0) + options.limitRows : undefined,
    });

    // Convert to ParsedRow format if necessary
    let records: ParsedRow[];
    if (hasHeaders) {
      records = rawRecords as unknown as ParsedRow[];
    } else {
      records = (rawRecords as unknown as string[][]).map((row) => {
        const record: ParsedRow = {};
        row.forEach((val, colIdx) => {
          record[`column_${colIdx + 1}`] = val;
        });
        return record;
      });
    }

    // Detect columns and types
    const columns = this.detectColumns(records, hasHeaders);
    
    // Type-cast rows
    const rows = this.castRows(records, columns);
    
    const warnings = this.generateWarnings(records, columns);

    return {
      success: true,
      filename,
      fileType: 'csv',
      columns,
      rows,
      rowCount: rows.length,
      errors: [],
      warnings,
      parseTime: Date.now() - startTime,
    };
  }

  /**
   * Parse Excel file (.xlsx or .xls)
   */
  private async parseExcel(
    filePath: string,
    options: SpreadsheetParseOptions
  ): Promise<SpreadsheetParseResult> {
    const startTime = Date.now();
    const filename = path.basename(filePath);
    const hasHeaders = options.hasHeaders ?? this.hasHeaders;
    
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    
    // Get sheet names
    const sheetNames = workbook.worksheets.map((ws: ExcelJS.Worksheet) => ws.name);
    
    // Select sheet
    let worksheet: ExcelJS.Worksheet;
    if (options.sheet !== undefined) {
      if (typeof options.sheet === 'number') {
        worksheet = workbook.worksheets[options.sheet];
      } else {
        worksheet = workbook.getWorksheet(options.sheet) as ExcelJS.Worksheet;
      }
    } else {
      worksheet = workbook.worksheets[0];
    }

    if (!worksheet) {
      return {
        success: false,
        filename,
        fileType: 'xlsx',
        sheets: sheetNames,
        columns: [],
        rows: [],
        rowCount: 0,
        errors: [{ message: 'Worksheet not found' }],
        warnings: [],
        parseTime: Date.now() - startTime,
      };
    }

    // Extract rows
    const rawRows: any[][] = [];
    worksheet.eachRow((row: ExcelJS.Row, rowNumber: number) => {
      if (options.skipRows && rowNumber <= options.skipRows) return;
      if (options.limitRows && rawRows.length >= options.limitRows + (hasHeaders ? 1 : 0)) return;
      
      rawRows.push(row.values as any[]);
    });

    // Convert to records
    let headers: string[] = [];
    let dataRows: any[][];
    
    if (hasHeaders && rawRows.length > 0) {
      // First row is headers (Excel arrays are 1-indexed, first element is empty)
      headers = (rawRows[0].slice(1) || []).map((h, i) => 
        h ? String(h).trim() : `Column_${i + 1}`
      );
      dataRows = rawRows.slice(1);
    } else {
      // Generate column names
      const colCount = Math.max(...rawRows.map(r => r.length)) - 1;
      headers = Array.from({ length: colCount }, (_, i) => `Column_${i + 1}`);
      dataRows = rawRows;
    }

    // Convert to records format
    const records: ParsedRow[] = dataRows.map(row => {
      const record: ParsedRow = {};
      headers.forEach((header, i) => {
        record[header] = row[i + 1] ?? null; // +1 because Excel arrays are 1-indexed
      });
      return record;
    });

    // Detect column types
    const columns = this.detectColumns(records, true);
    
    // Cast rows
    const rows = this.castRows(records, columns);
    
    const warnings = this.generateWarnings(records, columns);

    return {
      success: true,
      filename,
      fileType: 'xlsx',
      sheets: sheetNames,
      columns,
      rows,
      rowCount: rows.length,
      errors: [],
      warnings,
      parseTime: Date.now() - startTime,
    };
  }

  // ---------------------------------------------------------------------------
  // TYPE DETECTION
  // ---------------------------------------------------------------------------

  /**
   * Detect CSV delimiter
   */
  private detectDelimiter(content: string): string {
    const firstLine = content.split('\n')[0] || '';
    const counts = {
      ',': (firstLine.match(/,/g) || []).length,
      ';': (firstLine.match(/;/g) || []).length,
      '\t': (firstLine.match(/\t/g) || []).length,
    };
    
    const max = Math.max(...Object.values(counts));
    if (counts[','] === max) return ',';
    if (counts[';'] === max) return ';';
    if (counts['\t'] === max) return '\t';
    return ',';
  }

  /**
   * Detect column metadata from data
   */
  private detectColumns(records: ParsedRow[], hasHeaders: boolean): SpreadsheetColumn[] {
    if (records.length === 0) return [];
    
    const firstRecord = records[0];
    const columnNames = Object.keys(firstRecord);
    
    return columnNames.map(name => {
      const values = records.map(r => r[name]).filter(v => v !== null && v !== undefined && v !== '');
      const sampleValues = values.slice(0, 5);
      const uniqueValues = new Set(values.map(v => String(v)));
      const nullCount = records.filter(r => r[name] === null || r[name] === undefined || r[name] === '').length;
      
      return {
        name: this.sanitizeColumnName(name),
        originalName: name,
        type: this.detectColumnType(values),
        nullable: nullCount > 0,
        sampleValues,
        uniqueCount: uniqueValues.size,
        nullCount,
      };
    });
  }

  /**
   * Detect column type from sample values
   */
  private detectColumnType(values: any[]): SpreadsheetColumn['type'] {
    if (values.length === 0) return 'string';
    
    let numberCount = 0;
    let booleanCount = 0;
    let dateCount = 0;
    let stringCount = 0;
    
    for (const value of values) {
      if (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)) && value.trim() !== '')) {
        numberCount++;
      } else if (typeof value === 'boolean' || (typeof value === 'string' && ['true', 'false', 'yes', 'no', '0', '1'].includes(value.toLowerCase()))) {
        booleanCount++;
      } else if (value instanceof Date || this.isDateString(String(value))) {
        dateCount++;
      } else {
        stringCount++;
      }
    }
    
    const total = values.length;
    const threshold = 0.8; // 80% must match for type detection
    
    if (numberCount / total >= threshold) return 'number';
    if (booleanCount / total >= threshold) return 'boolean';
    if (dateCount / total >= threshold) return 'date';
    if (stringCount / total >= threshold) return 'string';
    return 'mixed';
  }

  /**
   * Check if string looks like a date
   */
  private isDateString(value: string): boolean {
    const datePatterns = [
      /^\d{4}-\d{2}-\d{2}$/,                    // 2024-01-15
      /^\d{2}\/\d{2}\/\d{4}$/,                  // 01/15/2024
      /^\d{2}-\d{2}-\d{4}$/,                    // 01-15-2024
      /^\d{4}\/\d{2}\/\d{2}$/,                  // 2024/01/15
      /^\d{1,2}\s+\w+\s+\d{4}$/,                // 15 January 2024
      /^\w+\s+\d{1,2},?\s+\d{4}$/,              // January 15, 2024
    ];
    
    return datePatterns.some(p => p.test(value.trim()));
  }

  /**
   * Sanitize column name for database
   */
  private sanitizeColumnName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')
      .slice(0, 63); // PostgreSQL limit
  }

  // ---------------------------------------------------------------------------
  // DATA TRANSFORMATION
  // ---------------------------------------------------------------------------

  /**
   * Cast rows to detected types
   */
  private castRows(records: ParsedRow[], columns: SpreadsheetColumn[]): ParsedRow[] {
    return records.map(record => {
      const castRecord: ParsedRow = {};
      
      for (const col of columns) {
        const value = record[col.originalName];
        castRecord[col.name] = this.castValue(value, col.type);
      }
      
      return castRecord;
    });
  }

  /**
   * Cast a single value
   */
  private castValue(value: any, type: SpreadsheetColumn['type']): any {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    
    switch (type) {
      case 'number':
        const num = typeof value === 'number' ? value : Number(String(value).replace(',', '.'));
        return isNaN(num) ? null : num;
        
      case 'boolean':
        if (typeof value === 'boolean') return value;
        const strVal = String(value).toLowerCase();
        return ['true', 'yes', '1'].includes(strVal);
        
      case 'date':
        if (value instanceof Date) return value;
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date;
        
      default:
        return String(value);
    }
  }

  // ---------------------------------------------------------------------------
  // DATA IMPORT
  // ---------------------------------------------------------------------------

  // In-memory storage; production upgrade: use database
  private importedData: Map<string, { metadata: any; rows: ParsedRow[] }> = new Map();

  /**
   * Import parsed data to in-memory storage
   * Production upgrade: write to PostgreSQL/data warehouse
   */
  async importToDatabase(
    parseResult: SpreadsheetParseResult,
    tableName: string,
    options: {
      appendIfExists?: boolean;
      organizationId: string;
      userId: string;
    }
  ): Promise<SpreadsheetImportResult> {
    const startTime = Date.now();
    const errors: SpreadsheetError[] = [];
    const warnings: SpreadsheetWarning[] = [];
    let rowsImported = 0;
    let rowsSkipped = 0;

    try {
      const key = `${options.organizationId}:${tableName}`;
      
      // Store metadata and rows
      const existing = this.importedData.get(key);
      
      if (existing && options.appendIfExists) {
        // Append to existing data
        existing.rows.push(...parseResult.rows);
        rowsImported = parseResult.rows.length;
      } else {
        // Create new or replace
        this.importedData.set(key, {
          metadata: {
            organizationId: options.organizationId,
            tableName,
            filename: parseResult.filename,
            fileType: parseResult.fileType,
            columns: parseResult.columns,
            createdAt: new Date(),
            createdBy: options.userId,
          },
          rows: parseResult.rows,
        });
        rowsImported = parseResult.rows.length;
      }

      this.logger.info(`Imported ${rowsImported} rows from ${parseResult.filename} to ${tableName}`);

      return {
        success: true,
        tableName,
        rowsImported,
        rowsSkipped,
        columnsCreated: parseResult.columns.length,
        errors,
        warnings,
        duration: Date.now() - startTime,
      };
    } catch (err: unknown) {
      return {
        success: false,
        tableName,
        rowsImported,
        rowsSkipped,
        columnsCreated: 0,
        errors: [{ message: `Import failed: ${getErrorMessage(err)}` }],
        warnings,
        duration: Date.now() - startTime,
      };
    }
  }

  /**
   * Get imported data by table name
   */
  getImportedData(organizationId: string, tableName: string): { metadata: any; rows: ParsedRow[] } | null {
    const key = `${organizationId}:${tableName}`;
    return this.importedData.get(key) || null;
  }

  /**
   * List all imported tables for an organization
   */
  listImportedTables(organizationId: string): Array<{ tableName: string; rowCount: number; columns: SpreadsheetColumn[] }> {
    const tables: Array<{ tableName: string; rowCount: number; columns: SpreadsheetColumn[] }> = [];
    
    for (const [key, data] of this.importedData.entries()) {
      if (key.startsWith(`${organizationId}:`)) {
        tables.push({
          tableName: data.metadata.tableName,
          rowCount: data.rows.length,
          columns: data.metadata.columns,
        });
      }
    }
    
    return tables;
  }

  /**
   * Query imported data with simple filters
   */
  queryImportedData(
    organizationId: string,
    tableName: string,
    options: {
      limit?: number;
      offset?: number;
      filters?: Array<{ column: string; operator: '=' | '!=' | '>' | '<' | 'contains'; value: any }>;
      orderBy?: { column: string; direction: 'asc' | 'desc' };
    } = {}
  ): { rows: ParsedRow[]; total: number } {
    const data = this.getImportedData(organizationId, tableName);
    if (!data) return { rows: [], total: 0 };

    let rows = [...data.rows];

    // Apply filters
    if (options.filters) {
      for (const filter of options.filters) {
        rows = rows.filter(row => {
          const value = row[filter.column];
          switch (filter.operator) {
            case '=': return value === filter.value;
            case '!=': return value !== filter.value;
            case '>': return (value ?? 0) > filter.value;
            case '<': return (value ?? 0) < filter.value;
            case 'contains': return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
            default: return true;
          }
        });
      }
    }

    // Apply ordering
    if (options.orderBy) {
      rows.sort((a, b) => {
        const aVal = a[options.orderBy!.column] ?? '';
        const bVal = b[options.orderBy!.column] ?? '';
        const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return options.orderBy!.direction === 'desc' ? -cmp : cmp;
      });
    }

    const total = rows.length;

    // Apply pagination
    if (options.offset) rows = rows.slice(options.offset);
    if (options.limit) rows = rows.slice(0, options.limit);

    return { rows, total };
  }

  /**
   * Preview data before import
   */
  async previewImport(
    filePath: string,
    options: SpreadsheetParseOptions = {}
  ): Promise<{
    success: boolean;
    columns: SpreadsheetColumn[];
    sampleRows: ParsedRow[];
    totalRows: number;
    warnings: SpreadsheetWarning[];
    error?: string;
  }> {
    try {
      const result = await this.parseFile(filePath, {
        ...options,
        limitRows: 100, // Just preview first 100 rows
      });

      return {
        success: result.success,
        columns: result.columns,
        sampleRows: result.rows.slice(0, 10),
        totalRows: result.rowCount,
        warnings: result.warnings,
        error: result.errors[0]?.message,
      };
    } catch (err: unknown) {
      return {
        success: false,
        columns: [],
        sampleRows: [],
        totalRows: 0,
        warnings: [],
        error: getErrorMessage(err),
      };
    }
  }

  // ---------------------------------------------------------------------------
  // UTILITIES
  // ---------------------------------------------------------------------------

  private getFileType(ext: string): 'csv' | 'xlsx' | 'xls' {
    if (ext === '.csv') return 'csv';
    if (ext === '.xlsx') return 'xlsx';
    return 'xls';
  }

  private generateWarnings(records: ParsedRow[], columns: SpreadsheetColumn[]): SpreadsheetWarning[] {
    const warnings: SpreadsheetWarning[] = [];
    
    for (const col of columns) {
      // Warn about mixed types
      if (col.type === 'mixed') {
        warnings.push({
          column: col.originalName,
          message: `Column "${col.originalName}" has mixed data types`,
          suggestion: 'Consider cleaning data before import',
        });
      }
      
      // Warn about high null count
      const nullPercent = (col.nullCount / records.length) * 100;
      if (nullPercent > 50) {
        warnings.push({
          column: col.originalName,
          message: `Column "${col.originalName}" is ${nullPercent.toFixed(0)}% empty`,
          suggestion: 'Consider removing this column if not needed',
        });
      }
    }
    
    return warnings;
  }

  private async getPendingUploads(): Promise<Array<{ name: string; path: string }>> {
    // Get files in upload directory
    const files = fs.readdirSync(this.uploadDir);
    return files
      .filter(f => this.allowedExtensions.includes(path.extname(f).toLowerCase()))
      .map(f => ({ name: f, path: path.join(this.uploadDir, f) }));
  }
}

// Export singleton instance
export const spreadsheetConnector = new SpreadsheetConnector();
