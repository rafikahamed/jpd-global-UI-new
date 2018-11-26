import { Injectable, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

const baseUrl = "https://www.jpdglobal.com.au/v1/logistics";
//const baseUrl = "http://localhost:8080/v1/logistics";
@Injectable()
export class LoginService implements OnInit{
  public newUserSubject = new Subject<any>();
  userMessage: userMessage;
  constructor(
      private http: HttpClient, 
      private router: Router
  ){}

  ngOnInit(){}

  getLoginDetails(data){
    this.userMessage = data;
    this.newUserSubject.next(data);
  };
  
  authenticate( loginObject, callback): any {
    this.http.get(baseUrl+'/login', {
      params: { userName: loginObject.userName, passWord: loginObject.passWord  }
    }).subscribe((resp:userMessage) => {
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
