import { ProductEventComponent } from './components/product-event/product-event.component';
import { DashboardContainerComponent } from './components/dashboard-container/dashboard-container.component';
import { TrendAnalyticsComponent } from './components/trend-analytics/trend-analytics.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AuditTrailComponent } from './components/audit-trail/audit-trail.component';
import { SignalEvalutionComponent } from './components/signal-evalution/signal-evalution.component';
import { SignalTrackingComponent } from './components/signal-tracking/signal-tracking.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignalDetectionComponent } from './components/signal-detection/signal-detection.component';
import { LoginComponent } from './components/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './helpers/auth.guard';
import { SignalPlanningComponent } from './components/signal-planning/signal-planning.component';
import { SignalReportComponent } from './components/signal-report/signal-report.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'signal-detection', component: SignalDetectionComponent, canActivate: [AuthGuard] },
  { path: 'dashboard-cont', component: DashboardContainerComponent, canActivate: [AuthGuard],

  children: [
    { path: '', component: DashboardComponent},
    { path: 'dashboard', component: DashboardComponent },
    { path: 'trends', component: TrendAnalyticsComponent },
    { path: 'product-event', component: ProductEventComponent }
  ]
   },
  { path: 'signal-tracking', component: SignalTrackingComponent, canActivate: [AuthGuard] },
  { path: 'signal-evaluation', component: SignalEvalutionComponent, canActivate: [AuthGuard] },
  { path: 'audit-trail', component: AuditTrailComponent, canActivate: [AuthGuard] },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard] },
  { path: 'signal-planning', component: SignalPlanningComponent, canActivate: [AuthGuard] },
  { path: 'signal-report/:domain/:code/:reportid/:product/:event/:custom', component: SignalReportComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes) ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
