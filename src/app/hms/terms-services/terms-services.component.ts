import { Component, ElementRef, ViewChild, OnInit, Injectable} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'hms-home',
  templateUrl: './terms-services.component.html',
  styleUrls: ['./terms-services.component.css']
})
export class TermsServiceComponent implements OnInit {
  
  constructor(
    
  ){
    
  }

  ngOnInit(){
    console.log("inside the data");
  }
}
