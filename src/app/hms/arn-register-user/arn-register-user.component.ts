import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';
import { UserService } from 'app/hms/service/user.service';
declare var $: any;

@Component({
  selector: 'hms-home',
  templateUrl: './arn-register-user.component.html',
  styleUrls: ['./arn-register-user.component.css']
})

export class ArnRegistrationUserComponent implements OnInit{
      file:File;
      errorMsg: string;
      userSignUpSuccessMsg: String;
      userSignUpFormOne: FormGroup;
      userSignUpFormTwo: FormGroup;
      userGroupedForm:  FormGroup;
      arrayBuffer:any;
      hasError: Boolean;
      dob: String;
      regDate: String;
      level: string;
      fileData: ArnRegister[];
      termCheck: Boolean;
      constructor(
        private spinner: NgxSpinnerService,
        public userservice: UserService
      ){
        this.errorMsg = null;
        this.hasError = false;
        this.termCheck = false;
        this.userSignUpFormOne = new FormGroup({
            businessType: new FormControl('', Validators.required),
            legalName: new FormControl('', Validators.required),
            authrorizedConatct: new FormControl('', Validators.required),
            emailAddress: new FormControl('', Validators.required),
            phoneNumber: new FormControl('', Validators.required),
            postalAddress: new FormControl('', Validators.required),
            subUrb: new FormControl('', Validators.required)
           
        });
        this.userSignUpFormTwo = new FormGroup({
            postCode: new FormControl('', Validators.required),
            country: new FormControl('', Validators.required),
            websiteName: new FormControl('', Validators.required),
            tanNumber: new FormControl('', Validators.required),
            dateOfBirth: new FormControl(),
            registrationDate: new FormControl()
        })
    };

    ngOnInit(){};

    termsAndCondition(termsCheck){
        this.termCheck = termsCheck.checked;
    };

    dobChange(event){
        var str = event.target.value;
        var date = new Date(str),
              mnth = ("0" + (date.getMonth()+1)).slice(-2),
              day  = ("0" + date.getDate()).slice(-2);
         this.dob = [ date.getFullYear(), mnth, day ].join("-");
         this.userSignUpFormTwo.controls['dateOfBirth'].setValue(this.dob);
    };

    regDateChange(event){
        var str = event.target.value;
        var date = new Date(str),
              mnth = ("0" + (date.getMonth()+1)).slice(-2),
              day  = ("0" + date.getDate()).slice(-2);
         this.regDate = [ date.getFullYear(), mnth, day ].join("-");
         this.userSignUpFormTwo.controls['registrationDate'].setValue(this.regDate);
    };

    userSignUp(){
        this.userSignUpSuccessMsg = null;
        this.errorMsg = null;
        let finalUserObject = Object.assign(this.userSignUpFormOne.value, this.userSignUpFormTwo.value)
        if(finalUserObject.businessType.length == 0){
            this.errorMsg = "*Business Type cannot be blank";
        }else if(finalUserObject.legalName.length == 0){
            this.errorMsg = "*Legal name cannot be blank";
        }else if(finalUserObject.authrorizedConatct.length == 0){
            this.errorMsg = "*Authrorized Conatct cannot be blank";
        }else if(finalUserObject.emailAddress.length == 0){
            this.errorMsg = "*Email Address cannot be blank";
        }else if(finalUserObject.phoneNumber.length == 0){
            this.errorMsg = "*Phone Number cannot be blank"
        }else if(finalUserObject.postalAddress.length == 0){
            this.errorMsg = "*Postal Address cannot be blank"
        }else if(finalUserObject.subUrb.length == 0){
            this.errorMsg = "*SubUrb cannot be blank"
        }else if(finalUserObject.postCode.length == 0){
            this.errorMsg = "*PostCode cannot be blank"
        }else if(finalUserObject.country.length == 0){
            this.errorMsg = "*Country cannot be blank"
        }else if(finalUserObject.websiteName.length == 0){
            this.errorMsg = "*Website Name cannot be blank"
        }else if(finalUserObject.tanNumber.length == 0){
            this.errorMsg = "*Tax identification number cannot be blank"
        }else if(!this.termCheck){
            this.errorMsg = "*Please select the terms & condition to signup the ITCS service"
        }
        if( this.errorMsg == null ){
            this.spinner.show();
            this.userservice.arnRegistration(finalUserObject, '' ,(resp) => {
                this.spinner.hide();
                if( resp[0].message == "Unable to save the ARN Data"){
                    this.errorMsg = resp[0].message;
                }else{
                    this.userSignUpSuccessMsg = "Thank you for signing up to ITCS. We will complete your ARN Registration and set up an account for access to the system. Once the process is complete you will receive an email from support@jpdglobal.com.au with your login credentials."
                    $('#arnSignupModal').modal('show');
                }
                if(!resp){
                    this.errorMsg = "Network Error!";
                }
            });
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

