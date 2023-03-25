import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map, Observable, retry, throwError, catchError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Login, Menu, RequestResult, Session } from '../interfaces/interfaces';
import { ResolveRequestResultService } from '../utils/resolve-requestResult';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient,
    private readonly resolveReqSvc: ResolveRequestResultService) { }

  getMenuOpts() {
    return this.http.get<Menu[]>('/assets/data/menu-opts.json');
  }

  getLogin(login: Login): Observable<RequestResult<Session>> {
    return this.http
      .post<RequestResult<Session>>(`${apiUrl}/Authentication/login`, login)
      .pipe(
        retry(0),
        catchError(this.resolveReqSvc.handleError)
        // map((vars: RequestResult<Session>) =>
        //   this.resolveReqSvc.resolve<Session>(vars)
        // )
      );
  }

  getUsuarios() {
    return this.http.get('https://jsonplaceholder.typicode.com/users').pipe(
      delay(2000)
    );
  }

  handleError(error: Error) {
    return throwError(() => new Error(error.message));
  }

}
