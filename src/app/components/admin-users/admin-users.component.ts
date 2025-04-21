import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-users',
  imports: [MatButtonModule, RouterModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss',
})
export class AdminUsersComponent {
  itemsNav = [
    {
      name: 'Agregar usuarios',
      url: '/dashboard/add-users',
    },
    {
      name: 'Ver usuarios',
      url: '/dashboard/all-users',
    },
  ];
}
