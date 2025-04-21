import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { GroupService } from '../../../services/counter-classes/group.service';
import { PersonalizedService } from '../../../services/counter-classes/personalized.service';
import { CounterClassesAdminService } from '../../../services/counter/counter-classes-admin.service';

@Component({
  selector: 'app-side-nav',
  imports: [MatIconModule, RouterModule, CommonModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
})
export class SideNavComponent implements OnInit {
  private sessionGroupService = inject(GroupService);
  private sessionPersonalizedService = inject(PersonalizedService);
  private sessionClassesAdminService = inject(CounterClassesAdminService);
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
      permission: ['Student', 'Management', 'Teacher'],
    },
    {
      class: 'available',
      permission: ['Student', 'Management', 'Teacher'],
    },
    {
      class: 'cancelled',
      permission: ['Management', 'Teacher'],
    },
    {
      class: 'full',
      permission: ['Management', 'Teacher'],
    },
    {
      class: 'reserved',
      permission: ['Student', 'Management', 'Teacher'],
    },
    {
      class: 'evaluated',
      permission: ['Student', 'Management', 'Teacher'],
    },
  ];
  filteredItemsNav: any[] = [];
  filteredItemsDots: any[] = [];
  classesPersonalized!: any;
  classesGroup!: any;
  dataAdmin!: any;
  endDate!: any;

  constructor() {
    this.role = sessionStorage.getItem('role');
    this.endDate = sessionStorage.getItem('endDate');
  }

  ngOnInit(): void {
    this.sessionGroupService.getVariable$().subscribe((valor) => {
      this.classesGroup = valor;
    });
    this.sessionPersonalizedService.getVariable$().subscribe((valor) => {
      this.classesPersonalized = valor;
    });

    this.sessionClassesAdminService.getVariable$().subscribe((valor: any) => {
      this.dataAdmin = JSON.parse(valor);
    });

    this.filteredItemsNav = this.itemsNav.filter((item) =>
      item.permission.includes(this.role)
    );

    this.filteredItemsDots = this.itemsDots.filter((item) =>
      item.permission.includes(this.role)
    );
  }

  sinComillas(txt: string) {
    const sinComillas = txt.replace(/"/g, '');
    return sinComillas;
  }
}
