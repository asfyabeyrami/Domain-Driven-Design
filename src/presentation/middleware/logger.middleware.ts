import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

interface SafeUserInfo {
  id?: number;
  username?: string;
  role?: string;
  [key: string]: any;
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: (error?: any) => void) {
    const { ip, method, baseUrl, body, query } = req;
    const userAgent = req.get('user-agent') || '';

    // ایجاد یا دریافت correlationId
    const correlationId =
      req.get('x-correlation-id') ||
      `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    req.headers['x-correlation-id'] = correlationId;

    const startAt = process.hrtime();

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const dif = process.hrtime(startAt);
      const responseTime = dif[0] * 1e3 + dif[1] * 1e-6;

      const logMessage = {
        timestamp: new Date().toISOString(),
        method,
        url: baseUrl,
        statusCode,
        responseTime: `${responseTime.toFixed(2)}ms`,
        responseTimeRaw: parseFloat(responseTime.toFixed(2)),
        contentLength,
        correlationId,
        ip,
        userAgent,
        auth: {
          isAuthenticated: this.isAuthenticated(req),
          user: this.getUserInfo(req),
        },
        body: this.sanitizeBody(body),
        query,
        headers: this.getImportantHeaders(req),
        meta: {
          environment: process.env.NODE_ENV || 'development',
          apiVersion: process.env.API_VERSION || '1.0',
          serverTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      };

      // لاگ کردن با سطوح مختلف براساس status code
      if (statusCode >= 500) {
        this.logger.error(JSON.stringify(logMessage, null, 2));
      } else if (statusCode >= 400) {
        this.logger.warn(JSON.stringify(logMessage, null, 2));
      } else {
        this.logger.log(JSON.stringify(logMessage, null, 2));
      }
    });

    next();
  }

  private isAuthenticated(req: Request): boolean {
    // بررسی وجود توکن یا اطلاعات کاربر
    return !!(req['user'] || req.get('authorization'));
  }

  private getUserInfo(req: Request): SafeUserInfo | null {
    if (!req['user']) return null;

    // حذف اطلاعات حساس از اطلاعات کاربر
    const { password, passwordHash, secret, ...safeUserInfo } = req['user'];
    return safeUserInfo;
  }

  private sanitizeBody(body: any): any {
    if (!body) return {};

    const sanitized = JSON.parse(JSON.stringify(body));
    const sensitiveFields = [
      'password',
      'passwordHash',
      'token',
      'secret',
      'credit_card',
      'cardNumber',
      'cvv',
      'pin',
      'access_token',
      'refresh_token',
    ];

    const sanitizeObject = (obj: any) => {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitizeObject(obj[key]);
        } else if (sensitiveFields.includes(key.toLowerCase())) {
          obj[key] = '***';
        }
      }
    };

    sanitizeObject(sanitized);
    return sanitized;
  }

  private getImportantHeaders(req: Request): object {
    const importantHeaders = [
      'x-correlation-id',
      'authorization',
      'content-type',
      'accept',
      'origin',
      'referer',
      'user-agent',
      'x-forwarded-for',
      'x-real-ip',
      'x-request-id',
      'x-api-key',
    ];

    const headers = {};
    importantHeaders.forEach((header) => {
      const value = req.get(header);
      if (value) {
        headers[header] = this.sanitizeHeaderValue(header, value);
      }
    });

    return headers;
  }

  private sanitizeHeaderValue(header: string, value: string): string {
    const sensitiveHeaders = ['authorization', 'x-api-key'];
    if (sensitiveHeaders.includes(header.toLowerCase())) {
      if (value.toLowerCase().startsWith('bearer ')) {
        return 'Bearer ***';
      }
      return '***';
    }
    return value;
  }
}
