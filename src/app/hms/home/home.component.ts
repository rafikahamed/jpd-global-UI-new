import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'hms-home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.css' ]
})
export class HomeComponent {
  constructor(
    private router: Router
  ){
    
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
}
