import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserIdleModule } from 'angular-user-idle';
import { UiModule } from 'app/ui/ui.module';
import { HmsComponent } from 'app/hms/hms.component';
import { HomeComponent } from 'app/hms/home/home.component';
import { LoginComponent } from 'app/hms/login/login.component';
import { SignUpService } from 'app/hms/service/signUp.service';
import { LoginService } from 'app/hms/service/login.service';
import { UserService } from 'app/hms/service/user.service';
import { ParcelService } from 'app/hms/service/parcel.service';
import { AdminService } from 'app/hms/service/admin.service';
import { GstComponent } from './gst/gst.component';
import { TermsServiceComponent } from './terms-services/terms-services.component';
import { AboutComponent } from './about/about.componet';
import { PriceComponent } from './price/price.component';
import { MatFileUploadModule } from 'angular-material-fileupload';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ArnRegistrationComponent } from './arn-register/arn-register.component';
import { PolicyComponent } from './policy/policy.component';
import { ArticleComponent } from './article/article.component';
import { ImportComponent } from './import/import.component';
import { ExportComponent } from './export/export.component';
import { ParcelDownloadComponent } from './parcel-download/parcel-download.component';
import { ARNAdminUploadComponent } from './arn-admin-upload/arn-admin-upload.component';
import { ARNAdminSignUpComponent } from './arn-admin-signup/arn-admin-signup.component';
import { ARNAdminDownloadComponent } from './arn-admin-download/arn-admin-download.component';
import { ArnRegistrationUserComponent } from './arn-register-user/arn-register-user.component';
import { DeleteComponent } from './delete/delete.component';
import { AgGridModule } from "ag-grid-angular/main";
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    NgxSpinnerModule,
    DropdownModule,
    AgGridModule.withComponents([]),
    UserIdleModule.forRoot({idle: 300, timeout: 30, ping: 1}),
    RouterModule.forRoot([
          { path: "", redirectTo: "home", pathMatch: "full" },
          { path: "login", component: LoginComponent },
          { path: "home", component: HomeComponent },
          { path: "resource-gst", component: GstComponent},
          { path: "pricing", component: PriceComponent},
          { path: "about", component: AboutComponent},
          { path: "jpd/arn-registration", component: ArnRegistrationComponent},
          { path: "resource-termsAndServices", component: TermsServiceComponent},
          { path: "resource-policy", component: PolicyComponent},
          { path: "resource-article", component: ArticleComponent},
          { path: "gst-service/import", component: ImportComponent},
          { path: "gst-service/export", component: ExportComponent},
          { path: "arn-registration/user", component: ArnRegistrationUserComponent},
          { path: "gst-service/download", component: ParcelDownloadComponent},
          { path: "arn-register/admin", component: ARNAdminUploadComponent},
          { path: "arn-register/signUp", component: ARNAdminSignUpComponent},
          { path: "arn-register/download", component: ARNAdminDownloadComponent},
          { path: "gst-service/delete", component: DeleteComponent}
    ], { useHash: true }),
    UiModule
  ],
  declarations: [
    HmsComponent,
    HomeComponent,
    LoginComponent,
    GstComponent,
    AboutComponent,
    PriceComponent,
    ArnRegistrationComponent,
    TermsServiceComponent,
    PolicyComponent,
    ArticleComponent,
    ImportComponent,
    ExportComponent,
    ParcelDownloadComponent,
    ARNAdminUploadComponent,
    ARNAdminSignUpComponent,
    ARNAdminDownloadComponent,
    ArnRegistrationUserComponent,
    DeleteComponent
  ],
  entryComponents: [],
  providers: [
    { provide: 'Window', useValue: window },
    SignUpService,
    LoginService,
    UserService,
    ParcelService,
    AdminService
  ],
  bootstrap: [
    HmsComponent
  ]
})
export class HmsModule {
  constructor() {
 
  }
}