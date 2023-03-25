import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map, Observable, retry, throwError, catchError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ResolveRequestResultService } from '../../../utils/resolve-requestResult';
import { RequestResult } from '../../../interfaces/interfaces';
import { SaveOrderWorkIN } from '../interfaces/interfacesWorkOrder';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {

  constructor(private http: HttpClient,
    private readonly resolveReqSvc: ResolveRequestResultService) { }


  SaveOrderWork(saveOrderWorkIN: SaveOrderWorkIN): Observable<RequestResult<any>> {
    return this.http
      .post<RequestResult<any>>(`${apiUrl}/WorkOrderManagement/SaveWorkOrder`, saveOrderWorkIN)
      .pipe(
        retry(0),
        catchError(this.resolveReqSvc.handleError)
        // map((vars: RequestResult<Session>) =>
        //   this.resolveReqSvc.resolve<Session>(vars)
        // )
      );
  }

  handleError(error: Error) {
    return throwError(() => new Error(error.message));
  }

}
