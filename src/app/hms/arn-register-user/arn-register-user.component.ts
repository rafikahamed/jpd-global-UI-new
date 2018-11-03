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
      level: string;
      fileData: ArnRegister[];

      constructor(
        private spinner: NgxSpinnerService,
        public userservice: UserService
      ){
        this.errorMsg = null;
        this.hasError = false;

        this.userSignUpFormOne = new FormGroup({
            businessType: new FormControl('', Validators.required),
            legalName: new FormControl('', Validators.required),
            authrorizedConatct: new FormControl('', Validators.required),
            emailAddress: new FormControl('', Validators.required),
            phoneNumber: new FormControl('', Validators.required),
            postalAddress: new FormControl('', Validators.required)
       });

      this.userSignUpFormTwo = new FormGroup({
            subUrb: new FormControl('', Validators.required),
            postCode: new FormControl('', Validators.required),
            country: new FormControl('', Validators.required),
            websiteName: new FormControl('', Validators.required),
            tanNumber: new FormControl('', Validators.required)
      });
  }

  ngOnInit(){
    console.log("inside the data");
  }

  arnFile(event){
    this.file= event.target.files[0]; 
  }

    termsAndCondition(termsCheck){
        console.log(termsCheck.checked)
        console.log("Aggreed terms and condition")
    }

userSignUp(){
    this.userSignUpSuccessMsg = null;
    let finalUserObject = Object.assign(this.userSignUpFormOne.value, this.userSignUpFormTwo.value)
    if( this.errorMsg == null ){
        this.spinner.show();
        this.userservice.arnRegistration(finalUserObject, '' ,(resp) => {
            this.spinner.hide();

              if( resp[0].message == "Unable to save the ARN Data"){
                this.errorMsg = resp[0].message;
              }else{
                this.userSignUpSuccessMsg = resp[0].message;
              }
              if(!resp){
                this.errorMsg = "Network Error!";
              }
        });
      }
      setTimeout(() => {
        this.spinner.hide();
      }, 10000);
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

