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
  selector: 'arn-admin-download',
  templateUrl: './arn-admin-download.component.html',
  styleUrls: ['./arn-admin-download.component.css']
})
export class ARNAdminDownloadComponent implements OnInit{
    private gridOptions: GridOptions;
    private autoGroupColumnDef;
    private rowGroupPanelShow;
    private rowData: any[];
    private defaultColDef;
    userDetails: userDetails;
    successMsg: String;
    show: Boolean;
    errorMsg: String;
    errorDetails: any[];
    errorDetails1: String;
    childmenuOne: boolean;
    userName: String;
    access: String;
    companyName : String;
    userCode: string;
    time: String;
    adminDetails=[];

    constructor(
      public adminservice: AdminService,
      private spinner: NgxSpinnerService,
      public parcelservice: AdminService
    ){
      this.errorMsg = null;
      this.successMsg = null;
      this.access = null;
      this.userName = null;
      this.companyName = null;
      this.userCode = null;
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
          headerName: "Company Name",
          field: "company_name",
          width: 180
        },
        {
          headerName: "Total Sales (AUD)	",
          field: "total_sales_in_AUD",
          width: 200
        },
        {
          headerName: "Total GST Payable (AUD)",
          field: "gst_payable",
          width: 200
        },
        {
          headerName: "GST Excluded Sales (AUD)",
          field: "total_GST_Exclude_sales_in_AUD",
          width: 250
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

    totalGstReport(){
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
      var dateString = day + "/" + month + "/" + year + " " + hour + ":" + minutes + ":" + seconds;

      this.spinner.show();
      var fileName = '';
      this.adminservice.adminDownLoad( (resp) => {
        this.adminDetails = resp;
        this.rowData = resp;
        this.spinner.hide();
        fileName = "Admin-GST-report"+"-"+dateString;
        var options = { 
          fieldSeparator: ',',
          quoteStrings: '"',
          decimalseparator: '.',
          showLabels: true, 
          useBom: true,
          headers: ['User Code','Company Name', 'Total GST Payable (AUD)', 'Total Sales (AUD)', 'GST Excluded Sales (AUD)' ]
        };
  
        var adminList = [];
        let User_Code = 'User_Code';
        let Company_Name = 'Company_Name';
        let Total_gst = 'Total_gst';
        let Total_sale = 'Total_sale';
        let Total_exclude = 'Total_exclude';
    
        for (var adminVal in this.adminDetails) {
            var adminObj = this.adminDetails[adminVal];
            var arnObj = (
                arnObj={}, 
                arnObj[User_Code]= adminObj.user_code != null ? adminObj.user_code : '', arnObj,
                arnObj[Company_Name]= adminObj.company_name != null ? adminObj.company_name : '', arnObj,
                arnObj[Total_gst]= adminObj.gst_payable != null ? adminObj.gst_payable : '', arnObj,
                arnObj[Total_sale]= adminObj.total_sales_in_AUD != null ? adminObj.total_sales_in_AUD : '', arnObj,
                arnObj[Total_exclude]= adminObj.total_GST_Exclude_sales_in_AUD != null ? adminObj.total_GST_Exclude_sales_in_AUD : '', arnObj
            );
            adminList.push(arnObj)
        }
       new Angular2Csv(adminList, fileName, options); 
      });
    };

    ngOnInit() {
      this.childmenuOne = false;
      this.getLoginDetails();
    }

    getLoginDetails(){
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
 
}

export interface adminDetails{
  company_name,
  gst_payable,
  amount,
  gst_exclude
}

export interface userDetails {
  message,
  userName,
  access,
  companyName,
  userCode
}