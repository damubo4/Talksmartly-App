import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
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
  selector: 'app-recover-password',
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
  templateUrl: './recover-password.component.html',
  styleUrl: './recover-password.component.scss',
})
export class RecoverPasswordComponent {
  private authService = inject(AuthService);
  private _snackBar = inject(MatSnackBar);
  private router = inject(Router);
  FormRecover: FormGroup;
  hide = true;
  spinner: boolean = false;

  constructor(private formBuilder: FormBuilder) {
    this.FormRecover = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  sendEmail() {
    this.spinner = true;
    const data = {
      email: this.FormRecover.get('email')?.value,
    };

    this.authService.sendEmail(data).subscribe({
      next: (res: any) => {
        this.spinner = false;
        this.openSnackBar(res.data.message, 'OK');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.spinner = false;
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
