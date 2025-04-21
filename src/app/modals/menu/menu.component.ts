import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [RouterModule, CommonModule, MatIconModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  readonly dialogRef = inject(MatDialogRef<MenuComponent>);
  role: any = '';
  itemsNav = [
    {
      name: 'Administrar usuarios',
      url: '/dashboard/all-users',
      icon: 'filter_list',
      permission: ['Management'],
    },
    {
      name: 'Agendamiento',
      url: '/dashboard/scheduling',
      icon: 'calendar_month',
      permission: ['Teacher', 'Student', 'Management'],
    },
    {
      name: 'Feedback',
      url: '/dashboard/feedback',
      icon: 'rate_review',
      permission: ['Management'],
    },
    {
      name: 'Feedback',
      url: '/dashboard/feedback-student/:id',
      icon: 'rate_review',
      permission: ['Student'],
    },
    {
      name: 'Feedback',
      url: '/dashboard/feedback-teacher',
      icon: 'rate_review',
      permission: ['Teacher'],
    },
    {
      name: 'Material',
      url: '/dashboard/material',
      icon: 'description',
      permission: ['Student', 'Management', 'Teacher'],
    },
  ];

  itemsDots = [
    {
      class: 'pending',
    },
    {
      class: 'available',
    },
    {
      class: 'cancelled',
    },
    {
      class: 'full',
    },
    {
      class: 'reserved',
    },
    {
      class: 'evaluated',
    },
  ];
  filteredItemsNav: any[] = [];
  classesPersonalized!: any;
  classesGroup!: any;

  constructor() {
    this.role = sessionStorage.getItem('role');
    this.classesPersonalized = sessionStorage.getItem(
      'availabilityClassesPersonalized'
    );
    this.classesGroup = sessionStorage.getItem('availabilityClassesGroup');
    this.filteredItemsNav = this.itemsNav.filter((item) =>
      item.permission.includes(this.role)
    );
  }

  closeMenu() {
    this.dialogRef.close();
  }
}
