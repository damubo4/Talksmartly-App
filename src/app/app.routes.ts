import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { RecoverPasswordComponent } from './components/auth/recover-password/recover-password.component';
import { LayoutComponent } from './components/layout/layout.component';
import { NewPasswordComponent } from './components/auth/new-password/new-password.component';
import { authGuard } from './guards/auth.guard';
import { Component } from '@angular/core';
import { AddUsersComponent } from './components/admin-users/add-users/add-users.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { SchedulingComponent } from './components/scheduling/scheduling.component';
import { AllUsersComponent } from './components/admin-users/all-users/all-users.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { FeedbackDetailComponent } from './components/feedback-detail/feedback-detail.component';
import { MaterialComponent } from './components/material/material.component';
import { MaterialAddComponent } from './components/material-add/material-add.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register/:id', component: RegisterComponent },
  { path: 'recover-password', component: RecoverPasswordComponent },
  { path: 'new-password/:id', component: NewPasswordComponent },
  {
    canActivate: [authGuard],
    path: 'dashboard',
    component: LayoutComponent,
    children: [
      {
        path: 'admin-users',
        component: AdminUsersComponent,
      },
      {
        path: 'add-users',
        component: AddUsersComponent,
      },
      {
        path: 'edit-user/:id',
        component: AddUsersComponent,
      },
      {
        path: 'all-users',
        component: AllUsersComponent,
      },
      {
        path: 'scheduling',
        component: SchedulingComponent,
      },
      {
        path: 'feedback',
        component: FeedbackComponent,
      },
      {
        path: 'feedback-detail/:id',
        component: FeedbackDetailComponent,
      },
      {
        path: 'feedback-student/:id',
        component: FeedbackDetailComponent,
      },
      {
        path: 'feedback-teacher',
        component: FeedbackComponent,
      },
      {
        path: 'material',
        component: MaterialComponent,
      },
      {
        path: 'material-add',
        component: MaterialAddComponent,
      },
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
