import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';

const baseUrl = "https://www.jpdglobal.com.au/v1/logistics"
// const baseUrl = "http://localhost:8080/v1/logistics";
@Injectable()
export class AdminService {
  userMessage: userMessage;
  arnRegister: ArnRegister;
  constructor(
    private http: HttpClient, 
    private router: Router
  ){}

  arnRegistration( arnObject, fileName, callback): any {
    this.http.post(baseUrl+'/arnRegistration',arnObject
    ).subscribe((resp:ArnRegister) => {
      callback(resp);
      if (resp) {
        this.arnRegister = resp;
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      console.error(error);
    })
  };

  adminLogin( loginObject, callback): any {
    this.http.get(baseUrl+'/adminLogin', {
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

  adminSignUp( signUpObject, callback): any {
    this.http.post(baseUrl+'/signup',signUpObject
    ).subscribe((resp:ArnRegister) => {
      callback(resp);
      if (resp) {
        this.arnRegister = resp;
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      console.error(error);
    });
  }

  adminDownLoad(callback): any {
    this.http.get(baseUrl+'/adminDownload'
    ).subscribe((resp:ArnRegister) => {
      callback(resp);
    }, (error) => {
      console.error(error);
    });
  }

  companyDetails(callback): any {
    this.http.get(baseUrl+'/companyDetails'
    ).subscribe((resp:ArnRegister) => {
      callback(resp);
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
  
  export interface ArnRegister {
    businessType: string;
    legalName: string;
    authrorizedConatct: string;
    phoneNumber: string;
    postalAddress: string;
    emailAddress: string;
    subUrb: string;
    postCode: string;
    country: string;
    websiteName: string;
    tanNumber: string;
    message: String;
  }

