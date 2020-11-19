import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  onLoginButtonClick(email: string, password: string){
    this.authService.login(email, password)
    .subscribe((res: HttpResponse<any>) => {
      console.log('Logged in');
        console.log(res);
    })
  }

}
