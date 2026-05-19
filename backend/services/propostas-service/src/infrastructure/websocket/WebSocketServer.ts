import { WebSocketServer as WSS, WebSocket } from 'ws';
import { Server } from 'http';
import { entrarNaSala, sairDaSala, limparSalasDoCliente } from './WebSocketRoomManager';

let wss: WSS;

export function iniciarWebSocketServer(server: Server): void {
  wss = new WSS({ server });

  wss.on('connection', (ws: WebSocket) => {
    console.log('[WS] Cliente conectado. Total:', wss.clients.size);

    (ws as any).isAlive = true;
    ws.on('pong', () => { (ws as any).isAlive = true; });

    ws.on('message', (data) => {
      try {
        const msg = JSON.parse(data.toString());

        if (msg.tipo === 'inscrever') {
          entrarNaSala(msg.sala, ws);
          ws.send(JSON.stringify({ tipo: 'inscrito', sala: msg.sala }));
        }

        if (msg.tipo === 'cancelar') {
          sairDaSala(msg.sala, ws);
        }
      } catch {
        console.error('[WS] Mensagem inválida recebida');
      }
    });

    ws.on('close', () => {
      limparSalasDoCliente(ws);
      console.log('[WS] Cliente desconectado. Total:', wss.clients.size);
    });

    ws.on('error', (err) => {
      console.error('[WS] Erro no cliente:', err.message);
    });

    ws.send(JSON.stringify({ tipo: 'conexao', mensagem: 'Conectado ao Frella WS!' }));
  });

  const intervalo = setInterval(() => {
    wss.clients.forEach((ws: any) => {
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

export function broadcast(evento: object): void {
  if (!wss) return;
  const payload = JSON.stringify(evento);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
  console.log('[WS] Broadcast enviado para', wss.clients.size, 'clientes');
}

export function getClientCount(): number {
  return wss?.clients.size ?? 0;
}