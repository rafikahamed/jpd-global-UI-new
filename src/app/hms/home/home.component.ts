import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'hms-home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.css'
    // './home.component.css','../../../assets/css/home.css',
    // "../../../../vendor/css/animate.min.css",
    // "../../../../vendor/css/slicknav.min.css",
    // "../../../../vendor/css/owl.theme.default.css",
    // "../../../../vendor/css/owl.carousel.min.css",
    // "../../../../vendor/css/magnific-popup.css",
    // "../../../../vendor/css/bootstrap.min.css",
    // "../../../../vendor/css/skin/green.css"
  ]
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
  }
}
