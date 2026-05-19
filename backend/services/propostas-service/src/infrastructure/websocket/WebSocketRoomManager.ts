import { WebSocket } from 'ws';

const salas = new Map<string, Set<WebSocket>>();

export function entrarNaSala(chave: string, ws: WebSocket): void {
  if (!salas.has(chave)) salas.set(chave, new Set());
  salas.get(chave)!.add(ws);
  console.log(`[WS-Room] Cliente entrou na sala: ${chave}`);
}

export function sairDaSala(chave: string, ws: WebSocket): void {
  salas.get(chave)?.delete(ws);
  console.log(`[WS-Room] Cliente saiu da sala: ${chave}`);
}

export function broadcastParaSala(chave: string, evento: object): void {
  const clientes = salas.get(chave);
  if (!clientes) return;
  const payload = JSON.stringify(evento);
  clientes.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) ws.send(payload);
  });
  console.log(`[WS-Room] Broadcast sala ${chave}: ${clientes.size} cliente(s)`);
}

export function limparSalasDoCliente(ws: WebSocket): void {
  salas.forEach((clientes) => {
    clientes.delete(ws);
  });
}