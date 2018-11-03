import { Component, ElementRef, ViewChild, OnInit, Injectable} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'hms-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.css']
})
export class PolicyComponent implements OnInit {
  
  constructor(
    
  ){
    
  }

  ngOnInit(){
    console.log("inside the data");
  }
}
