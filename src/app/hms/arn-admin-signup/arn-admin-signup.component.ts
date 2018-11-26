import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminService } from 'app/hms/service/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';
declare var $: any;

interface dropdownTemplate {
  name: string;
  value: string;
}

@Component({
  selector: 'arn-admin-signup',
  templateUrl: './arn-admin-signup.component.html',
  styleUrls: ['./arn-admin-signup.component.css']
})

export class ARNAdminSignUpComponent implements OnInit{
  arnFile:File;
  legalName: String;
  errorMsg: string;
  successMsg: string;
  signUpSuccessMsg: String;
  adminSignupForm: FormGroup;
  arrayBuffer:any;
  hasError: Boolean;
  level: string;
  userMessage: userMessage;
  brokerAddClientForm: FormGroup;
  fileData: ArnRegister[];
  adminAccessLevel = ['level 1', 'level 2'];
  arnRestrict: boolean = false;
  signUpSuccessFlag: boolean = false;
  levelTwoFlag: boolean = true;
  legalNameFlag: boolean = true;
  legalNameSelctFlag: boolean = false;
  accessDropdown: dropdownTemplate[];  
  companyDropdown: dropdownTemplate[];
  childmenuOne: boolean;

  constructor(
      private spinner: NgxSpinnerService,
      public adminservice: AdminService
  ){
      this.errorMsg = null;
      this.hasError = false;
      this.userMessage = null;
      this.signUpSuccessMsg = null;
      this.accessDropdown = [];
      this.adminSignupForm = new FormGroup({
        legalName: new FormControl(),
        arnNumber: new FormControl(),
        managerName: new FormControl(),
        authrorizedConatct: new FormControl(),
        emailAddress: new FormControl(),
        phoneNumber: new FormControl(),
        userName: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
        confirmPassword: new FormControl('', Validators.required)
      });
    };

    ngOnInit() {
      this.childmenuOne = false;
      this.accessDropdown = [
        { "name": "level 1", "value": "level 1" },
        { "name": "level 2", "value": "level 2" }
      ];
      this.adminSignupForm.get('managerName').reset();
      this.adminSignupForm.get('managerName').disable();
      this.level = this.accessDropdown[0].value;
    };

    // getLoginDetails(){
    //   if(this.parcelservice.userMessage != undefined){
    //     this.userDetails = this.parcelservice.userMessage;
    //     this.userName = this.parcelservice.userMessage.userName;
    //     this.access = this.parcelservice.userMessage.access;
    //     this.companyName = this.parcelservice.userMessage.companyName;
    //     this.userCode = this.parcelservice.userMessage.userCode;
  
    //     if(this.parcelservice.userMessage.access == "level 2"){
    //       this.downLoadFlag =true;
    //     }
    //   }
    // }

    onAccessDropdownchange(event){
      this.level = event.value.value;
      if(this.level == "level 1"){
        this.arnRestrict = false;
        this.levelTwoFlag = true;
        this.legalNameFlag = true;
        this.legalNameSelctFlag = false;
        this.adminSignupForm.get('managerName').reset();
        this.adminSignupForm.get('managerName').disable();
     }else{
         this.arnRestrict = true;
         this.levelTwoFlag = false;
         this.legalNameSelctFlag = true;
         this.legalNameFlag = false;
         this.adminSignupForm.get('managerName').enable();
         this.adminservice.companyDetails( (resp) => {
          this.companyDropdown = resp;
          this.legalName = this.companyDropdown[0].value;
          if(!resp){
              this.errorMsg = "Invalid Credentials!";
          }  
        });
     }
    };

    updateClient(){
      this.errorMsg = null;
      if(this.level == null){
        this.errorMsg = "*Please select the access level"
        this.hasError = true;
      }else if(this.levelTwoFlag &&this.adminSignupForm.value.authrorizedConatct == null){
        this.errorMsg = "*Authrorized Conatct cannot be blank"
        this.hasError = true;
      }else if(this.levelTwoFlag && this.adminSignupForm.value.emailAddress == null){
        this.errorMsg = "*Email Address cannot be blank"
        this.hasError = true;
      }else if(this.levelTwoFlag && this.adminSignupForm.value.phoneNumber == null){
        this.errorMsg = "*Phone Number cannot be blank"
        this.hasError = true;
      }else if(this.adminSignupForm.value.userName.length == 0){
        this.errorMsg = "*user Name cannot be blank"
        this.hasError = true;
      }else if(this.adminSignupForm.value.password.length == 0){
        this.errorMsg = "*Password cannot be blank"
        this.hasError = true;
      }else if(this.adminSignupForm.value.confirmPassword.length == 0){
        this.errorMsg = "*confirmPassword cannot be blank"
        this.hasError = true;
      }else if(this.adminSignupForm.value.password != this.adminSignupForm.value.confirmPassword){
        this.errorMsg = "* Password and confirm Password should be same"
        this.hasError = true;
      }else{
          this.hasError = false;
      }
      console.log(this.adminSignupForm.status)
      if(!this.hasError){
        let legalName = 'legalName';
        let level = 'access_level';
        let username = 'username';
        let password = 'pass_word';
        let arnNumber = 'arn_number';
        let authrorizedConatct = 'authrorizedConatct';
        let phoneNumber = 'phoneNumber';
        let emailAddress = 'email_addr';
        let mgrUserName= 'mgr_username';
        console.log(this.legalName)
        var SignUpObj = (
          SignUpObj={}, 
          SignUpObj[legalName]= ( this.adminSignupForm.value.legalName != null ? 
                  this.adminSignupForm.value.legalName : this.legalName) , SignUpObj,
          SignUpObj[level]=this.level, SignUpObj,
          SignUpObj[username]=this.adminSignupForm.value.userName, SignUpObj,
          SignUpObj[password]=this.adminSignupForm.value.password, SignUpObj,
          SignUpObj[arnNumber]=this.adminSignupForm.value.arnNumber, SignUpObj,
          SignUpObj[authrorizedConatct]=this.adminSignupForm.value.authrorizedConatct, SignUpObj,
          SignUpObj[phoneNumber]=this.adminSignupForm.value.phoneNumber, SignUpObj,
          SignUpObj[emailAddress]=this.adminSignupForm.value.emailAddress, SignUpObj,
          SignUpObj[mgrUserName]= this.adminSignupForm.value.managerName, SignUpObj
        );
        this.spinner.show();
        this.adminservice.adminSignUp(SignUpObj, (resp) => {
            this.userMessage = resp;
            this.spinner.hide();
            if(this.userMessage.message == "Data Saved Successfully"){
                this.signUpSuccessFlag = true;
                $('#fileUploadModal').modal('show');
                this.successMsg = this.userMessage.message ;
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

    };

    onCompanyDropdownchange(company){
      console.log(company.value.value);
      this.legalName = null;
      this.legalName = company;
    }
  
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