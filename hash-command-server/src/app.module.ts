import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebsocketService } from './services/websocket.service';
import { ProxyController } from './controllers/proxy.controller';
import { ProxyService } from './services/proxy.service';

@Module({
  imports: [],
  controllers: [AppController, ProxyController],
  providers: [AppService, WebsocketService, ProxyService],
})
export class AppModule { }
