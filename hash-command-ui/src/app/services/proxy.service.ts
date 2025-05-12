import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProxySettings } from '../models/IProxySettings';

const uri = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class ProxyService {


  constructor(private httpClient: HttpClient) { }

  public getStatus() {
    return this.httpClient.get(`${uri}/proxy/status`);
  }

  public enableProxy(proxySettings: IProxySettings) {
    return this.httpClient.post(`${uri}/proxy/enable`, proxySettings);
  }

  public disableProxy() {
    return this.httpClient.delete(`${uri}/proxy/disable`);
  }
}
