import { Routes } from '@angular/router';
import { SwarmComponent } from './swarm/swarm.component';
import { ProxyComponent } from './proxy/proxy.component';

export const routes: Routes = [
  { path: '', redirectTo: 'swarm', pathMatch: 'full' },
  {
    path: 'swarm',
    component: SwarmComponent
  },
  {
    path: 'proxy',
    component: ProxyComponent
  },
  { path: '**', redirectTo: '' }
];
