import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';

import { HttpClient , HttpHeaders} from '@angular/common/http';
import { HttpErrorResponse , HttpParams } from '@angular/common/http';
 




@Injectable({
  providedIn: 'root'
})
export class AppService {

  private url = 'http://localhost:3000/';

  constructor( public htttp: HttpClient) { }

  public signupFunction(data): Observable<any> {

    const params = new HttpParams()
    .set('firstName' , data.firstName)
    .set('lastName' , data.lastName)
    .set('mobile' , data.mobile)
    .set('email' , data.email)
    .set('password' , data.password);
    console.log(params);

    return this.htttp.post(`${this.url}api/v1/users/signup`, params);
  }

  public signinFunction(data): Observable<any> {
    const params = new HttpParams()
    .set('email' , data.email)
    .set('password', data.password);
    return this.htttp.post(`${this.url}api/v1/users/login`,params);
  }

  public   getUserInfoFromLocalstorage  = () => {
      return JSON.parse(localStorage.getItem('userInfo'));
  }

  public setUserInfoInLocalStorage = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data));
  }


  logout (): Observable<any> {

    const params = new HttpParams()
      .set('authToken', Cookie.get('authToken'))
      .set('userId', Cookie.get('recieverId'));
    return this.htttp.post(`${this.url}api/v1/users/logout`, params);

  } // end logout function


}
