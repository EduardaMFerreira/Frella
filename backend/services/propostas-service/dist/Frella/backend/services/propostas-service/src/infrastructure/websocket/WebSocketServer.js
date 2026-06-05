"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iniciarWebSocketServer = iniciarWebSocketServer;
exports.broadcast = broadcast;
exports.getClientCount = getClientCount;
const ws_1 = require("ws");
const WebSocketRoomManager_1 = require("./WebSocketRoomManager");
let wss;
function iniciarWebSocketServer(server) {
    wss = new ws_1.WebSocketServer({ server });
    wss.on('connection', (ws) => {
        console.log('[WS] Cliente conectado. Total:', wss.clients.size);
        ws.isAlive = true;
        ws.on('pong', () => { ws.isAlive = true; });
        ws.on('message', (data) => {
            try {
                const msg = JSON.parse(data.toString());
                if (msg.tipo === 'inscrever') {
                    (0, WebSocketRoomManager_1.entrarNaSala)(msg.sala, ws);
                    ws.send(JSON.stringify({ tipo: 'inscrito', sala: msg.sala }));
                }
                if (msg.tipo === 'cancelar') {
                    (0, WebSocketRoomManager_1.sairDaSala)(msg.sala, ws);
                }
            }
            catch {
                console.error('[WS] Mensagem inválida recebida');
            }
        });
        ws.on('close', () => {
            (0, WebSocketRoomManager_1.limparSalasDoCliente)(ws);
            console.log('[WS] Cliente desconectado. Total:', wss.clients.size);
        });
        ws.on('error', (err) => {
            console.error('[WS] Erro no cliente:', err.message);
        });
        ws.send(JSON.stringify({ tipo: 'conexao', mensagem: 'Conectado ao Frella WS!' }));
    });
    const intervalo = setInterval(() => {
        wss.clients.forEach((ws) => {
            if (ws.isAlive === false) {
                console.log('[WS] Cliente inativo removido');
                return ws.terminate();
            }
            ws.isAlive = false;
            ws.ping();
        });
    }, 30000);
    wss.on('close', () => clearInterval(intervalo));
    console.log('[WS] Servidor WebSocket iniciado');
}
function broadcast(evento) {
    if (!wss)
        return;
    const payload = JSON.stringify(evento);
    wss.clients.forEach((client) => {
        if (client.readyState === ws_1.WebSocket.OPEN) {
            client.send(payload);
        }
    });
    console.log('[WS] Broadcast enviado para', wss.clients.size, 'clientes');
}
function getClientCount() {
    return wss?.clients.size ?? 0;
}
