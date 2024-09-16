import { ValidationModal } from './../../helpers/validation-modal';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { first, take } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import * as XLSX from 'xlsx';
import { HttpService } from './../../services/http.service';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { Converter } from 'src/app/helpers/converter';
declare var $: any;

@Component({
  selector: 'app-signal-tracking',
  templateUrl: './signal-tracking.component.html',
  styleUrls: ['./signal-tracking.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SignalTrackingComponent implements OnInit, OnDestroy {

  /*All required variables declarations starts here */
  rows = [];
  // icsrRows = [];
  faDownload = faDownload;
  selectedSignalId;
  selectedDate;
  statusList = [];
  usersList = [];
  isAdmin: any;
  parameters: any;
  /**dropdowns variables */
  type: any;
  typeList: any;
  product: any;
  productList: any;
  quarter: any;
  quarterList: any;
  event: any;
  eventList: any;
  status: any;
  prodsLoading: boolean;
  eventsLoading: boolean;
  quLoading: boolean;
  startCount: any;
  endCount: any;
  totalCount: any;
  isdashboardclick = false;
  trackingtableData: any;

  /*variables declaration ends here */

  constructor(private httpService: HttpService,
    private router: Router,
    private authService: AuthenticationService,
    private ngxLoader: NgxUiLoaderService,
    private validationModal: ValidationModal,
    private converter: Converter) { }

  ngOnInit() {
    this.type = 'Drug';
    this.startCount = 1;
    this.endCount = 500;
    this.selectedDate = moment.utc().add(1, 'd').format('DD-MMM-YYYY');

    /*Status initiation*/
    this.statusList = [
      { id: 1, name: 'Open' },
      { id: 2, name: 'OnGoing' },
      { id: 3, name: 'Closed' }
    ];

    if (this.authService.currentUserValue.roles !== undefined) {
      if (this.authService.currentUserValue.roles.is_admin) {
        this.isAdmin = true;
      }
    }

    this.httpService.currentValidateObj.pipe(take(1)).subscribe((params) => {
      this.parameters = params;
      if (this.parameters.dashboard === 'Yes' && this.parameters.page === 'validate') {
        this.isdashboardclick = true;
        this.getFilteredSignals();
      } else {
        this.getValidSignals();
      }
    });
  }

  getFilteredSignals() {
    const obj = this.parameters;
    this.ngxLoader.start();
    if (obj.isGrade) {
      this.httpService.GetValFilteredSignalsbyGrade(obj.type, obj.quarter, obj.pName, obj.event, obj.statusValue)
        .subscribe((data: any) => {
          this.ngxLoader.stop();
          this.rows = data.Signals;
        },
          (error) => {
            this.ngxLoader.stop();
            /**to find issue */
            this.validationModal.showMessage('tracking filter issue 1' + error, 'error');
          }
        );
    } else {
      const cEve = this.converter.convert(obj.event);
      this.httpService.GetValFilteredSignalsbyStatus(obj.type, obj.prodfamily, obj.quarter, obj.pName, obj.event, obj.statusValue)
        .subscribe((data: any) => {
          this.ngxLoader.stop();
          this.rows = data.Signals;
          // tslint:disable-next-line: forin
          for (const i in this.rows) {
            let y = [];
            if (this.rows[i].assigned_to.length > 0) {
              y = this.rows[i].assigned_to.map(item => item.itemName.replace(/\s/g, ''));
            }

            const key = 'assigned';
            const manual = 'manual';

            const value = y.length > 0 ? y.join(', ') : 'UnAssigned';
            const value1 = this.rows[i].is_custom === true ? 'Yes' : ' ';

            this.rows[i][key] = value;
            this.rows[i][manual] = value1;
          }
        },
          (error) => {
            this.ngxLoader.stop();
            /**to find issue */
            this.validationModal.showMessage('tracking filter issue 2' + error, 'error');
          }
        );
    }

  }

  /*Method to get users list */
  getUsersList() {
    this.httpService.GetUsersList().pipe(first()).subscribe((data: any) => {
      this.usersList = data.users;
    },
      (error) => {
        this.ngxLoader.stop();
      }
    );
  }

  /*Method to get valid signals for signal tracking */
  getValidSignals() {
    this.ngxLoader.start();
    const todayDate = moment.utc();
    setTimeout(() => {

      this.httpService.GetValidSignals().subscribe((data: any) => {
        data.Signals.forEach(element => {
          const diff = moment.utc(element.targetDate).diff(todayDate, 'd');
          if (diff <= 7 && diff >= 1) {
            element.by_week = true;
          }

          if (diff <= 1) {
            element.by_day = true;
          }
        });
        this.rows = data.Signals;
        // tslint:disable-next-line: forin
        for (const i in this.rows) {
          let y = [];
          if (this.rows[i].assigned_to.length > 0) {
            y = this.rows[i].assigned_to.map(item => item.itemName.replace(/\s/g, ''));
          }

          const key = 'assigned';
          const manual = 'manual';

          const value = y.length > 0 ? y.join(', ') : 'UnAssigned';
          const value1 = this.rows[i].is_custom === true ? 'Yes' : ' ';

          this.rows[i][key] = value;
          this.rows[i][manual] = value1;

        }
        this.ngxLoader.stop();
      },
        error => {
          this.ngxLoader.stop();
          if (error === 'Unauthorized') {
            this.authService.clearData();
            this.router.navigate(['/']);
          }
        }
      );
    }, 600);
  }

  /*data to be exported into excel and downloaded */
  download() {
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.rows);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'signal-tracking.xlsx');
  }

  ngOnDestroy(): void {
    this.httpService.setValidateParameters({});
    // unsubscribing the event
  }

}
