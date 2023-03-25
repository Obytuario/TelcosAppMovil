import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, retry, catchError, from, switchMap } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})



export class InterceptorService implements HttpInterceptor {

  constructor(private storageService: StorageService) {
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    return from(this.storageService.getSessionLocal())
      .pipe(
        switchMap(token => {

          req = req.clone({
            headers: req.headers
              .set('OPHJsonNamingStrategy', `camelcase`)
              .set('Accept', 'application/json, text/plain, */*')
              .set('Content-Encoding', 'gzip, deflate, br')
              .set('__Language__', 'es-CO')

          });

          if (token) {
            req = req.clone({ headers: req.headers.set('Authorization', `Bearer ${token.token}`) });
          }

          if (!req.headers.has('Content-Type')) {
            req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
          }

          return next.handle(req).pipe(
            retry(1),
            catchError((error: HttpErrorResponse) => {
              let errorMessage = '';
              if (error.error instanceof ErrorEvent) {
                // client-side error
                errorMessage = `Error: ${error.error.message}`;
              } else {
                // server-side error
                errorMessage = `Error Status: ${error.status}\nMessage: ${error.message}`;
                if (
                  error.status === 401 ||
                  error.status === 402 ||
                  error.status === 403
                ) {
                  //this.sessionService.clean();
                }
              }
              return throwError(() => new Error(errorMessage));
            })
          );
        })
      );

  }
}
