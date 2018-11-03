import { Component, ElementRef, ViewChild, OnInit, Injectable} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'hms-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  
  constructor(
    
  ){
    
  }

  ngOnInit(){
    console.log("inside the data");
  }
}
