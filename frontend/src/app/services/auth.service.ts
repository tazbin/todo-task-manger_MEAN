import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WebRequestService } from './web-request.service';
import { pluck, share, shareReplay, tap } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private webService: WebRequestService,
    private router: Router
  ) { }


  login(email: string, password: string) {
    return this.webService.login(email, password)
    .pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        this.setSession(
          res.body._id,
          res.headers.get('x-access-token'),
          res.headers.get('x-refresh-token')
        );
      })
    )
  }
  
  logout(){
    this.removeSession()
  }

  getAccessToken(){
    return localStorage.get('x-access-token')
  }

  getRefreshToken(){
    return localStorage.getItem('x-refresh-token')
  }

  setAccessToken(token: string){
    localStorage.setItem('x-access-token', token)
  }

  setRefreshToken(token: string){
    localStorage.setItem('x-refresh-token', token)
  }

  private setSession(userId: string, accessToken: string, refreshToken: string){
    localStorage.setItem('user-id', userId);
    localStorage.setItem('access-token', accessToken);
    localStorage.setItem('refresh-token', refreshToken);
  }

  private removeSession(){
    localStorage.removeItem('user-id');
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
  }



}
