"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationBehavior = validationBehavior;
async function validationBehavior(request, next) {
    if (!request)
        throw new Error("Request inválido");
    return await next();
}
