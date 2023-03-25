import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ResolveRequestResultService } from '../utils/resolve-requestResult';
import { retry, catchError, Observable, map } from 'rxjs';
import { Master, RequestResult } from '../interfaces/interfaces';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class GenericsService {

  constructor(private http: HttpClient,
    private readonly resolveReqSvc: ResolveRequestResultService) { }

  getOperationCenter() : Observable<Master[]> {
    return this.http.get<RequestResult<Master[]>>(`${apiUrl}/CentroOperaciones/GetAllOperationCenter`).pipe(
      retry(0),
      catchError(this.resolveReqSvc.handleError),
      map((vars: RequestResult<Master[]>) =>
          this.resolveReqSvc.resolve<Master[]>(vars)
        )
    );
  }

  getAllSubscriberType() : Observable<Master[]> {
    return this.http.get<RequestResult<Master[]>>(`${apiUrl}/Subscriber/GetAllSubscriberType`).pipe(
      retry(0),
      catchError(this.resolveReqSvc.handleError),
      map((vars: RequestResult<Master[]>) =>
          this.resolveReqSvc.resolve<Master[]>(vars)
        )
    );
  }

  getFolders() : Observable<Master[]> {
    return this.http.get<RequestResult<Master[]>>(`${apiUrl}/Files/GetAllFile`).pipe(
      retry(0),
      catchError(this.resolveReqSvc.handleError),
      map((vars: RequestResult<Master[]>) =>
          this.resolveReqSvc.resolve<Master[]>(vars)
        )
    );
  }

}
