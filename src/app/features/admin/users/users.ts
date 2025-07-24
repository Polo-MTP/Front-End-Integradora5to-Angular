import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { AdminService } from '../../../core/services/admin.service';
import { User } from '../../../core/types/admin.types';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CardModule, TableModule, CommonModule, InputTextModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css'],
})
export class Users {
  users: User[] = [];
  totalRecords = 0;
  loading = true;

  private searchSubject = new Subject<string>();
  globalFilterValue = '';


  constructor(private adminService: AdminService) {
    this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(value => {
      this.globalFilterValue = value;
      this.loadUsers({
        first: 0,
        rows: 10,
        sortField: 'id',
        sortOrder: 1,
        globalFilter: this.globalFilterValue,
      });
    })
  }

  loadUsers(event: any) {
    this.loading = true;

    const page =
      event.first !== undefined && event.rows !== undefined
        ? Math.floor(event.first / event.rows) + 1
        : 1;

    const perPage = event.rows || 10;

    const params = {
      page,
      perPage,
      sortField: event.sortField || 'id',
      sortOrder: event.sortOrder === 1 ? 'asc' : 'desc',
      globalFilter: event.globalFilter || '',
    };

    this.adminService.getUsers(params).subscribe({
      next: (res) => {
        this.users = res.data;
        this.totalRecords = res.meta.total;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  onGlobalFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
}

}
