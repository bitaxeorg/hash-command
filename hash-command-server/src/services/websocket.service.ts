// src/websocket/websocket.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { WebSocketServer, WebSocket } from 'ws';

@Injectable()
export class WebsocketService implements OnModuleInit, OnModuleDestroy {
  private wss: WebSocketServer;
  private clients: Set<WebSocket> = new Set();

  onModuleInit() {
    // Create the WebSocket server
    this.wss = new WebSocketServer({ port: 8080 }); // Or integrate with your HTTP server if needed

    this.wss.on('connection', (ws: WebSocket) => {
      console.log('Client connected');
      this.clients.add(ws);

      ws.on('close', () => {
        console.log('Client disconnected');
        this.clients.delete(ws);
      });

      ws.on('message', (message: string) => {
        console.log('Received message:', message);
        // You can handle client messages here
      });
    });
  }

  broadcast(data: string) {
    for (const client of this.clients) {
      if (client.readyState === client.OPEN) {
        client.send(data);
      }
    }
  }

  onModuleDestroy() {
    this.wss?.close();
  }
}