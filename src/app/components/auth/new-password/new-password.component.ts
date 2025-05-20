import { Component, inject, OnInit } from '@angular/core';
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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-password',
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
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss',
})
export class NewPasswordComponent {
  private authService = inject(AuthService);
  private _snackBar = inject(MatSnackBar);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  FormPassword: FormGroup;
  hide_1 = true;
  hide_2 = true;
  samePasswords = true;
  textError = false;
  spinner: boolean = false;
  emailControl = new FormControl('es');
  languages: string[] = ['🇪🇸', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '🇫🇷'];

  constructor(private formBuilder: FormBuilder) {
    this.FormPassword = this.formBuilder.group({
      password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.FormPassword.get('confirm_password')?.valueChanges.subscribe({
      next: (value) => {
        this.comparePasswords(value, 'password');
      },
    });

    this.FormPassword.get('password')?.valueChanges.subscribe({
      next: (value) => {
        this.comparePasswords(value, 'confirm_password');
      },
    });

    this.route.queryParamMap.subscribe((params: any) => {
      sessionStorage.setItem('token', params.get('token'));
    });
  }

  comparePasswords(value: string, type: string) {
    if (value == this.FormPassword.get(type)?.value) {
      this.samePasswords = false;
      this.textError = false;
    } else {
      this.samePasswords = true;
      this.textError = true;
    }
  }

  newPassword() {
    this.spinner = true;
    const data = {
      newPassword: this.FormPassword.get('password')?.value,
    };

    this.authService.newPassword(data).subscribe({
      next: (res: any) => {
        this.spinner = false;
        this.openSnackBar(res.data.message, 'OK');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.spinner = false;
        this.router.navigate(['/recover-password']);
      },
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
