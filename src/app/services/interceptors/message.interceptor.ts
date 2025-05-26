import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AlertService } from '../message/alert.service';
import { catchError, throwError } from 'rxjs';


export const messageInterceptor: HttpInterceptorFn = (req, next) => {

  const alertService = inject(AlertService);

  return next(req).pipe(
    catchError((error) => {
        console.log(error)
        const { validation, status } = error.error;

        if (status === 422 && Array.isArray(validation)) {
          validation.forEach(v => {
            alertService.showErrorMessage({message: v.message});
          });
        } else if (error.error && error.error.message) {
          alertService.showErrorMessage({message: error.error.message});
        } else {
          alertService.showErrorMessage({message: 'Ha ocurrido un error inesperado'});
        }
        return throwError(() => error);
      })
  );
};
