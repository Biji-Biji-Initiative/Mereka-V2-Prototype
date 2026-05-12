import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceRow } from '../services/analytics.types';

// Reusable data table for All-{category} pages. Columns match the Figma
// "All Experiences" frame (5208:186993): NAME | TYPE | MODE | DATE | LOCATION
// | TICKETS | FILL RATE | RATING | REVENUE.
@Component({
  selector: 'mereka-service-table',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white border border-neutral-200 rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-neutral-50 text-[11px] uppercase tracking-wider text-neutral-500">
            <tr>
              <th class="text-left px-5 py-3 font-medium">{{ nameLabel }}</th>
              <th class="text-left px-3 py-3 font-medium">Type</th>
              <th class="text-left px-3 py-3 font-medium">Mode</th>
              <th class="text-left px-3 py-3 font-medium">Date</th>
              <th class="text-left px-3 py-3 font-medium">Location</th>
              <th class="text-right px-3 py-3 font-medium">Tickets</th>
              <th class="text-right px-3 py-3 font-medium">Fill rate</th>
              <th class="text-right px-3 py-3 font-medium">Rating</th>
              <th class="text-right px-5 py-3 font-medium">Revenue</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100">
            <tr *ngFor="let r of rows; trackBy: trackId"
                (click)="rowClick.emit(r)"
                class="hover:bg-neutral-50 cursor-pointer transition">
              <td class="px-5 py-4">
                <div class="font-medium text-neutral-900 uppercase tracking-wide text-[13px]">{{ r.name }}</div>
                <div class="text-xs text-neutral-500">{{ r.owner }}</div>
              </td>
              <td class="px-3 py-4 text-neutral-700">{{ r.type }}</td>
              <td class="px-3 py-4 text-neutral-700">{{ r.mode }}</td>
              <td class="px-3 py-4 text-neutral-700">{{ r.date }}</td>
              <td class="px-3 py-4 text-neutral-700 max-w-[200px] truncate" [title]="r.location">{{ r.location }}</td>
              <td class="px-3 py-4 text-right tabular-nums">{{ r.tickets }}</td>
              <td class="px-3 py-4 text-right tabular-nums">
                <span [ngClass]="fillClass(r.fillRate)">{{ r.fillRate }}%</span>
              </td>
              <td class="px-3 py-4 text-right tabular-nums">
                {{ r.rating | number:'1.1-1' }} <span class="text-warning">★</span>
              </td>
              <td class="px-5 py-4 text-right tabular-nums font-medium">RM {{ r.revenue | number }}</td>
            </tr>
            <tr *ngIf="!rows.length">
              <td colspan="9" class="px-5 py-12 text-center text-neutral-500">No records yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class ServiceTableComponent {
  @Input() rows: ServiceRow[] = [];
  @Input() nameLabel = 'Service';
  @Output() rowClick = new EventEmitter<ServiceRow>();

  trackId(_: number, r: ServiceRow) { return r.id; }
  fillClass(v: number): string {
    if (v >= 85) return 'text-success font-medium';
    if (v >= 70) return 'text-neutral-700';
    return 'text-warning font-medium';
  }
}
