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
export class ManageWorkOrderService {

  constructor(private http: HttpClient,
    private readonly resolveReqSvc: ResolveRequestResultService) { }


  GetActivity(idFolder: string): Observable<RequestResult<any>> {
    const params = new HttpParams().set('carpeta', idFolder);
    return this.http
      .get<RequestResult<any>>(`${apiUrl}/WorkOrderFollowUp/GetActivity`, { params })
      .pipe(
        retry(0),
        catchError(this.resolveReqSvc.handleError),
        // map((vars: RequestResult<any>) =>
        //   this.resolveReqSvc.resolve<any>(vars)
        // )
      );
  }

  GetPhotoType(): Observable<RequestResult<any>> {
    return this.http
      .get<RequestResult<any>>(`${apiUrl}/WorkOrderFollowUp/GetPhotoType`)
      .pipe(
        retry(0),
        catchError(this.resolveReqSvc.handleError),
        // map((vars: RequestResult<any>) =>
        //   this.resolveReqSvc.resolve<any>(vars)
        // )
      );
  }

  GetAllUsersByRolCode(code: string): Observable<RequestResult<any>> {
    const params = new HttpParams().set('code', code);

    return this.http
      .get<RequestResult<any>>(`${apiUrl}/User/GetAllUsersByRolCode`, { params })
      .pipe(
        retry(0),
        catchError(this.resolveReqSvc.handleError),
        // map((vars: RequestResult<any>) =>
        //   this.resolveReqSvc.resolve<any>(vars)
        // )
      );
  }

  UpdateManageWorkOrder(updateManageWorkOrder: any): Observable<RequestResult<any>> {
    return this.http
      .post<RequestResult<any>>(`${apiUrl}/WorkOrderManagement/UpdateManageWorkOrder`, updateManageWorkOrder)
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
