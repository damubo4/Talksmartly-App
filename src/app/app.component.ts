import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'TalkSmartly';
  private transloco = inject(TranslocoService);

  constructor() {
    this.transloco.setDefaultLang('es'); // Idioma por defecto
    this.transloco.setActiveLang('es'); // Idioma activo inicial
  }
}
