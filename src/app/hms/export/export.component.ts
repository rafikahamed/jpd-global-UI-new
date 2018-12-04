import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/filter';
import { ParcelService } from 'app/hms/service/parcel.service';
import { LoginService } from 'app/hms/service/login.service';
import { GridOptions } from "ag-grid";
import { NgxSpinnerService } from 'ngx-spinner';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import * as XLSX from 'xlsx';
declare var $: any;

@Component({
  selector: 'hms-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit{
    private gridOptions: GridOptions;
    private autoGroupColumnDef;
    private rowGroupPanelShow;
    private rowData: any[];
    private defaultColDef;
    successMsg: String;
    show: Boolean;
    errorMsg: String;
    errorDetails: any[];
    errorDetails1: String;
    file:File;
    arrayBuffer:any;
    fileData: File_Data[];
    exportData: any[];
    fileDataExport: File_Data[];
    childmenuOne: boolean;
    childmenuTwo:boolean;
    childmenuThree:boolean;
    childmenuFour:boolean;
    childmenuFive:boolean;
    exportSuccessMsg: String;
    downloadErrorMsg: String;
    exportErrorMsg: String;
    userDetails: userDetails;
    userName: String;
    access: String;
    companyName : String;
    userCode: string;
    importSumValue: String;
    exportSumValue: String;
    time: String;
    importData: any[];
    fileType: String;
    level: String;
    downLoadFlag: boolean;
    currentDate: String;
    currencyUpdatedTime: String;
    public importList = [];
    timePeriod = ['Q1 – Jul 1st to Sep 30th', 'Q2 – Oct 1st to Dec 31st', 'Q3 – Jan 1st to Mar 31st', 'Q4 – Apr 1st to Jun 30th'];
    FileHeading = ['Value', 'Sale Date', 'Currency', 'GST Eligible', 'Reference Number', 'User Code'];
    allowedCurrency = ['USD', 'CNY', 'JPY', 'EUR', 'KRW', 'SGD', 'NZD', 'GBP', 'MYR', 'THB', 'IDR', 'INR', 'TWD', 'VND', 'HKD', 'PGK', 'CHF', 'AED', 'CAD', 'AUD'];
    constructor(
      public parcelservice: ParcelService, 
      private router: Router,
      private spinner: NgxSpinnerService
    ){
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
      this.successMsg = null;
      this.errorMsg = null;
      this.show = false;
      this.gridOptions = <GridOptions>{rowSelection: "multiple"};
      this.gridOptions.columnDefs = [
        {
          headerName: "User Code",
          field: "user_code",
          width: 180,
          checkboxSelection: true,
          headerCheckboxSelection: function(params) {
            return params.columnApi.getRowGroupColumns().length === 0;
          }
        },
        {
          headerName: "GST Eligible ",
          field: "GST_eligible",
          width: 180
        },
        {
          headerName: "Reference No",
          field: "reference_no",
          width: 150
        },
        {
          headerName: "currency Code",
          field: "currency_code",
          width: 200
        },
        {
          headerName: "Amount",
          field: "amount",
          width: 150
        },
        {
          headerName: "Aud Converted Value",
          field: "aud_converted_value",
          width: 150
        },
        {
          headerName: "CompanyName",
          field: "companyName",
          width: 150
        },
        {
          headerName: "GST Payable",
          field: "gst_payable",
          width: 150
        }
      ];
      this.autoGroupColumnDef = {
        headerCheckboxSelection: true,
        cellRenderer: "agGroupCellRenderer",
        cellRendererParams: { checkbox: true }
      };      
      this.rowGroupPanelShow = "always";
      this.defaultColDef = {
        editable: true
      };
    }
    
    formatDate(date) {
      var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();
  
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
  
      return [day, month, year].join('-');
    };

    exportFileUpload() {
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
                    var rxDatePattern = /^(\d{1,2})(\/|-)([a-zA-Z]{3})(\/|-)(\d{4})$/;                   
                    if(!importObj[importKey].match(rxDatePattern)){
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
            };
            if( this.errorMsg == null ){
              this.exportData = XLSX.utils.sheet_to_json(worksheet);
            };
        }
    };

    ExportUpload(){
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
        this.parcelservice.exportService(this.exportData, this.file.name+"-"+dateString, (resp) => {
          if( resp[0].errMessage != null){
            this.exportErrorMsg = resp[0].errMessage;
            $('#fileUploadModal').modal('show');
          }else{
            this.rowData = resp;
            this.exportSuccessMsg = "File Data uploaded and GST calculated successfully";
            $('#fileUploadModal').modal('show');
            this.parcelservice.importGstSum('E' ,(resp) => {
              this.exportSumValue = resp.exportGst;
              this.currencyUpdatedTime = resp.lastCurrencyUpdatedTime;
            });
          }
          this.spinner.hide();
        });
      }
    };

    DownLoadGstExportReport(){
      var selectedRows = this.gridOptions.api.getSelectedRows();
      this.errorMsg = '';
      this.successMsg = '';
      this.errorDetails1 = '';
      if(selectedRows.length > 0){
        var currentTime = new Date();
        var importList = [];
        var fileName = '';
            fileName = "Export-Gst-Details"+"-"+currentTime.toLocaleDateString();
          var options = { 
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true, 
            useBom: true,
            headers: ["User Code", "GST Eligible", "Reference Number", "rrival Date", "Currency", "Amount", "Indicator",
                      "AUD Converted Amount", "Company Name", "GST Payable" ]
          };
          let user_code = 'user_code';
          let gst_eligible = 'gst_eligible';
          let reference_no = 'reference_no';
          let arrival_date = 'arrival_date';
          let currency_code = 'currency_code';
          let amount = 'amount';
          let report_indicator = 'report_indicator';
          let aud_converted_value = 'aud_converted_value';
          let companyName = 'companyName';
          let gst_payable = 'gst_payable';
      
          for (var importVal in selectedRows) {
              var adminObj = selectedRows[importVal];
              var importObj = (
                  importObj={}, 
                  importObj[user_code]= adminObj.user_code != null ? adminObj.user_code: '', importObj,
                  importObj[gst_eligible]= adminObj.gst_eligible != null ? adminObj.gst_eligible : '', importObj,
                  importObj[reference_no]= adminObj.reference_no != null ? adminObj.reference_no : '', importObj,
                  importObj[arrival_date]= adminObj.arrival_date != null ? adminObj.arrival_date : '', importObj,
                  importObj[currency_code] = adminObj.currency_code != null ? adminObj.currency_code : '', importObj,
                  importObj[amount]= adminObj.amount != null ? adminObj.amount : '', importObj,
                  importObj[report_indicator]= adminObj.report_indicator != null ? adminObj.report_indicator : '', importObj,
                  importObj[aud_converted_value]= adminObj.aud_converted_value != null ? adminObj.aud_converted_value : '', importObj,
                  importObj[companyName]= adminObj.companyName != null ? adminObj.companyName : '', importObj,
                  importObj[gst_payable]= adminObj.gst_payable != null ? adminObj.gst_payable : '',  importObj
              );
              importList.push(importObj)
          };
          new Angular2Csv(importList, fileName, options);
      }else{
         this.exportErrorMsg = "**Please select the below records to Download the GST calculated data";
      }
    };

    ngOnInit() {
      this.childmenuOne = false;
      this.childmenuTwo = false;
      this.childmenuThree = false;
      this.childmenuFour  = false;
      this.childmenuFive = false;
      this.userDetails = null;
      this.getLoginDetails();
      this.parcelservice.importGstSum('E' ,(resp) => {
        this.exportSumValue = resp.exportGst;
        this.currencyUpdatedTime = resp.lastCurrencyUpdatedTime;
      });

      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
      });
    };

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
    };
  
    toggle(arrow) {
      this.childmenuOne = !this.childmenuOne;
      if (arrow.className === 'fa fa-chevron-down') {
        arrow.className = '';
        arrow.className = 'fa fa-chevron-up';
      }
      else {
        arrow.className = '';
        arrow.className = 'fa fa-chevron-down';
      }
    };

    incomingfile(event) {
      this.rowData = [];
      this.file = event.target.files[0]; 
      this.exportFileUpload();
    };

    onSelectionChange() {
      this.errorMsg = '';
      this.successMsg = '';
      var selectedRows = this.gridOptions.api.getSelectedRows();
    };

    clearExport(){
      $("#fileControlExport").val('');
    };
 
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