import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map, Observable, retry, throwError, catchError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ResolveRequestResultService } from '../../../utils/resolve-requestResult';
import { RequestResult } from '../../../interfaces/interfaces';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  constructor(private http: HttpClient,
    private readonly resolveReqSvc: ResolveRequestResultService) { }


    GetEquipmentByActivity(activityID: string): Observable<RequestResult<any>> {
    const params = new HttpParams().set('activity', activityID);
    return this.http
      .get<RequestResult<any>>(`${apiUrl}/Files/GetEquipmentByActivity`, { params })
      .pipe(
        retry(0),
        catchError(this.resolveReqSvc.handleError),
        // map((vars: RequestResult<any>) =>
        //   this.resolveReqSvc.resolve<any>(vars)
        // )
      );
  }

  GetAllMovimientoEquipment(): Observable<RequestResult<any>> {
    return this.http
      .get<RequestResult<any>>(`${apiUrl}/WorkOrderFollowUp/GetAllMovimientoEquipment`)
      .pipe(
        retry(0),
        catchError(this.resolveReqSvc.handleError),
        // map((vars: RequestResult<any>) =>
        //   this.resolveReqSvc.resolve<any>(vars)
        // )
      );
  }

  handleError(error: Error) {
    return throwError(() => new Error(error.message));
  }

}
