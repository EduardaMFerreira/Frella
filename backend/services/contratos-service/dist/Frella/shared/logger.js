"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = createLogger;
const winston_1 = __importDefault(require("winston"));
const isProduction = process.env.NODE_ENV === 'production';
const devFormat = winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp({ format: 'HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.printf(({ level, message, timestamp, correlationId, ...meta }) => {
    const corr = correlationId ? ` [${correlationId}]` : '';
    const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level}${corr} ${message}${extra}`;
}));
const prodFormat = winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json());
function createLogger(serviceName) {
    return winston_1.default.createLogger({
        level: process.env.LOG_LEVEL || 'info',
        defaultMeta: { service: serviceName },
        format: isProduction ? prodFormat : devFormat,
        transports: [new winston_1.default.transports.Console()],
    });
}
