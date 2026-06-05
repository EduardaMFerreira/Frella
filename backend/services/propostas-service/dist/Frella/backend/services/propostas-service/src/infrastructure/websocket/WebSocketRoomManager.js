"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entrarNaSala = entrarNaSala;
exports.sairDaSala = sairDaSala;
exports.broadcastParaSala = broadcastParaSala;
exports.limparSalasDoCliente = limparSalasDoCliente;
const ws_1 = require("ws");
const salas = new Map();
function entrarNaSala(chave, ws) {
    if (!salas.has(chave))
        salas.set(chave, new Set());
    salas.get(chave).add(ws);
    console.log(`[WS-Room] Cliente entrou na sala: ${chave}`);
}
function sairDaSala(chave, ws) {
    salas.get(chave)?.delete(ws);
    console.log(`[WS-Room] Cliente saiu da sala: ${chave}`);
}
function broadcastParaSala(chave, evento) {
    const clientes = salas.get(chave);
    if (!clientes)
        return;
    const payload = JSON.stringify(evento);
    clientes.forEach((ws) => {
        if (ws.readyState === ws_1.WebSocket.OPEN)
            ws.send(payload);
    });
    console.log(`[WS-Room] Broadcast sala ${chave}: ${clientes.size} cliente(s)`);
}
function limparSalasDoCliente(ws) {
    salas.forEach((clientes) => {
        clientes.delete(ws);
    });
}
