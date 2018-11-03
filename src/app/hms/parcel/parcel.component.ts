import { Component, ElementRef, ViewChild, OnInit, Injectable} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ParcelService } from 'app/hms/service/parcel.service';
import { LoginService } from 'app/hms/service/login.service';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'hms-parcel',
  templateUrl: './parcel.component.html',
  styleUrls: ['./parcel.component.css']
})

export class ParcelComponent implements OnInit{
  
  errorMsg: string;
  successMsg: String;
  exportSuccessMsg: String;
  downloadErrorMsg: String;
  exportErrorMsg: String;
  arrayBuffer:any;
  file:File;
  userDetails: userDetails;
  userName: String;
  access: String;
  companyName : String;
  userCode: string;
  importSumValue: String;
  exportSumValue: String;
  time: String;
  fileType: String;
  fileData: File_Data[];
  fileDataExport: File_Data[];
  level: String;
  downLoadFlag: boolean;
  currentDate: String;
  downloadData: File_Data[];
  currencyUpdatedTime: String;
  timePeriod = ['Q1 – Jul 1st to Sep 30th', 'Q2 – Oct 1st to Dec 31st', 'Q3 – Jan 1st to Mar 31st', 'Q4 – Apr 1st to Jun 30th'];
  FileHeading = ['Value', 'Sale Date', 'Currency', 'GST Eligible', 'Reference Number', 'User Code'];
  allowedCurrency = ['USD', 'CNY', 'JPY', 'EUR', 'KRW', 'SGD', 'NZD', 'GBP', 'MYR', 'THB', 'IDR', 'INR', 'TWD', 'VND', 'HKD', 'PGK', 'CHF', 'AED', 'CAD', 'AUD'];
  constructor( 
    public parcelservice: ParcelService, 
    private router: Router,
    private spinner: NgxSpinnerService
    ) 
    {
        this.errorMsg = null;
        this.successMsg = null;
        this.level= null;
        this.access = null;
        this.userName = null;
        this.companyName = null;
        this.userCode = null;
        this.userDetails = null;
        this.importSumValue = '0';
        this.exportSumValue = '0';
        this.downLoadFlag = false;
        this.currentDate = this.formatDate(new Date());
    }

  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('-');
  }

  incomingfile(event) {
    this.file= event.target.files[0]; 
  }

  timePeriodFun(time){
    this.time = time;
  }

  ngOnInit(){
    this.userDetails = null;
    this.getLoginDetails();
    this.parcelservice.importGstSum('I' ,(resp) => {
      this.importSumValue = resp.importGst;
      this.currencyUpdatedTime = resp.lastCurrencyUpdatedTime;
    });
    this.parcelservice.importGstSum('E' ,(resp) => {
      this.exportSumValue = resp.exportGst;
      this.currencyUpdatedTime = resp.lastCurrencyUpdatedTime;
    });
  }

  sample(){
    console.log("sample check")
  }

  getLoginDetails(){
    if(this.parcelservice.userMessage != undefined){
      this.userDetails = this.parcelservice.userMessage;
      this.userName = this.parcelservice.userMessage.userName;
      this.access = this.parcelservice.userMessage.access;
      this.companyName = this.parcelservice.userMessage.companyName;
      this.userCode = this.parcelservice.userMessage.userCode;

      if(this.parcelservice.userMessage.access == "level 2"){
        this.downLoadFlag =true;
      }
    }
  }

  onradioChange(val){
    if(val.value == 1){
      this.fileType ='I';
    }else if(val.value == 2){
      this.fileType = 'E';
    }else if(val.value == 3){
      this.fileType = 'A';
    }
  }

  downLoad(){
    this.spinner.show();
    var currentTime = new Date();
    var fileName = '';
    this.downloadErrorMsg ='';
    var downloadList = [];
    var timePeriod = '';
    if(this.time == 'Q1 – Jul 1st to Sep 30th')
        timePeriod = '3';
    else if(this.time == 'Q2 – Oct 1st to Dec 31st')
        timePeriod = '4';
    else if(this.time == 'Q3 – Jan 1st to Mar 31st')
        timePeriod = '1';
    else if(this.time == 'Q4 – Apr 1st to Jun 30th')
        timePeriod = '2';
    this.parcelservice.downLoad(timePeriod, this.fileType, (resp) => {
      this.downloadData = resp;
      if(this.downloadData.length >0){
        fileName = this.downloadData[0].username+"-"+currentTime.toLocaleDateString();
        var options = { 
          fieldSeparator: ',',
          quoteStrings: '"',
          decimalseparator: '.',
          showLabels: true, 
          useBom: true,
          headers: ['Amount', 'Aud Converted Amount', 'Currency Code', 'File Name', 'GST-Eligible', 'GST-Payable', 
                    'Reference Number', 'Report-Indicator', 'Sale Date',
                    'Uploaded-Date','User-code', 'User-Name' ]
        };
        this.spinner.hide();
        for (var downloadVal in resp) {
          var downloadObj = resp[downloadVal];
          delete downloadObj['id'];
          delete downloadObj['txnDate'];
          downloadList.push(downloadObj)
        }
        new Angular2Csv(downloadList, fileName, options);
      }else{
        this.spinner.hide();
        this.downloadErrorMsg="*No recored found for given Quater"
      }
      
    })
  }

  Import() {
    var worksheet;
    var currentTime = new Date();
    this.importSumValue = null;
    this.errorMsg = null;
    this.successMsg = null;
    this.fileData = null;
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
          this.arrayBuffer = fileReader.result;
          var data = new Uint8Array(this.arrayBuffer);
          var arr = new Array();
          for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
          var bstr = arr.join("");
          var workbook = XLSX.read(bstr, {type:"binary"});
          var first_sheet_name = workbook.SheetNames[0];
          var worksheet = workbook.Sheets[first_sheet_name];
          //Validation for file containing fields
          var importData = XLSX.utils.sheet_to_json(worksheet);
          for (var importVal in importData) {
              var importObj = importData[importVal];
                for(var importKey in importObj){
                  var newLine = "\r\n"
                  if(!this.FileHeading.includes(importKey)){
                    this.errorMsg = "***Invalid file format, Please check the field in given files"+ 
                    newLine + "Allowed fields are [ Value, Sale Date, Currency, GST Eligible, Reference Number, User Code]";
                    break;
                  }

                  if(importKey === 'Sale Date'){
                    var rxDatePattern = /^([012]?\d|3[01])-([Jj][Aa][Nn]|[Ff][Ee][bB]|[Mm][Aa][Rr]|[Aa][Pp][Rr]|[Mm][Aa][Yy]|[Jj][Uu][Nn]|[Jj][u]l|[aA][Uu][gG]|[Ss][eE][pP]|[oO][Cc]|[Nn][oO][Vv]|[Dd][Ee][Cc])-(19|20)\d\d$/;
                    if(!importObj[importKey].match(rxDatePattern)){
                      this.errorMsg = "***Invalid Sale Date – Please enter the valid date format - DD-MMM-YYYY"
                      break;
                    }
                  }

                  if(importKey === 'GST Eligible'){
                    if( !(importObj[importKey].toUpperCase() === 'Y' || importObj[importKey].toUpperCase() === 'N')){
                      this.errorMsg = "***Invalid input code – Please enter “Y” or “N” or “Blank”"
                      break;
                    }
                  }else{
                    //console.log("GST Eligible Is blank--->")
                  }

                  if( importKey === 'Currency'){
                    if(!this.allowedCurrency.includes(importObj[importKey].toUpperCase())){
                      this.errorMsg = "***Invalid currency code"+ 
                      newLine + "Allowed Currency's are [ USD, CNY, JPY, EUR, KRW, SGD, NZD, GBP, MYR, THB, IDR, INR, TWD, VND, HKD, PGK, CHF, AED, CAD, AUD]";
                      break;
                    }
                  }

                  if(importKey === 'Value'){
                    if(isNaN(importObj[importKey])){
                      this.errorMsg = "***Invalid Value, Value should be in numeric"
                       break;
                    }
                  }
              }
          }
          var today = new Date();
          var day = today.getDate() + "";
          var month = (today.getMonth() + 1) + "";
          var year = today.getFullYear() + "";
          var hour = today.getHours() + "";
          var minutes = today.getMinutes() + "";
          var seconds = today.getSeconds() + "";

          day = checkZero(day);
          month = checkZero(month);
          year = checkZero(year);
          hour = checkZero(hour);
          minutes = checkZero(minutes);
          seconds = checkZero(seconds);

          function checkZero(data){
            if(data.length == 1){
              data = "0" + data;
            }
            return data;
          }
          var dateString = day + "/" + month + "/" + year + " " + hour + ":" + minutes + ":" + seconds;
          if( this.errorMsg == null ){
            this.spinner.show();
            this.parcelservice.importService(XLSX.utils.sheet_to_json(worksheet), this.file.name+"-"+dateString,(resp) => {
              if( resp[0].errMessage != null){
                this.errorMsg = resp[0].errMessage;
              }else{
                this.fileData = resp;
                this.successMsg = "File uploaded successfully";
                this.parcelservice.importGstSum('I' ,(resp) => {
                  this.importSumValue = resp.importGst;
                  this.currencyUpdatedTime = resp.lastCurrencyUpdatedTime;
                });
              }
              this.spinner.hide();
            });
          };
    }
}

  Export() {
    var worksheet;
    this.exportSumValue = null;
    this.exportErrorMsg = null;
    this.exportSuccessMsg = null;
    this.fileDataExport = null;
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
          this.arrayBuffer = fileReader.result;
          var data = new Uint8Array(this.arrayBuffer);
          var arr = new Array();
          for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
          var bstr = arr.join("");
          var workbook = XLSX.read(bstr, {type:"binary"});
          var first_sheet_name = workbook.SheetNames[0];
          var worksheet = workbook.Sheets[first_sheet_name];
          var exportData = XLSX.utils.sheet_to_json(worksheet);
          
          for (var importVal in exportData) {
            var importObj = exportData[importVal];
              for(var importKey in importObj){
                var newLine = "\r\n"
                if(!this.FileHeading.includes(importKey)){
                  this.exportErrorMsg = "***Invalid file format, Please check the field in given files"+ 
                  newLine + "Allowed fields are [ Value, Sale Date, Currency, GST Eligible, Reference Number, User Code]";
                  break;
                }

                if(importKey === 'Sale Date'){
                  var rxDatePattern = /^([012]?\d|3[01])-([Jj][Aa][Nn]|[Ff][Ee][bB]|[Mm][Aa][Rr]|[Aa][Pp][Rr]|[Mm][Aa][Yy]|[Jj][Uu][Nn]|[Jj][u]l|[aA][Uu][gG]|[Ss][eE][pP]|[oO][Cc]|[Nn][oO][Vv]|[Dd][Ee][Cc])-(19|20)\d\d$/;
                  if(!importObj[importKey].match(rxDatePattern)){
                    console.log("Not Matching the date format")
                    this.exportErrorMsg = "***Invalid Sale Date – Please enter the valid date format DD-MMM-YYYY"
                    break;
                  }
                }

                if(importKey === 'GST Eligible'){
                  if( !(importObj[importKey].toUpperCase() === 'Y' || importObj[importKey].toUpperCase() === 'N')){
                    this.exportErrorMsg = "***Invalid input code – Please enter “Y” or “N” or “Blank”"
                    break;
                  }
                }else{
                  //console.log("GST Eligible Is blank--->")
                }

                if( importKey === 'Currency'){
                  if(!this.allowedCurrency.includes(importObj[importKey].toUpperCase())){
                    this.exportErrorMsg = "***Invalid currency code"+ 
                    newLine + "Allowed Currency's are [ USD, CNY, JPY, EUR, KRW, SGD, NZD, GBP, MYR, THB, IDR, INR, TWD, VND, HKD, PGK, CHF, AED, CAD, AUD]";
                    break;
                  }
                }

                if(importKey === 'Value'){
                  if(isNaN(importObj[importKey])){
                    this.exportErrorMsg = "***Invalid Value, Value should be in numeric"
                     break;
                  }
                }

              }
          }
          var today = new Date();
          var day = today.getDate() + "";
          var month = (today.getMonth() + 1) + "";
          var year = today.getFullYear() + "";
          var hour = today.getHours() + "";
          var minutes = today.getMinutes() + "";
          var seconds = today.getSeconds() + "";

          day = checkZero(day);
          month = checkZero(month);
          year = checkZero(year);
          hour = checkZero(hour);
          minutes = checkZero(minutes);
          seconds = checkZero(seconds);

          function checkZero(data){
            if(data.length == 1){
              data = "0" + data;
            }
            return data;
          }
          var dateString = day + "/" + month + "/" + year + " " + hour + ":" + minutes + ":" + seconds;
          if(this.exportErrorMsg == null){
            this.spinner.show();
            this.parcelservice.exportService(XLSX.utils.sheet_to_json(worksheet), this.file.name+"-"+dateString, (resp) => {
              console.log(resp)
              if( resp[0].errMessage != null){
                this.exportErrorMsg = resp[0].errMessage;
              }else{
                this.fileDataExport = resp;
                this.exportSuccessMsg = "File uploaded successfully";
                this.parcelservice.importGstSum('E' ,(resp) => {
                  this.exportSumValue = resp.exportGst;
                  this.currencyUpdatedTime = resp.lastCurrencyUpdatedTime;
                });
              }
              this.spinner.hide();
            });
          }
      }
  }

}

export interface File_Data {
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
  arrival_date: string;
  errMessage: string;
  successMsg: string;
  aud_converted_value: number;
}

export interface userDetails {
  message,
  userName,
  access,
  companyName,
  userCode
}
