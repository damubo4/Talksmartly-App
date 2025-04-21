import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
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
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  private authService = inject(AuthService);
  private _snackBar = inject(MatSnackBar);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  FormRegister: FormGroup;
  hide_1 = true;
  hide_2 = true;
  samePasswords = true;
  textError = false;
  spinner: boolean = false;

  constructor(private formBuilder: FormBuilder) {
    this.FormRegister = this.formBuilder.group({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      repeat_password: ['', [Validators.required]],
      phone: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.FormRegister.get('repeat_password')?.valueChanges.subscribe({
      next: (value) => {
        this.comparePasswords(value, 'password');
      },
    });

    this.FormRegister.get('password')?.valueChanges.subscribe({
      next: (value) => {
        this.comparePasswords(value, 'repeat_password');
      },
    });

    this.route.queryParamMap.subscribe((params: any) => {
      sessionStorage.setItem('token', params.get('token'));
    });
  }

  comparePasswords(value: string, type: string) {
    if (value == this.FormRegister.get(type)?.value) {
      this.samePasswords = false;
      this.textError = false;
    } else {
      this.samePasswords = true;
      this.textError = true;
    }
  }

  register() {
    this.spinner = true;
    const data = {
      password: this.FormRegister.get('password')?.value,
      name: this.FormRegister.get('name')?.value,
      lastName: this.FormRegister.get('lastName')?.value,
      phoneNumber: this.FormRegister.get('phone')?.value,
    };

    this.authService.register(data).subscribe({
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
