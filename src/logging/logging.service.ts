import { Injectable } from "@nestjs/common";
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggingService {
  private currentLevel: number;
  private logFilePath: string;
  private errorLogFilePath: string;
  private maxFileSize: number; 
  private logDir: string;

  constructor() {
    const level = Number(process.env.LOG_LEVEL);
    this.currentLevel = isNaN(level) ? 2 : level;
    
    const maxSize = Number(process.env.MAX_LOG_FILE_SIZE);
    this.maxFileSize = isNaN(maxSize) ? 1024 : maxSize;
    
    this.logDir = path.join(process.cwd(), 'logs');
    this.logFilePath = path.join(this.logDir, 'application.log');
    this.errorLogFilePath = path.join(this.logDir, 'error.log');
    
    this.ensureLogDirectory();
  }

  private ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private getFileSizeInKB(filePath: string): number {
    try {
      const stats = fs.statSync(filePath);
      return stats.size / 1024; 
    } catch (error) {
      return 0;
    }
  }

  private rotateLogFile(filePath: string) {
    if (!fs.existsSync(filePath)) return;
    
    const fileSize = this.getFileSizeInKB(filePath);
    
    if (fileSize >= this.maxFileSize) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const ext = path.extname(filePath);
      const basename = path.basename(filePath, ext);
      const dirname = path.dirname(filePath);
      const rotatedPath = path.join(dirname, `${basename}-${timestamp}${ext}`);
      
      fs.renameSync(filePath, rotatedPath);
    }
  }

  private writeToFile(filePath: string, message: string) {
    try {
      console.log('Attempting to write to:', filePath);
      this.rotateLogFile(filePath);
      fs.appendFileSync(filePath, message + '\n', 'utf8');
      console.log('Successfully wrote to file');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  private shouldLog(level: number): boolean {
    return level <= this.currentLevel;
  }

  formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  log(message: string) {
    if (!this.shouldLog(2)) return;
    const formattedMessage = this.formatMessage('LOG', message);
    console.log(formattedMessage);
    this.writeToFile(this.logFilePath, formattedMessage);
  }
  
  warn(message: string) { 
    if (!this.shouldLog(1)) return;
    const formattedMessage = this.formatMessage('WARN', message);
    console.warn(formattedMessage);
    this.writeToFile(this.logFilePath, formattedMessage);
  }
  
  error(message: string, trace?: string) { 
    if (!this.shouldLog(0)) return;
    const formattedMessage = this.formatMessage('ERROR', message);
    const traceMessage = trace ? this.formatMessage('TRACE', trace) : '';
    
    console.error(formattedMessage);
    if (trace) console.log(traceMessage);
    
    this.writeToFile(this.errorLogFilePath, formattedMessage);
    if (trace) this.writeToFile(this.errorLogFilePath, traceMessage);
    
    this.writeToFile(this.logFilePath, formattedMessage);
    if (trace) this.writeToFile(this.logFilePath, traceMessage);
  } 
  
  debug(message: string) {
    if (!this.shouldLog(3)) return;
    const formattedMessage = this.formatMessage('DEBUG', message);
    console.debug(formattedMessage);
    this.writeToFile(this.logFilePath, formattedMessage);
  }
  
  verbose(message: string) {
    if (!this.shouldLog(4)) return;
    const formattedMessage = this.formatMessage('VERBOSE', message);
    console.log(formattedMessage);
    this.writeToFile(this.logFilePath, formattedMessage);
  }
}