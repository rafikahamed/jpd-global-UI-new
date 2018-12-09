import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AdminService } from 'app/hms/service/admin.service';
import { ParcelService } from 'app/hms/service/parcel.service';
import { GridOptions } from "ag-grid";
import { NgxSpinnerService } from 'ngx-spinner';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import * as XLSX from 'xlsx';
declare var $: any;

@Component({
  selector: 'arn-admin-upload',
  templateUrl: './arn-admin-upload.component.html',
  styleUrls: ['./arn-admin-upload.component.css']
})
export class ARNAdminUploadComponent implements OnInit{
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
    childmenuOne: boolean;
    userDetails: userMessage;
    userName: String;
    access: String;
    companyName : String;
    userCode: string;
    time: String;
    importData: any[];
    fileType: String;
    level: String;
    downLoadFlag: boolean;
    currentDate: String;
    currencyUpdatedTime: String;
    public importList = [];
    FileHeading = ['Business type', 'Legal name', 'Authorised contacts', 'Email address', 'Phone number', 'Postal address', 'Suburb', 
                   'Postcode',  'Country', 'Business and trading website name', 'Tax identification number in your home country',
                   'Date Of Birth', 'Registration Date'];
    constructor(
      public adminservice: AdminService,
      public parcelservice: AdminService,
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
      this.downLoadFlag = false;
      this.successMsg = null;
      this.errorMsg = null;
      this.show = false;
      this.gridOptions = <GridOptions>{rowSelection: "multiple"};
      this.gridOptions.columnDefs = [
        {
          headerName: "Authorised contacts",
          field: "authrorizedConatct",
          width: 180,
          checkboxSelection: true,
          headerCheckboxSelection: function(params) {
            return params.columnApi.getRowGroupColumns().length === 0;
          }
        },
        {
          headerName: "Business type",
          field: "businessType",
          width: 180
        },
        {
          headerName: "Country",
          field: "country",
          width: 150
        },
        {
          headerName: "Email address",
          field: "emailAddress",
          width: 200
        },
        {
          headerName: "Legal name",
          field: "legalName",
          width: 150
        },
        {
          headerName: "Phone number",
          field: "phoneNumber",
          width: 150
        },
        {
          headerName: "Postcode",
          field: "postCode",
          width: 150
        },
        {
          headerName: "Postal address",
          field: "postalAddress",
          width: 150
        },
        {
          headerName: "Suburb",
          field: "subUrb",
          width: 150
        },
        {
          headerName: "Tax identification number in your home country",
          field: "tanNumber",
          width: 150
        },
        {
          headerName: "Business and trading website name",
          field: "websiteName",
          width: 150
        },
        {
          headerName: "Date Of Birth",
          field: "dateOfBirth",
          width: 150
        },
        {
          headerName: "Registration Date",
          field: "registrationDate",
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
    };

    importFileUpload() {
      var worksheet;
      var adminList = [];
      var currentTime = new Date();
      this.errorMsg = null;
      this.successMsg = null;
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
            var importData = XLSX.utils.sheet_to_json(worksheet);
            for (var importVal in importData) {
                  var importObj = importData[importVal];
                  for(var importKey in importObj){  
                    var newLine = "\r\n"
                    if(!this.FileHeading.includes(importKey)){
                      this.errorMsg = "***Invalid file format, Please check the field in given files"+ 
                      newLine + "Allowed fields are [ 'Business type', 'Legal name', 'Authorised contacts', 'Email address', 'Phone number', 'Postal address', 'Suburb', 'Postcode',  'Country', 'Business and trading website name', 'Tax identification number in your home country', 'Date Of Birth', 'Registration Date']";
                      break;
                    }
                  };

                  let authrorizedConatct = 'authrorizedConatct';
                  let businessType = 'businessType';
                  let country = 'country';
                  let emailAddress = 'emailAddress';
                  let legalName = 'legalName';
                  let phoneNumber = 'phoneNumber';
                  let postCode = 'postCode';
                  let postalAddress = 'postalAddress';
                  let subUrb = 'subUrb';
                  let tanNumber = 'tanNumber';
                  let websiteName = 'websiteName';
                  let dateOfBirth = 'dateOfBirth';
                  let registrationDate = 'registrationDate';

                var arnObj = (
                    arnObj={},
                    arnObj[authrorizedConatct]= importObj['Authorised contacts'] != null ? importObj['Authorised contacts']: '', arnObj,
                    arnObj[businessType]= importObj['Business type'] != null ? importObj['Business type']: '', arnObj,
                    arnObj[country]= importObj['Country'] != null ? importObj['Country']: '', arnObj,
                    arnObj[emailAddress]= importObj['Email address'] != null ? importObj['Email address'] : '', arnObj,
                    arnObj[legalName]= importObj['Legal name'] != null ? importObj['Legal name'] : '', arnObj,
                    arnObj[phoneNumber]= importObj['Phone number'] != null ? importObj['Phone number']:'', arnObj,
                    arnObj[postCode]= importObj['Postcode'] != null ? importObj['Postcode']: '', arnObj,
                    arnObj[postalAddress]= importObj['Postal address'] != null ? importObj['Postal address']:'', arnObj,
                    arnObj[subUrb]= importObj['Suburb'] != null ? importObj['Suburb'] : '', arnObj,
                    arnObj[tanNumber]= importObj['Tax identification number in your home country'] != null ? importObj['Tax identification number in your home country']: '', arnObj,
                    arnObj[websiteName]= importObj['Business and trading website name'] != null ? importObj['Business and trading website name']: '', arnObj,
                    arnObj[dateOfBirth]= importObj['Date Of Birth'] != null ? importObj['Date Of Birth']:'', arnObj,
                    arnObj[registrationDate]= importObj['Registration Date'] != null ? importObj['Registration Date']: '',  arnObj
                );
                adminList.push(arnObj);
            }
            if( this.errorMsg == null ){
                this.importData = XLSX.utils.sheet_to_json(worksheet);
                this.rowData = adminList;
            };
       }
    };

    DownLoadGstReport(){
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
      this.errorMsg = '';
      this.successMsg = '';
      var selectedRows = this.gridOptions.api.getSelectedRows();
      var dateString = day + "/" + month + "/" + year + " " + hour + ":" + minutes + ":" + seconds;
      if(selectedRows.length > 0){
        this.spinner.show();
        this.adminservice.arnRegistration(selectedRows, this.file.name+"-"+dateString,(resp) => {
          if( resp[0].message == "Unable to save the ARN Data"){
            this.show = true;
            this.errorMsg = resp[0].message;
          }else{
            this.successMsg = resp[0].message;
            $('#fileUploadModal').modal('show');
          }
         this.spinner.hide();
        });
      }else{
         this.errorMsg = "**Please select the below records to Upload the ARN Data";
      }
    };

    ngOnInit() {
      this.childmenuOne = false;
      this.getLoginDetails();
    }

    getLoginDetails(){
      console.log(this.parcelservice.userMessage )
      if(this.parcelservice.userMessage != undefined){
        this.userDetails = this.parcelservice.userMessage;
        this.userName = this.parcelservice.userMessage.userName;
        this.access = this.parcelservice.userMessage.access;
        this.companyName = this.parcelservice.userMessage.companyName;
        this.userCode = this.parcelservice.userMessage.userCode;
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
    }
  
    incomingfile(event) {
      this.rowData = [];
      this.file = event.target.files[0]; 
      this.importFileUpload();
    };

    onSelectionChange() {
      this.errorMsg = '';
      this.successMsg = '';
      var selectedRows = this.gridOptions.api.getSelectedRows();
    };

    clearAdminUpload(){
      $("#adminUploadFile").val('');
      this.rowData = [];
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
  Country: String;
  aud_converted_value: number;
}

export interface userMessage {
  message,
  userName,
  access,
  companyName,
  userCode
}