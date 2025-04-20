import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AxeOsThemeComponent } from '@bitaxeorg/axe-os-lib';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, AxeOsThemeComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'hash-commander';
}
