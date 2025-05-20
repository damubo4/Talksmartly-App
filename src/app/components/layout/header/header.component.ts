import { Component, inject } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MenuComponent } from '../../../modals/menu/menu.component';
import { TitleHeaderService } from '../../../services/title-header/title-header.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [MatMenuModule, MatButtonModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  readonly dialog = inject(MatDialog);
  private sessionStorageService = inject(TitleHeaderService);
  userData: any;
  role: any = '';
  currentLevel!: any;
  title: string | null = '';
  emailControl = new FormControl('es');
  languages: string[] = ['🇪🇸', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '🇫🇷'];

  constructor() {
    const data: any = sessionStorage.getItem('user');
    this.userData = JSON.parse(data);
    this.role = sessionStorage.getItem('role');

    this.currentLevel = sessionStorage.getItem('currentLevel');
    this.sessionStorageService.getVariable$().subscribe((valor) => {
      this.title = valor;
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: (res: any) => {
        sessionStorage.removeItem('user');
        this.router.navigate(['/login']);
      },
    });
  }

  typeUser(type: any) {
    if (type == 'Student') {
      return 'Estudiante';
    } else if (type == 'Teacher') {
      return 'Profesor';
    } else if (type == 'Management') {
      return 'Administrador';
    } else return '';
  }

  levels(level: any) {
    if (level == 'PRE-INTERMEDIATE') {
      return 'Pre intermedio';
    } else if (level == 'INTRODUCTORY') {
      return 'Introductorio';
    } else if (level == 'BEGINNERS') {
      return 'Principiante';
    } else if (level == 'INTERMEDIATE') {
      return 'Intermedio';
    } else if (level == 'ADVANCE') {
      return 'Avanzado';
    } else return '';
  }

  redirectToWhatsApp(phoneNumber: string, message: string) {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, '_blank');
  }

  menuModal() {
    const dialogRef = this.dialog.open(MenuComponent, {
      autoFocus: false,
      position: {
        left: '0',
      },
    });
  }
}
