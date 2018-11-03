import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';

const baseUrl = "https://www.jpdglobal.com.au/v1/logistics";
// const baseUrl = "http://localhost:8080/v1/logistics";
@Injectable()
export class SignUpService {

  userMessage:userMessage;
  constructor(
    private http: HttpClient, 
    private router: Router
  ) {

  }

  signUp( signUpObject, callback): any {
    this.http.post(baseUrl+'/signup',signUpObject
    ).subscribe((resp:userMessage) => {
      callback(resp);
      if (resp) {
        this.userMessage = resp;
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      console.error(error);
    });
  }
}

export interface userMessage {
  message,
  userName,
  access,
  companyName,
  userCode
}

