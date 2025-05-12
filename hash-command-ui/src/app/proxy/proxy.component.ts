import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProxyService } from '../services/proxy.service';
import { ButtonModule } from 'primeng/button';
import { WebsocketService } from '../services/websocket.service';
import { map, Observable, scan } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-proxy',
  imports: [ButtonModule, CommonModule, ReactiveFormsModule, InputTextModule, InputNumberModule, CheckboxModule],
  templateUrl: './proxy.component.html',
  styleUrl: './proxy.component.scss'
})
export class ProxyComponent implements OnInit, OnDestroy {

  public websocket$!: Observable<any>;
  public listening: boolean = false;

  public form: FormGroup;

  constructor(
    public proxyService: ProxyService,
    public websocketService: WebsocketService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      uri: ['public-pool.io', Validators.required],
      port: [21496, Validators.required],
      withholdBlock: [false]
    });
  }

  ngOnInit(): void {
    this.websocketService.connect('ws://localhost:8080');

    this.websocket$ = this.websocketService.onMessage().pipe(
      scan((messages: string[], newMessage: any) => {
        const updated = [...messages, newMessage];
        return updated.length > 100 ? updated.slice(updated.length - 100) : updated;
      }, []),
      map(messages => messages.join(''))
    );

    this.proxyService.getStatus().subscribe((status: any) => {
      this.listening = status.listening;
    })
  }

  ngOnDestroy(): void {
    this.websocketService.disconnect();
  }

  public enable() {
    this.proxyService.enableProxy(this.form.value).subscribe({
      next: () => {
        this.listening = true;
      },
      error: () => {
      }
    })
  }

  public disable() {
    this.proxyService.disableProxy().subscribe({
      next: () => {
        this.listening = false;
      },
      error: () => {
      }
    })
  }

}
