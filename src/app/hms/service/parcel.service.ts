import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';

const baseUrl = "https://www.jpdglobal.com.au/v1/logistics";
// const baseUrl = "http://localhost:8080/v1/logistics";
@Injectable()
export class ParcelService {

  userMessage: userMessage;
  fileData: FileData;
  fileData_export: FileData_Export;
  public newUserSubject = new Subject<any>();

  constructor(
    private http: HttpClient, 
    private router: Router
  ){ 
   
  }

  getLoginDetails(data){
    this.userMessage = data;
    this.newUserSubject.next(data);
  }

  importService( loginObject, fileValue, callback): any {
      var results = loginObject;
      var self = this;
      var importList = [];
      let amount = 'amount';
      let arrival_date = 'arrival_date';
      let currency_code = 'currency_code';
      let reference_no = 'reference_no';
      let user_code = 'user_code';
      let username = 'username';
      let fileName = 'fileName';
      let companyName = 'companyName';
      let accessLevel = 'accessLevel';
      let GST_eligible = 'GST_eligible';
  
      for (var importVal in results) {
          var adminObj = results[importVal];
          var importObj = (
              importObj={}, 
              importObj[amount]= adminObj.Value, importObj,
              importObj[arrival_date]= adminObj['Sale Date'], importObj,
              importObj[currency_code]= adminObj.Currency, importObj,
              importObj[reference_no]= adminObj['Reference Number'], importObj,
              importObj[user_code] = adminObj['User Code'], importObj,
              importObj[username]= self.userMessage.userName, importObj,
              importObj[fileName]= fileValue, importObj,
              importObj[companyName]= self.userMessage.companyName, importObj,
              importObj[accessLevel]= self.userMessage.access, importObj,
              importObj[GST_eligible]= adminObj['GST Eligible'] != undefined ? adminObj['GST Eligible'] : '',  importObj  
          );
          importList.push(importObj)
      }
    this.http.post(baseUrl+'/import',importList
    ).subscribe((resp:FileData) => {
      callback(resp);
      if (resp) {
        this.fileData = resp;
      } else {
        console.error("Not Found!")
      }
    }, (error) => {
      console.error(error);
    });
  };

  downLoad( time, fileType, callback): any {
    this.http.get(baseUrl+'/individualDownload', {
      params: { quater: time,  fileType: fileType, userCode: this.userMessage.userCode}
    }).subscribe((resp:userMessage) => {
      callback(resp);
    }, (error) => {
      console.error(error);
    });
  }

  importGstSum(importObj, callback): any{
    this.http.get(baseUrl+'/outStandingGst', {
      params: { reportIndicator: importObj, userCode: this.userMessage.userCode}
    }).subscribe((resp:userMessage) => {
      callback(resp);
    }, (error) => {
      console.error(error);
    });
  }

  exportService( loginObject, fileValue, callback): any {
    var results = loginObject;
    var self = this;
    var exportList = [];
    let amount = 'amount';
    let arrival_date = 'arrival_date';
    let currency_code = 'currency_code';
    let reference_no = 'reference_no';
    let user_code = 'user_code';
    let username = 'username';
    let fileName = 'fileName';
    let companyName = 'companyName';
    let accessLevel = 'accessLevel';
    let GST_eligible = 'GST_eligible';

    for (var exportVal in results) {
        var adminObj = results[exportVal];
        var exportObj = (
            exportObj={}, 
            exportObj[amount]= adminObj.Value, exportObj,
            exportObj[arrival_date]= adminObj['Sale Date'], exportObj,
            exportObj[currency_code]= adminObj.Currency, exportObj,
            exportObj[reference_no]= adminObj['Reference Number'], exportObj,
            exportObj[user_code] = adminObj['User Code'], exportObj,
            exportObj[username]= self.userMessage.userName, exportObj,
            exportObj[fileName]= fileValue, exportObj,
            exportObj[companyName]= self.userMessage.companyName, exportObj,
            exportObj[accessLevel]= self.userMessage.access, exportObj,
            exportObj[GST_eligible]= adminObj['GST Eligible'] != undefined ? adminObj['GST Eligible'] : '',  exportObj  
        );
        exportList.push(exportObj)
    }
    //console.log(exportList);
    this.http.post(baseUrl+'/export',exportList
    ).subscribe((resp:FileData_Export) => {
      callback(resp);
      if (resp) {
        this.fileData_export = resp;
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

export interface FileData {
  username: string;
  user_code: number;
  amount: number;
  GST_payable: number;
  GST_eligible: string;
  reference_no: string;
  currency_code: string;
  report_indicator: string;
  upload_date: string;
  txn_date: string;
}

export interface FileData_Export {
  username: string;
  user_code: number;
  amount: number;
  GST_payable: number;
  GST_eligible: string;
  reference_no: string;
  currency_code: string;
  report_indicator: string;
  upload_date: string;
  txn_date: string;
}