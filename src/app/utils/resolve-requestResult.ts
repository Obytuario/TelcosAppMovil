import { Injectable } from '@angular/core';

import { Observable, map, throwError } from 'rxjs';

//import { SharedService } from '../services/shared.service';
import { RequestResult } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ResolveRequestResultService {
  //constructor(private sharedService: SharedService) {
    constructor() {
    this.handleError = this.handleError.bind(this);
  }

  /**
   * Validacion Objeto RequestResult
   * @param {*} requestResult
   */
  resolve<T>(requestResult: RequestResult<T>) {
    try {
      if (requestResult.isError) {
        //this.sharedService.error(requestResult.errorMessage);
        // console.error('[Service]', requestResult.errorMessage);
        // return throwError(requestResult.errorMessage);
        throw new Error(requestResult.errorMessage);
      }
      if (!requestResult.isSuccessful) {
        //this.sharedService.warning(requestResult.messages[0]);
        /* console.error('[Service]', requestResult.messages); */
        // return throwError(requestResult.messages[0]);
        throw new Error(requestResult.messages[0]);
      }
      return requestResult.result;
    } catch (error: any) {
      // console.error('[Service]', error);
      throw new Error(`[Service] ${error.message}`);
    }
  }

  /**
   * Validacion Objeto RequestResult mas loading
   * @param {*} obs
   */
  resolveWithLoading<T>(obs: Observable<RequestResult<T>>) {
    //this.sharedService.showLoader(true);
    return obs.pipe(
      map(response => {
        //this.sharedService.showLoader(false);
        return this.resolve(response);
      })
    );
  }

  handleError(error: Error) {
    //this.sharedService.showLoader(false);
    //this.sharedService.error(error.message);
    return throwError(() => new Error(error.message));
  }
}
