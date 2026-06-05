"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = runMigrations;
const connection_1 = require("./connection");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function runMigrations() {
    const migrationsDir = path_1.default.join(__dirname, "migrations");
    const files = fs_1.default.readdirSync(migrationsDir).sort();
    for (const file of files) {
        if (!file.endsWith(".sql"))
            continue;
        const sql = fs_1.default.readFileSync(path_1.default.join(migrationsDir, file), "utf-8");
        await connection_1.pool.query(sql);
        console.log(`Migration executada: ${file}`);
    }
}
