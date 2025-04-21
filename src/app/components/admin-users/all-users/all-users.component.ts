import { AdminUsersService } from '../../../services/admin-users/admin-users.service';
import {
  AfterViewInit,
  Component,
  inject,
  ViewChild,
  OnInit,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TitleHeaderService } from '../../../services/title-header/title-header.service';

@Component({
  selector: 'app-all-users',
  imports: [
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    RouterModule,
    MatCheckboxModule,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.scss',
})
export class AllUsersComponent implements OnInit, AfterViewInit {
  private adminUserService = inject(AdminUsersService);
  private router = inject(Router);
  private sessionStorageService = inject(TitleHeaderService);
  private _snackBar = inject(MatSnackBar);
  displayedColumns: string[] = [
    'name',
    'lastName',
    'role',
    'email',
    'phone',
    'status',
    'statusPackage',
    'actions',
  ];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.dataSource = new MatTableDataSource();
    this.sessionStorageService.setVariable('Usuarios');
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getDataUsers();
  }

  getDataUsers() {
    this.adminUserService.getUsers().subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource(res.data.users);
        this.dataSource.paginator = this.paginator;
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteUser(data: any) {
    this.adminUserService.deleteUser(data.id).subscribe({
      next: (res: any) => {
        this.getDataUsers();
        this.openSnackBar(res.message, 'OK');
      },
    });
  }

  editIsActive(id: number, event: any) {
    const data = {
      isActive: event.checked,
    };

    this.adminUserService.editUser(id, data).subscribe({
      next: (res: any) => {
        this.getDataUsers();
        this.openSnackBar(res.message, 'OK');
      },
    });
  }

  editUser(user: any) {
    sessionStorage.setItem('userForEdit', JSON.stringify(user));
    this.router.navigate([`dashboard/edit-user/${user.id}`]);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
