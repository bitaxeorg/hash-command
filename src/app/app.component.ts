import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import {AppLayoutComponent, AppMenuComponent, AppTopBarComponent, AxeOsThemeComponent } from '@bitaxeorg/axe-os-lib';

@Component({
    selector: 'app-root',
    imports: [AxeOsThemeComponent, AppLayoutComponent, AppMenuComponent, AppTopBarComponent, RouterModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'hash-command';

  public menuItems = [
    {
        label: '~$',
        items: [
            // { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
            { label: 'Swarm', icon: 'pi pi-fw pi-share-alt', routerLink: ['swarm'] },
            // { label: 'Network', icon: 'pi pi-fw pi-wifi', routerLink: ['network'] },
            // { label: 'Pool Settings', icon: 'pi pi-fw pi-server', routerLink: ['pool'] },
            // { label: 'Customization', icon: 'pi pi-fw pi-palette', routerLink: ['design'] },
            // { label: 'Settings', icon: 'pi pi-fw pi-cog', routerLink: ['settings'] },
            // { label: 'Logs', icon: 'pi pi-fw pi-list', routerLink: ['logs'] },
            // { label: 'Whitepaper', icon: 'pi pi-fw pi-bitcoin', command: () => window.open('/bitcoin.pdf', '_blank') },
        ]
    }
];
}
