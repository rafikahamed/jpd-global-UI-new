import { Component, ElementRef, ViewChild, OnInit, Injectable} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { LoginService } from 'app/hms/service/login.service';
import { ParcelService } from 'app/hms/service/parcel.service';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'hms-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  errorMsg: string;
  loginForm: FormGroup;
  userMessage: userMessage;
  loginBut: boolean;

  constructor(
    public loginservice: LoginService, 
    public parcelService: ParcelService, 
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
      this.errorMsg = null;
      this.loginBut = true;
      this.loginForm = new FormGroup({
        userName: new FormControl('', Validators.required),
        passWord: new FormControl('', Validators.required)
      });
  }

  ngOnInit(){
  }

  validateForm(){
     /*==================================================================
          [ Focus input ]*/
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
            });
        });

        function validate (input) {
            if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
                if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                    return false;
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

  login(){
    this.validateForm();
    this.errorMsg = null;
    if(this.loginForm.status == 'VALID'){
      this.spinner.show();
      this.loginservice.authenticate(this.loginForm.value, (resp) => {
        console.log(resp)
        this.userMessage = resp;
        this.parcelService.getLoginDetails(this.userMessage);
        if(this.userMessage.message == "logged In Successfully"){
          this.spinner.hide();
          if(resp.access == 'adminLevel'){
            this.router.navigate(['arn-register/admin']);
          }
          if(resp.access != 'adminLevel'){
            this.router.navigate(['/gst-service/import/']);
          }
        }
        if(this.userMessage.message == "User dose not have access to login"){
          this.spinner.hide();
          this.errorMsg = "*Invalid Credentials! *First time user please Signup befor login";
        };
        setTimeout(() => {
          this.spinner.hide();
        }, 5000);
      })
    }else{
      console.log("Form is invalid")
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
