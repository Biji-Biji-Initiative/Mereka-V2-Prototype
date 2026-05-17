import { Injectable, inject, signal, computed } from '@angular/core';
import { AuthService, AuthHub } from './auth.service';

export interface HubFilterOption {
  id: string;
  name: string;
  logo: string | null;
  role?: 'admin' | 'editor' | 'viewer';
}

/**
 * Shared hub filter service — provides a single activeHub signal
 * that dashboard sub-pages can consume to filter their content by hub.
 *
 * The filter options are derived from the authenticated user's hub memberships.
 * When 'all' is selected, no filtering is applied.
 */
@Injectable({ providedIn: 'root' })
export class HubFilterService {
  private readonly auth = inject(AuthService);

  /** Currently selected hub ID, or 'all' for no filter. */
  readonly activeHub = signal<string>('all');

  /** All hubs available to the current user. */
  readonly availableHubs = computed<HubFilterOption[]>(() => {
    const hubs = this.auth.hubs();
    if (hubs.length > 0) {
      return hubs.map(h => ({
        id: h.hubId,
        name: h.hubName,
        logo: h.hubLogo,
        role: h.hubRole,
      }));
    }
    // Fallback for prototype: default hubs when auth doesn't provide them
    return [
      { id: 'mereka', name: 'Mereka', logo: null, role: 'admin' as const },
      { id: 'biji-biji', name: 'Biji-biji Initiative', logo: null, role: 'admin' as const },
      { id: 'microsoft-my', name: 'Microsoft Malaysia', logo: null, role: 'viewer' as const },
      { id: 'mdec', name: 'MDEC', logo: null, role: 'viewer' as const },
    ];
  });

  /** Whether the user is an admin for the currently selected hub. */
  readonly isAdminOfActiveHub = computed(() => {
    const hubId = this.activeHub();
    if (hubId === 'all') return false;
    const hub = this.availableHubs().find(h => h.id === hubId);
    return hub?.role === 'admin';
  });

  /** Set the active hub filter. */
  setActiveHub(hubId: string): void {
    this.activeHub.set(hubId);
  }

  /** Check if a given hub ID matches the current filter (or filter is 'all'). */
  matchesFilter(hubId: string): boolean {
    const active = this.activeHub();
    return active === 'all' || active === hubId;
  }

  /** Filter an array of items that have a hubId property. */
  filterByHub<T extends { hubId?: string; hub?: string; ownerHubId?: string }>(items: T[]): T[] {
    const active = this.activeHub();
    if (active === 'all') return items;
    return items.filter(item => {
      const itemHub = item.hubId ?? item.hub ?? item.ownerHubId ?? '';
      return itemHub === active;
    });
  }
}
