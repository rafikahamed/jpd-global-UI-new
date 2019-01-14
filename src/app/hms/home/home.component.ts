import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from 'app/hms/service/login.service';

@Component({
  selector: 'hms-home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.css' ]
})
export class HomeComponent {
  contactForm: FormGroup;
  errorMsg: string;
  successMsg: String;
  constructor(
    private router: Router,
    public loginservice: LoginService
  ){
    this.contactForm = new FormGroup({
      name: new FormControl(),
      email: new FormControl(),
      subject: new FormControl(),
      message: new FormControl()
    });
  };

  gstchange(){
    this.router.navigate(['/resource-gst/']);
  };

  gstclick(){
    this.router.navigate(['/resource-article/']);
  };

  termsclick(){
    this.router.navigate(['/resource-termsAndServices/']);
  };

  policyclick(){
    this.router.navigate(['/resource-policy/']);
  };

  arnchange(){
    this.router.navigate(['/jpd/arn-registration/']);
  };

  contactSubmit(){
    this.successMsg = '';
    this.errorMsg = '';
    if(this.contactForm.status == 'VALID'){
      this.loginservice.contactUs(this.contactForm.value, (resp) => {
        this.successMsg = '*Thanks ffor contacing us, JPD Team will reach you soon';
        // setTimeout(() => {
        //   this.spinner.hide();
        // }, 5000);
      })
    }else{
      this.errorMsg = '*Form is Invalid, Please fill all the details';
    }
  };

}
