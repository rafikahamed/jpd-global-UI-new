import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminService } from 'app/hms/service/admin.service';
declare var $: any;

@Component({
  selector: 'hms-home',
  templateUrl: './arn-register.component.html',
  styleUrls: ['./arn-register.component.css']
})
export class ArnRegistrationComponent {
  errorMsg: string;
  loginForm: FormGroup;
  userMessage: userMessage;
  constructor(
    public AdminService: AdminService, 
    private spinner: NgxSpinnerService,
    private router: Router,
  ){
    this.loginForm = new FormGroup({
      userName: new FormControl('', Validators.required),
      passWord: new FormControl('', Validators.required)
    });
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

 adminLogin() {
   console.log("Login Form Status"+this.loginForm.status);
   this.validateForm();
   if(this.loginForm.status == 'VALID'){
     this.spinner.show();
     this.AdminService.adminLogin(this.loginForm.value, (resp) => {
       this.userMessage = resp;
       if(this.userMessage.message == "Admin Logged In Successfully"){
         this.spinner.hide();
         $('#myModal').modal('toggle');
         this.router.navigate(['/arn-registration/admin']);
       }
       if(this.userMessage.message == "User dose not have access to login"){
         this.spinner.hide();
         this.errorMsg = "*Invalid Credentials! please send email to JPD support";
       }
 
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
