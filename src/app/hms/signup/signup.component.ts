import { Component, ElementRef, ViewChild, OnInit, Injectable} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SignUpService } from 'app/hms/service/signUp.service';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { ParcelService } from 'app/hms/service/parcel.service';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'hms-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignUpComponent implements OnInit{
  
  errorMsg: string;
  signUpForm: FormGroup;
  hasError: Boolean;
  level: string;
  levelFlag: boolean;
  userMessage: userMessage;
  accessLevel = ['level 1', 'level 2'];
  
  constructor(
    public signUpService: SignUpService, 
    private router: Router,
    public parcelService: ParcelService,
    private spinner: NgxSpinnerService
  ) 
  {
      this.errorMsg = null;
      this.levelFlag = false;
      this.hasError = false;
      this.signUpForm = new FormGroup({
            username: new FormControl('', Validators.required),
            email: new FormControl('', Validators.required),
            companyName: new FormControl('', Validators.required),
            UserCode: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
            confirmPassword: new FormControl('', Validators.required),
            managerName: new FormControl()
      });
  }

  ngOnInit() {
     
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
 
  accessLevelFun(level){
      console.log("inside the level")
        this.level = level;
        this.signUpForm.get('managerName').reset();
        if(level == "level 1"){
            this.levelFlag = true;
            this.signUpForm.get('managerName').reset();
            this.signUpForm.get('managerName').disable();
        }else{
            this.levelFlag = false;
            // this.signUpForm.get('managerName').setValue('level 1 user');
            this.signUpForm.get('managerName').enable();
        }
  }

  signUp() {
    this.validateForm();
    if(this.level == null){
        this.errorMsg = "*Please select the access level"
        this.hasError = true;
    }else if(this.signUpForm.value.password != this.signUpForm.value.confirmPassword){
        this.errorMsg = "* Password and confirm Password should be the same"
        this.hasError = true;
    }else{
        this.hasError = false;
    }

    console.log(this.signUpForm.get('managerName').value)
    if(this.signUpForm.get('managerName').value == null && this.level == "level 1"){
        this.signUpForm.value.managerName = this.signUpForm.value.username;
    }else{
        this.signUpForm.value.managerName = this.signUpForm.get('managerName').value;
    }

    if(this.signUpForm.status == 'VALID' && !this.hasError){
            let username = 'username';
            let password = 'pass_word';
            let level = 'access_level';
            let UserCode = 'user_code';
            let email = 'email_addr';
            let managerName = 'mgr_username';
            let companyName = 'companyName';
          
            var SignUpObj = (
              SignUpObj={}, 
              SignUpObj[username]=this.signUpForm.value.username, SignUpObj,
              SignUpObj[password]=this.signUpForm.value.password, SignUpObj,
              SignUpObj[level]=this.level, SignUpObj,
              SignUpObj[UserCode]=this.signUpForm.value.UserCode, SignUpObj,
              SignUpObj[email]=this.signUpForm.value.email, SignUpObj,
              SignUpObj[managerName]=this.signUpForm.value.managerName, SignUpObj,
              SignUpObj[companyName]=this.signUpForm.value.companyName, SignUpObj
            );

            this.spinner.show();
            this.signUpService.signUp(SignUpObj, (resp) => {
              this.userMessage = resp;
              this.spinner.hide();
              if(this.userMessage.message == "Data Saved Successfully"){
                this.router.navigate(['/Main/']);
                this.parcelService.getLoginDetails(this.userMessage);
              }else if(this.userMessage.message == "User Already Exists"){
                this.errorMsg = "* UserName Already exists, Please provide an Unique Value!";
              }
              if(!resp){
                this.errorMsg = "Invalid Credentials!";
              }
              setTimeout(() => {
                /** spinner ends after 5 seconds */
                this.spinner.hide();
              }, 5000);
            })
      }else{
        console.log("SignUp form Not valid")
    }
    
  }
}

export interface userMessage {
  message,
  userName,
  access,
  companyName,
  userCode
}
