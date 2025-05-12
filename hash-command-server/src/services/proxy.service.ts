import { Injectable } from "@nestjs/common";
import { StratumProxy } from "models/StratumProxy";
import { Server, Socket } from "net";
import { WebsocketService } from "./websocket.service";
import { IProxySettings, ProxySettingsDto } from "models/ProxySettings";

@Injectable()
export class ProxyService {

    public server: Server;
    private sockets: Set<Socket> = new Set();

    constructor(private websocketService: WebsocketService) { }

    public async enableProxy(proxySettings: IProxySettings) {
        if (this.server == null) {
            this.server = new Server(async (socket: Socket) => {

                this.sockets.add(socket);

                socket.on('close', () => {
                    this.sockets.delete(socket);
                });

                const proxy = new StratumProxy(socket, this.websocketService, proxySettings);


            });
        }
        this.server.listen(3333, () => {
            console.log(`Stratum server is listening on port 3333`);
        });
    }

    public listening() {
        return this.server?.listening;
    }

    public disableProxy() {
        if (this.server == null) {
            return;
        }

        // First, stop accepting new connections
        this.server.close();

        // Then, destroy all existing sockets
        for (const socket of this.sockets) {
            socket.destroy();
        }

        // Clear the set
        this.sockets.clear();
    }

}