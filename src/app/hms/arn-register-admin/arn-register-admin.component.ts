import { Component, ElementRef, ViewChild, OnInit, Injectable} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';
import { AdminService } from 'app/hms/service/admin.service';
declare var $: any;
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Component({
  selector: 'hms-home',
  templateUrl: './arn-register-admin.component.html',
  styleUrls: ['./arn-register-admin.component.css']
})
export class ArnRegistrationAdminComponent implements OnInit{

      arnFile:File;
      legalName: String;
      errorMsg: string;
      successMsg: string;
      signUpSuccessMsg: String;
      adminSignUpForm: FormGroup;
      arrayBuffer:any;
      hasError: Boolean;
      level: string;
      userMessage: userMessage;
      fileData: ArnRegister[];
      adminAccessLevel = ['level 1', 'level 2'];
      arnRestrict: boolean = true;
      signUpSuccessFlag: boolean = false;
      levelTwoFlag: boolean = true;
      legalNameFlag: boolean = true;
      legalNameSelctFlag: boolean = false;
      companyDetails = [];
      adminDetails=[];

      constructor(
        private spinner: NgxSpinnerService,
        public adminservice: AdminService
      ){
        this.errorMsg = null;
        this.hasError = false;
        this.userMessage = null;
        this.signUpSuccessMsg = null;
        this.adminSignUpForm = new FormGroup({
          LegalName: new FormControl(),
          arnNumber: new FormControl(),
          managerName: new FormControl(),
          authrorizedConatct: new FormControl(),
          emailAddress: new FormControl(),
          phoneNumber: new FormControl(),
          username: new FormControl('', Validators.required),
          password: new FormControl('', Validators.required),
          confirmPassword: new FormControl('', Validators.required)
    });
  }

  ngOnInit(){
    console.log("inside the data");
  }

  companyFun(company){
    this.legalName = null;
    this.legalName = company;
  }

  arnFileData(event){
    this.arnFile= event.target.files[0]; 
  }

  uploadArn(){
    var worksheet;
    this.errorMsg = null;
    this.successMsg = null;
    this.fileData = null;
    let fileReader = new FileReader();
    console.log(this.arnFile)
    fileReader.readAsArrayBuffer(this.arnFile);
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
              console.log(importObj)
                for(var importKey in importObj){
                  var newLine = "\r\n"
                 }
          }
          if( this.errorMsg == null ){
            this.spinner.show();
            this.adminservice.arnRegistration(XLSX.utils.sheet_to_json(worksheet), this.arnFile.name ,(resp) => {
              if( resp[0].message == "Unable to save the ARN Data"){
                this.errorMsg = resp[0].message;
              }else{
                this.fileData = resp;
                this.successMsg = resp[0].message;
              }
             this.spinner.hide();
            });
          }
          setTimeout(() => {
            this.spinner.hide();
          }, 10000);
    }
  }

  adminDownLoad(){
    this.spinner.show();
    var currentTime = new Date();
    var fileName = '';
    this.adminservice.adminDownLoad( (resp) => {
      this.adminDetails = resp;
      this.spinner.hide();
      fileName = "Admin-GST-report"+"-"+currentTime.toLocaleDateString();
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
              arnObj[User_Code]= adminObj.user_code, arnObj,
              arnObj[Company_Name]= adminObj.company_name, arnObj,
              arnObj[Total_gst]= adminObj.gst_payable, arnObj,
              arnObj[Total_sale]= adminObj.total_sales_in_AUD, arnObj,
              arnObj[Total_exclude]= adminObj.total_GST_Exclude_sales_in_AUD, arnObj
          );
          adminList.push(arnObj)
      }
     new Angular2Csv(adminList, fileName, options); 
    });
  } 

  onSelectChange(val){
    if(val.index == 1){
        this.adminservice.companyDetails( (resp) => {
          this.companyDetails = resp;
          if(!resp){
              this.errorMsg = "Invalid Credentials!";
          }  
        });
    }
  }

  accessLevelFun(level){
    this.level = level;
    this.adminSignUpForm.get('managerName').reset();
    if(level == "level 1"){
       this.arnRestrict = false;
       this.levelTwoFlag = true;
       this.legalNameFlag = true;
       this.legalNameSelctFlag = false;
       this.adminSignUpForm.get('managerName').reset();
       this.adminSignUpForm.get('managerName').disable();
    }else{
        this.arnRestrict = true;
        this.levelTwoFlag = false;
        this.legalNameSelctFlag = true;
        this.legalNameFlag = false;
    }
  }

  adminSignUp(){
    this.errorMsg = null;
    this.signUpSuccessMsg = null;
    this.validateForm();
      if(this.level == null){
          this.errorMsg = "*Please select the access level"
          this.hasError = true;
      }else if(this.adminSignUpForm.value.password != this.adminSignUpForm.value.confirmPassword){
          this.errorMsg = "* Password and confirm Password should be same"
          this.hasError = true;
      }else{
          this.hasError = false;
      }
    if(this.adminSignUpForm.status == 'VALID' && !this.hasError){
            let legalName = 'legalName';
            let level = 'access_level';
            let username = 'username';
            let password = 'pass_word';
            let arnNumber = 'arn_number';
            let authrorizedConatct = 'authrorizedConatct';
            let phoneNumber = 'phoneNumber';
            let emailAddress = 'email_addr';
            let mgrUserName= 'mgr_username';

            var SignUpObj = (
              SignUpObj={}, 
              SignUpObj[legalName]= ( this.adminSignUpForm.value.LegalName != null ? 
                      this.adminSignUpForm.value.LegalName : this.legalName) , SignUpObj,
              SignUpObj[level]=this.level, SignUpObj,
              SignUpObj[username]=this.adminSignUpForm.value.username, SignUpObj,
              SignUpObj[password]=this.adminSignUpForm.value.password, SignUpObj,
              SignUpObj[arnNumber]=this.adminSignUpForm.value.arnNumber, SignUpObj,
              SignUpObj[authrorizedConatct]=this.adminSignUpForm.value.authrorizedConatct, SignUpObj,
              SignUpObj[phoneNumber]=this.adminSignUpForm.value.phoneNumber, SignUpObj,
              SignUpObj[emailAddress]=this.adminSignUpForm.value.emailAddress, SignUpObj,
              SignUpObj[mgrUserName]= this.adminSignUpForm.value.managerName, SignUpObj
            );
            
            this.spinner.show();
            this.adminservice.adminSignUp(SignUpObj, (resp) => {
                this.userMessage = resp;
                this.spinner.hide();

                if(this.userMessage.message == "Data Saved Successfully"){
                    this.signUpSuccessFlag = true;
                  }else if(this.userMessage.message == "User Already Exists"){
                    this.errorMsg = "* UserName Already exists, Please provide an Unique Value!";
                  }
                  if(!resp){
                    this.errorMsg = "Invalid Credentials!";
                  }
                  setTimeout(() => {
                    this.spinner.hide();
                  }, 5000);
            })
    }
  }

  textInput(){
    this.validateForm();
  }

  validateForm(){
    $('.input100').each(function(){
        $(this).on('blur', function(){
            if($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })    
    })

    /*==================================================================
    [ Validate after type ]*/
    $('.validate-input .input100').each(function(){
        $(this).on('blur', function(){
            if(validate(this) == false){
                showValidate(this);
            }
            else {
                $(this).parent().addClass('true-validate');
            }
        })    
    })

    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(){
        var check = true;
        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }
        return check;
    });

    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
           $(this).parent().removeClass('true-validate');
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
           if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }else{
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }
  }

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

export interface userMessage {
    message,
    userName,
    access,
    companyName,
    userCode
  }

export interface adminDetails{
  company_name,
  gst_payable,
  amount,
  gst_exclude
}
