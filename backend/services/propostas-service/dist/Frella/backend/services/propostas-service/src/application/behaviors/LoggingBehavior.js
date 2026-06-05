"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggingBehavior = loggingBehavior;
async function loggingBehavior(request, next) {
    console.log("Executando:", request);
    return await next();
}
