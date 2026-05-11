import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { ProgramsService } from '../../../services/programs.service';

@Component({
  selector: 'mereka-program-members-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center justify-between mb-4 gap-4 flex-wrap">
      <h2 class="font-semibold text-lg">Members ({{ filtered().length }})</h2>
      <div class="flex items-center gap-2 flex-1 max-w-md">
        <input type="search" class="flex-1 px-3 py-2 rounded-full border border-neutral-200 bg-white text-sm"
               placeholder="Search members…" [ngModel]="search()" (ngModelChange)="search.set($event)" />
        <select class="px-3 py-2 rounded-full border border-neutral-200 bg-white text-sm" [ngModel]="role()" (ngModelChange)="role.set($event)">
          <option value="">All roles</option>
          <option value="admin">Admins</option>
          <option value="mentor">Mentors</option>
          <option value="member">Members</option>
        </select>
      </div>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <div *ngFor="let m of filtered()" class="bg-white border border-neutral-200 rounded-lg p-3 text-center">
        <div class="relative">
          <img *ngIf="m.avatar as a" [src]="a" [alt]="m.name" class="w-full aspect-square rounded-md object-cover mb-3" />
          <span *ngIf="m.isOnline" class="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-success border-2 border-white" title="Online"></span>
        </div>
        <div class="text-sm font-medium truncate">{{ m.name }}</div>
        <div *ngIf="m.role && m.role !== 'member'"
             class="mt-1 inline-block text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded text-white"
             [class.bg-error]="m.role === 'admin'" [class.bg-warning]="m.role === 'mentor'">
          {{ m.role }}
        </div>
      </div>
      <div *ngIf="filtered().length === 0" class="col-span-full text-center py-12 text-neutral-500 border border-dashed border-neutral-200 rounded-lg">
        No members match the current search.
      </div>
    </div>
  `,
})
export class ProgramMembersTab {
  private readonly route = inject(ActivatedRoute);
  private readonly programs = inject(ProgramsService);
  readonly search = signal('');
  readonly role = signal<'' | 'admin' | 'mentor' | 'member'>('');
  readonly members = toSignal(this.route.parent!.paramMap.pipe(switchMap((p) => this.programs.members(p.get('slug') ?? ''))), { initialValue: [] });
  readonly filtered = computed(() => {
    const list = this.members(); const q = this.search().trim().toLowerCase(); const role = this.role();
    return list.filter((m) => {
      if (role && (m.role ?? 'member') !== role) return false;
      if (q && !m.name.toLowerCase().includes(q)) return false;
      return true;
    });
  });
}
