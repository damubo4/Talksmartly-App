import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const _snackBar = inject(MatSnackBar);
  const action = '';
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      _snackBar.open(error.error.message, action, {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      if (
        error.error.message == 'Sesión inválida. Inicia sesión nuevamente.' ||
        error.error.message == 'Invalid or expired token'
      ) {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('token');
        router.navigate(['/login']);
      }
      return throwError(() => error.error.message);
    })
  );
};
