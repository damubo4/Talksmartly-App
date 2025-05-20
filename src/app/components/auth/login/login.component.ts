import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  FormLogin: FormGroup;
  hide = true;
  spinner: boolean = false;
  role: any = '';
  emailControl = new FormControl('es');
  languages: string[] = ['🇪🇸', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '🇫🇷'];

  constructor(private formBuilder: FormBuilder) {
    this.FormLogin = this.formBuilder.group({
      user: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  login() {
    this.spinner = true;
    const data = {
      email: this.FormLogin.get('user')?.value,
      password: this.FormLogin.get('password')?.value,
    };

    this.authService.login(data).subscribe({
      next: (res: any) => {
        this.spinner = false;
        sessionStorage.setItem('token', res.data.token);
        sessionStorage.setItem('role', res.data.role);
        sessionStorage.setItem('user', JSON.stringify(res.data));
        sessionStorage.setItem(
          'availabilityClassesPersonalized',
          JSON.stringify(res.data?.package?.countClassPersonalized)
        );
        sessionStorage.setItem(
          'availabilityClassesGroup',
          JSON.stringify(res.data?.package?.countClassGroup)
        );

        sessionStorage.setItem(
          'endDate',
          JSON.stringify(res.data?.package?.endDate)
        );
        sessionStorage.setItem('currentLevel', res.data?.package?.currentLevel);

        this.router.navigate(['/dashboard/scheduling']);
      },
      error: (err) => {
        this.spinner = false;
      },
    });
  }
}
