import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WebRequestInterceptorService implements HttpInterceptor {

  constructor(
    private autService: AuthService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler){
    // handel the request
    req = this.addAuthHeader(req);

    // call next & handle the response
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);

        return throwError(error)
      })
    )
  }

  addAuthHeader(request: HttpRequest<any>){
    // get the access token
    const token = this.autService.getAccessToken();

    if(token){
      // append access token to the header
      return request.clone({
        setHeaders: {
          'x-access-token': token
        }
      })
    }
    // return the without access token
    return request;
  }
}
