import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'mereka-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mereka-header />
    <main class="min-h-[calc(100vh-64px)]"><router-outlet /></main>
    <mereka-footer />
  `,
})
export class App implements OnInit {
  private readonly auth = inject(AuthService);
  ngOnInit(): void { void this.auth.init(); }
}
