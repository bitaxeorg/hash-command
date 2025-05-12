import { Socket } from "net";
import { Transform } from "stream";
import * as bitcoinjs from 'bitcoinjs-lib';
import { eRequestMethod } from "models/enums/eRequestMethod";
import { plainToInstance } from 'class-transformer';
import { MiningSubmitMessage } from "./stratum-messages/MiningSubmitMessage";
import { eResponseMethod } from "./enums/eResponseMethod";
import { IMiningNotify } from "./stratum-messages/IMiningNotify";

import { calculateDifficulty, calculateMerkleRootHash, calculateNetworkDifficulty, swapEndianWords } from './Utils';
import { v4 as uuidv4 } from 'uuid';
import { WebsocketService } from "src/services/websocket.service";
import { IProxySettings } from "./ProxySettings";
import { of } from "rxjs";


export class StratumProxy {

  public id: string;
  private clientSocket: Socket;
  private extraNonceAndSessionId: string;
  private curentJob: IMiningNotify;

  constructor(
    private readonly serverSocket: Socket,
    private readonly websocketService: WebsocketService,
    private readonly proxySettings: IProxySettings
  ) {

    this.id = uuidv4();

    this.clientSocket = new Socket();

    const upInterceptor = this.createInterceptor('to-pool');
    const downInterceptor = this.createInterceptor('from-pool');

    this.serverSocket
      .pipe(upInterceptor)
      .pipe(this.clientSocket);


    this.clientSocket
      .pipe(downInterceptor)
      .pipe(this.serverSocket);


    this.clientSocket.connect(this.proxySettings.port, this.proxySettings.uri, () => {
      console.log('Connected to TCP server');
    });
  }


  private createInterceptor(direction: 'to-pool' | 'from-pool'): Transform {
    let buffer: string = '';
    return new Transform({
      transform: (chunk, _encoding, callback) => {
        const text = chunk.toString("utf8");
        console.log(`[${direction}] raw →`, text);
        this.websocketService.broadcast(`[${direction}] →${text}`);
        buffer += text;
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        let passMessage = true;

        lines
          .filter(m => m.length > 0)
          .forEach(async (m) => {
            try {
              passMessage = this.handleMessage(m, direction);
            } catch (e) {
              console.error(e);
              callback(e);
            }
          });

        if (passMessage) {
          callback(null, chunk);
        } else {
          console.log('Message Bypass')
          callback(null, null);
        }
      }
    });
  }

  private handleMessage(message: string, direction: string): boolean {

    const parsedMessage = JSON.parse(message);

    if (direction == 'from-pool') {
      this.handleMessageFromPool(parsedMessage);
      return true;
    }
    else if (direction == 'to-pool') {
      return this.handleMessageToPool(parsedMessage);
    }
    return true;
  }

  private handleMessageFromPool(parsedMessage: any) {
    switch (parsedMessage.method) {
      case eResponseMethod.MINING_NOTIFY: {
        this.curentJob = parsedMessage;
        break;
      }
      case undefined: {
        if (parsedMessage.result?.[0]?.[0]?.[0] == 'mining.notify') {
          this.extraNonceAndSessionId = parsedMessage.result[1];
          console.log(`extraNonceAndSessionId: ${this.extraNonceAndSessionId}`)
        }
        break;
      }
    }
  }

  private handleMessageToPool(parsedMessage: any): boolean {
    switch (parsedMessage.method) {
      case eRequestMethod.SUBMIT: {
        const miningSubmitMessage = plainToInstance(
          MiningSubmitMessage,
          parsedMessage,
        );

        const coinbaseTx = `${this.curentJob.params[2]}${this.extraNonceAndSessionId}${miningSubmitMessage.extraNonce2}${this.curentJob.params[3]}`;
        const coinbaseHash = bitcoinjs.crypto.hash256(Buffer.from(coinbaseTx, 'hex'));

        const block = new bitcoinjs.Block();
        block.version = (parseInt(this.curentJob.params[5], 16) ^ parseInt(miningSubmitMessage.versionMask, 16));
        block.prevHash = swapEndianWords(Buffer.from(this.curentJob.params[1], 'hex'));
        block.merkleRoot = calculateMerkleRootHash(coinbaseHash, this.curentJob.params[4]);
        block.timestamp = parseInt(miningSubmitMessage.ntime, 16);
        block.bits = parseInt(this.curentJob.params[6], 16);
        block.nonce = parseInt(miningSubmitMessage.nonce, 16);

        const header = block.toBuffer(true);
        const { submissionDifficulty } = calculateDifficulty(header);

        const networkDiff = calculateNetworkDifficulty(block.bits);
        console.log(`submissionDifficulty: ${submissionDifficulty}`);
        console.log(`Network diff ${networkDiff}`);

        if (submissionDifficulty >= networkDiff && this.proxySettings.withholdBlock == true) {
          return false;
        }

        break;
      }
    }

    return true;
  }





}