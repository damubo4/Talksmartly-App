import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem('token');
  const newRequest = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${token}`),
  });
  return next(newRequest);
};
