import { ValidationModal } from './../../helpers/validation-modal';
import { MessageService } from './../../services/message-service';
import { User } from './../../models/user.model';
import { Component, OnInit, DoCheck } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { first, flatMap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpService } from 'src/app/services/http.service';
import { SignalReport } from 'src/app/models/signal-report.model';
declare var $: JQueryStatic;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, DoCheck {
  routeToAdminDashboard = '/admin-dashboard';
  routeToDashboard = '/dashboard';
  routeToSignalDetection = '/signal-detection';
  routeToSignalTracking = '/signal-tracking';
  routeToUnHandledSig = '/unhandled-signals';
  routeToSignalEvaluation = '/signal-evaluation';
  routeToAuditTrail = '/audit-trail';
  routeToCalender = '/signal-planning';
  routeToCases = '/cases';
  userName: any;
  showAdminDashboard = false;
  message: string;
  selectedItem: any;
  selectedDrpdwn: any;
  showheader: boolean = true;
  router1: string;

  constructor(private authenticationService: AuthenticationService,
     private router: Router,
     private validationModal: ValidationModal,
     private route: ActivatedRoute
     ) {
  }

  ngOnInit() {
    this.router1 =window.location.href;
    if(this.router1.includes("signal-report"))
    {

      this.showheader= false;
    }
    else
    {
      this.showheader= true;

    }

    // const cUrl = window.location.href;
    // const splStr = cUrl.split('/');
    // if (splStr.length === 6) {
    //   switch (splStr[5]) {
    //     case 'dashboard':
    //       this.selectedDrpdwn = 'Dashboard';
    //       break;
    //     case 'product-event':
    //       this.selectedDrpdwn = 'Signal Analytics';
    //       break;
    //     case 'trends':
    //       this.selectedDrpdwn = 'Timeline Comparison';
    //       break;
    //   }
    // } else {
    //   this.selectedDrpdwn = 'Dashboard';
    // }
  }

  ngDoCheck(): void {
    this.userName = this.authenticationService.currentUserValue.user_name;
    if (this.authenticationService.currentUserValue.roles !== undefined) {
      if (this.authenticationService.currentUserValue.roles.is_admin) {
        this.showAdminDashboard = true;
      }
    }
    const cUrl = window.location.href;
    if(cUrl.includes("signal-report"))
    {
      this.showheader=false;
    }

    const splStr = cUrl.split('/');
    if (splStr.length === 6) {
      switch (splStr[5]) {
        case 'dashboard':
          this.selectedDrpdwn = 'Dashboard';
          break;
        case 'product-event':
          this.selectedDrpdwn = 'Signal Analytics';
          break;
        case 'trends':
          this.selectedDrpdwn = 'Timeline Comparison';
          break;
      }
    } else {
      this.selectedDrpdwn = 'Dashboard';
    }
  }

  changePage(path: any, selectedItem: any) {
    this.selectedDrpdwn = selectedItem;
    this.router.navigate([path]);
  }

  logoutUser() {
    this.authenticationService.logout().pipe(first()).subscribe((data: any) => {
      if (data.success) {
        this.validationModal.showMessage('Logged Out Successful', 'success');
        setTimeout(() => {
          this.router.navigate(['/']);
          this.authenticationService.clearData();
        }, 1200);

      }
    },
      (error) => {
        this.authenticationService.clearData();
        this.router.navigate(['/']);
      }
    );
  }

}
