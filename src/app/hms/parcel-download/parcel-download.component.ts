import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { ParcelService } from 'app/hms/service/parcel.service';
import { LoginService } from 'app/hms/service/login.service';
import { GridOptions } from "ag-grid";
import { NgxSpinnerService } from 'ngx-spinner';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import * as XLSX from 'xlsx';
declare var $: any;

interface dropdownTemplate {
  name: string;
  value: string;
}

@Component({
  selector: 'hms-parcel-download',
  templateUrl: './parcel-download.component.html',
  styleUrls: ['./parcel-download.component.css']
})
export class ParcelDownloadComponent implements OnInit{

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
    timePeriodDropdown: dropdownTemplate[];  
    selectedTimePeriod:  dropdownTemplate;
    file:File;
    arrayBuffer:any;
    downloadData: File_Data[];
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
    timePeriod : String;
   constructor(
      public parcelservice: ParcelService, 
      private router: Router,
      private spinner: NgxSpinnerService
    ){
        this.errorMsg = null;
        this.successMsg = null;
        this.timePeriodDropdown = [];
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
          field: "userCode",
          width: 180,
          checkboxSelection: true,
          headerCheckboxSelection: function(params) {
            return params.columnApi.getRowGroupColumns().length === 0;
          }
        },
        {
          headerName: "GST Eligible ",
          field: "gstEligible",
          width: 180
        },
        {
          headerName: "Reference No",
          field: "referenceNo",
          width: 150
        },
        {
          headerName: "currency Code",
          field: "currencyCode",
          width: 200
        },
        {
          headerName: "Amount",
          field: "amount",
          width: 150
        },
        {
          headerName: "Aud Converted Value",
          field: "audConvertedAmount",
          width: 150
        },
        {
          headerName: "CompanyName",
          field: "companyName",
          width: 150
        },
        {
          headerName: "GST Payable",
          field: "gstPayable",
          width: 150
        },
        {
          headerName: "File Name",
          field: "fileName",
          width: 200
        },
        {
          headerName: "Report Indicator",
          field: "reportIndicator",
          width: 100

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

    onTimePeriodDropdownchange(event){
      console.log(event.value.value)
      this.timePeriod = event.value.value;
    }

    ngOnInit() {
      this.childmenuOne = false;
      this.childmenuTwo = false;
      this.childmenuThree = false;
      this.childmenuFour  = false;
      this.childmenuFive = false;
      this.userDetails = null;
      this.getLoginDetails();
      this.timePeriodDropdown = [
        {
          "name": "Q1 – Jul 1st to Sep 30th",
          "value": "3"
        },
        {
          "name": "Q2 – Oct 1st to Dec 31st",
          "value": "4"
        },
        {
          "name": "Q3 – Jan 1st to Mar 31st",
          "value": "1"
        },
        {
          "name": "Q4 – Apr 1st to Jun 30th",
          "value": "2"
        }
      ];
      this.timePeriod = this.timePeriodDropdown[0].value;
      this.parcelservice.importGstSum('I' ,(resp) => {
        this.importSumValue = resp.importGst;
        this.currencyUpdatedTime = resp.lastCurrencyUpdatedTime;
      });
      this.parcelservice.importGstSum('E' ,(resp) => {
        this.exportSumValue = resp.exportGst;
        this.currencyUpdatedTime = resp.lastCurrencyUpdatedTime;
      });
    };

    onradioChange(val){
      if(val.value == 1){
        this.fileType ='I';
      }else if(val.value == 2){
        this.fileType = 'E';
      }else if(val.value == 3){
        this.fileType = 'A';
      }
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
  
    sidebartoggle(arrow) {
      this.childmenuOne = !this.childmenuOne;
      if (arrow.className === 'nav-md') {
        arrow.className = '';
        arrow.className = 'nav-sm';
      }
      else {
        arrow.className = '';
        arrow.className = 'nav-md';
      }
    };

    downLoad(){
      this.spinner.show();
      this.parcelservice.downLoad(this.timePeriod, this.fileType, (resp) => {
        this.spinner.hide();
        this.downloadData = resp;
        this.rowData = this.downloadData;
      })
    };

    downloadGstData(){
      var currentTime = new Date();
      var fileName = '';
      this.downloadErrorMsg ='';
      var downloadList = [];
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
                    'Uploaded-Date','User-code', 'Company Name', 'User-Name' ]
        };
        this.spinner.hide();
        for (var downloadVal in this.downloadData) {
          var downloadObj = this.downloadData[downloadVal];
          delete downloadObj['id'];
          delete downloadObj['txnDate'];
          downloadList.push(downloadObj)
        }
        new Angular2Csv(downloadList, fileName, options);
      }else{
        this.spinner.hide();
        this.downloadErrorMsg="*No recored found for given Quater"
      }
    };

    onSelectionChange() {
      this.errorMsg = '';
      this.successMsg = '';
      var selectedRows = this.gridOptions.api.getSelectedRows();
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