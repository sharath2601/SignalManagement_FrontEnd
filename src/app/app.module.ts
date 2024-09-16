import { NgxPaginationModule } from 'ngx-pagination';
import { ErrorInterceptor } from './helpers/error-interceptor.interceptor';
import { BasicAuth } from './helpers/basic-auth.interceptor';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxUiLoaderModule, NgxUiLoaderConfig, SPINNER, POSITION } from 'ngx-ui-loader';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SignalDetectionComponent } from './components/signal-detection/signal-detection.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignalTrackingComponent } from './components/signal-tracking/signal-tracking.component';
import { SignalEvalutionComponent } from './components/signal-evalution/signal-evalution.component';
import { AuditTrailComponent } from './components/audit-trail/audit-trail.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { CustomTableComponent } from './components/custom-table/custom-table.component';
import { CustomModalComponent } from './components/custom-modal/custom-modal.component';
import { CustomindireportComponent } from './components/customindireport/customindireport.component';
import { CustomSignalsComponent } from './components/custom-signals/custom-signals.component';
import { TrendAnalyticsComponent } from './components/trend-analytics/trend-analytics.component';
import { DashboardContainerComponent } from './components/dashboard-container/dashboard-container.component';
import { ProductEventComponent } from './components/product-event/product-event.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import {EditorModule} from 'primeng/editor';
import {ButtonModule} from 'primeng/button';

import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {DialogModule} from 'primeng/dialog';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {MultiSelectModule} from 'primeng/multiselect';

import {CalendarModule} from 'primeng/calendar';
import { SignalPlanningComponent } from './components/signal-planning/signal-planning.component';
import { SignalReportComponent } from './components/signal-report/signal-report.component';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsColor: '#EB5627', // foreground spinner color
  fgsPosition: POSITION.centerCenter, // forground spinner position
//  fgsType: "three-stringsx", // foreground spinner type
'fgsType': 'three-strings',
 logoUrl: 'assets/img/mai-signal-gif-animation.png',
//  logoSize: 150,
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FooterComponent,
    HeaderComponent,
    SignalDetectionComponent,
    DashboardComponent,
    SignalTrackingComponent,
    SignalEvalutionComponent,
    AuditTrailComponent,
    AdminDashboardComponent,
    CustomTableComponent,
    CustomModalComponent,
    CustomindireportComponent,
    CustomSignalsComponent,
    TrendAnalyticsComponent,
    DashboardContainerComponent,
    ProductEventComponent,
    SignalPlanningComponent,
    SignalReportComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    FontAwesomeModule,
    NgbModule,
    NgSelectModule,
    NgxChartsModule,
    EditorModule,
    ButtonModule,
    TableModule,
    DropdownModule,
    DialogModule,
    AutoCompleteModule,
    MultiSelectModule,
    ScrollingModule,
    CKEditorModule,
    CalendarModule,
    NgxPaginationModule,
  ],
  entryComponents: [CustomModalComponent, CustomindireportComponent, CustomSignalsComponent],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuth, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
