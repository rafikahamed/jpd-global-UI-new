import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  MatButtonModule,
  MatCheckboxModule,
  MatCardModule,
  MatInputModule,
  MatFormFieldModule,
  MatToolbarModule,
  MatSidenavModule,
  MatRadioModule,
  MatIconModule,
  MatListModule,
  MatGridListModule,
  MatStepperModule,
  MatExpansionModule,
  MatMenuModule,
  MatDatepickerModule,
  MatSelectModule,
  MatDialogModule,
  MatNativeDateModule,
  MatTabsModule,
  MatTableModule,
  MatProgressBarModule
} from '@angular/material';

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatRadioModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatStepperModule,
    MatExpansionModule,
    MatMenuModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatTableModule,
    MatProgressBarModule
  ],
  exports: [
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatRadioModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatStepperModule,
    MatExpansionModule,
    MatMenuModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatTableModule,
    MatProgressBarModule
  ],
  providers: [],
  bootstrap: []
})
export class UiModule { }
