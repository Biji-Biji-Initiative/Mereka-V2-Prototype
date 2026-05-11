import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'mereka-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="!isLoginPage()">
      <mereka-header />
    </ng-container>
    <main [class]="isLoginPage() ? '' : 'min-h-[calc(100vh-64px)]'">
      <router-outlet />
    </main>
    <ng-container *ngIf="!isLoginPage()">
      <mereka-footer />
    </ng-container>
  `,
})
export class App implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly isLoginPage = signal(false);

  ngOnInit(): void {
    void this.auth.init();

    // Track route changes to hide header/footer on login page
    this.isLoginPage.set(this.router.url.startsWith('/login'));
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.isLoginPage.set(e.urlAfterRedirects.startsWith('/login')));
  }
}
