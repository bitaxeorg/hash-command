import { Routes } from '@angular/router';
import { SwarmComponent } from './swarm/swarm.component';

export const routes: Routes = [
  { path: '', redirectTo: 'swarm', pathMatch: 'full' },
    {
      path: 'swarm',
      component: SwarmComponent
    },
    { path: '**', redirectTo: '' }
];
