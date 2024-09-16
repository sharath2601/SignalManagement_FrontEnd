import { GenericLocalStorage } from './../../helpers/generic-local-storage';
import { Encoder } from 'src/app/services/encoder';
import { TableUpdation } from './../../models/table-updation';
import { ValidationModal } from './../../helpers/validation-modal';
import { CustomModalComponent } from './../custom-modal/custom-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StatisticalUpdate } from 'src/app/models/statistical-update.model';
import { HttpService } from './../../services/http.service';
import {
  faPencilAlt,
  faSave,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  AfterContentChecked,
  ViewChild,
  DoCheck,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as moment from 'moment';
import { first, takeUntil, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Converter } from 'src/app/helpers/converter';
import * as XLSX from 'xlsx';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { GenericDomainProductFamily } from 'src/app/services/GenericDomainProductFamily';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-custom-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.css'],
})
export class CustomTableComponent implements OnInit, DoCheck, OnDestroy {
  @ViewChild('dttrack') table: Table;

  trackingtableData: any;
  totalRecords: any;
  domainwithall: { label: string; value: string }[];
  productListprimeng: any = [];
  statuswithall: { label: string; value: string }[];
  Prioritywithall: { label: string; value: string }[];
  allevents: any;
  finalproducts: string;
  trackingdoamin: any;
  trackingevent: any;
  trackingstatus: any;
  trackingpriority: any;
  signalcode: any;
  assigneduser: any;
  reported_date_From: any;
  reported_date_flag = true;
  reported_date_To: any;
  targetDate_To: string;
  targetDate_flag = true;
  targetDate_From: string;
  validation_date_flag = true;
  validation_date_To: string;
  validation_date_From: string;
  /**variables declaration ends */

  /**Required Variables declaration starts */
  @Input() tableData: any = [];
  @Input() prodFam: any;
  @Input() tableHeaders: any;
  @Input() actionsNeeded: any;
  @Input() receivedMsg: string;
  @Input() isdashbaordclick: any;

  @Input() type: string;
  @Input() method: string;
  @Input() cols: any;
  queryPrrCols: any;
  queryPrrChiCols: any;
  queryFCols: any;
  queryDCols: any;
  faPencilAlt = faPencilAlt;
  faSave = faSave;
  faTimes = faTimes;
  isNeeded: any;
  currentPage = 1;
  term: any;
  showModals = false;
  modalsData: any;
  isValidSignal: any = false;
  enteredComment: any;
  selectedSignalId;
  getIsPt: any;
  trackingcols: any[];
  validationList = [
    { id: 1, itemName: 'Valid' },
    { id: 2, itemName: 'Signal Already Validated' },
    { id: 3, itemName: 'Previously evaluated and closed' },
    { id: 4, itemName: 'Lack of efficiency' },
    { id: 5, itemName: 'UnIdentified Condition' },
    { id: 6, itemName: 'Limited Information' },
    { id: 7, itemName: 'Alternative Explanation' },
    { id: 8, itemName: 'None' },
  ];

  selectedValidItem: any;
  selectedReason = [];
  selectedUser = [];
  selectedStatus = [];
  selectedDate;
  priorityList = [];
  selectedPriority = [];
  prioritySettings = {};
  indexComment: string;
  usersList = [];
  userSettings = {};
  statusSelFromSignal: string;
  reasonList = [];
  statusList = [];
  arrproductselected = [];
  selectIndex;

  // filter variables for signal tracking
  pTerm: any;
  sTerm: any;
  scTerm: any;
  stTerm: any;
  asTerm: any;
  prTerm: any;
  rtTerm: any;
  trTerm: any;
  methodsList = [];
  changedMethodsList = [];
  // temporary variable to store tabledata
  fList: any = [];

  periodicity: any = [];
  statuses: { label: string; value: string }[];
  methods: { label: string; value: string }[];
  displayDialog: boolean;
  nerecordsdata: {};
  customProdType: any;
  customProdName: any;
  customComment: any = '';
  customEvent: any;
  selectedPng: any;
  pngOptions: any;
  productList: any;
  pngProdName: any;
  selectedMethod: any;

  /**variables for admin page */
  selEditUser: any = {};
  cancelledUser: any;
  adminValue: any;
  managerValue: any;
  activeUserValue: any;

  /**variables for lazy loading */
  loading: boolean;
  totalItemsCount: any;
  signals: any = [];
  planningcols: { field: string; header: string }[];
  // tslint:disable-next-line: member-ordering
  options: any;
  planningData: any;
  email: any;
  name: any;
  oldValue: string;
  loader: boolean;
  icsrCommentUpdated: any;
  isProdFamSel: any;
  subs: Subscription;
  productFamily: { id: number; name: string }[];
  selectProductFamily: any;
  selectedfamily: boolean;
  clonedTableData: any = [];
  addCustomUser = (term) => ({ id: term, name: term });

  constructor(
    private httpService: HttpService,
    private ngxLoader: NgxUiLoaderService,
    private router: Router,
    private converter: Converter,
    private modalService: NgbModal,
    private cdref: ChangeDetectorRef,
    private validationModal: ValidationModal,
    private update: TableUpdation,
    private prodFamily: GenericDomainProductFamily,
    private encodeValue: Encoder,
    private authenticationService: AuthenticationService,
    private localStorage: GenericLocalStorage
  ) {}

  ngOnInit(): void {
    // if actions column needed in table or not
    // this.getallProducts('All');
    // this.getallEvents('All');
    this.productFamily = this.prodFamily.selectProductFamilyType();
    this.selectProductFamily = this.productFamily[0].name;
    this.getUsersList();
    this.cols = [
      { field: 'product', header: 'Product Name' },
      { field: 'name', header: 'Event Name ' },
      { field: 'method', header: 'Detection Method' },
      { field: 'caseCount', header: 'Case Count' },
      { field: 'current_review_period', header: 'Reporting Period Case Count' },
      { field: 'short_comment', header: 'Short Comment' },
    ];

    this.queryPrrCols = [
      { field: 'product', header: 'Product Name' },
      { field: 'name', header: 'Event Name ' },
      { field: 'method', header: 'Detection Method' },
      { field: 'level', header: 'Level' },
      { field: 'result.PRR_Lower_Bound', header: 'PRR(-)' },
      { field: 'result.PRR', header: 'PRR()' },
      { field: 'result.PRR_Upper_Bound', header: 'PRR(+)' },
      { field: 'caseCount', header: 'Case Count' },
      { field: 'short_comment', header: 'Short Comment' },
    ];

    this.queryPrrChiCols = [
      { field: 'product', header: 'Product Name' },
      { field: 'name', header: 'Event Name ' },
      { field: 'method', header: 'Detection Method' },
      { field: 'level', header: 'Level' },
      { field: 'result.PRR_Lower_Bound', header: 'PRR(-)' },
      { field: 'result.PRR', header: 'PRR()' },
      { field: 'result.PRR_Upper_Bound', header: 'PRR(+)' },
      { field: 'result.ChiSqure', header: 'ChiSquare' },
      { field: 'caseCount', header: 'Case Count' },
      { field: 'short_comment', header: 'Short Comment' },
    ];

    this.queryFCols = [
      { field: 'product', header: 'Product Name' },
      { field: 'name', header: 'Event Name ' },
      { field: 'method', header: 'Detection Method' },
      { field: 'level', header: 'Level' },
      { field: 'caseCount', header: 'Case Count' },
      { field: 'short_comment', header: 'Short Comment' },
    ];

    this.queryDCols = [
      { field: 'product', header: 'Product Name' },
      { field: 'name', header: 'Event Name ' },
      { field: 'method', header: 'Detection Method' },
      { field: 'level', header: 'Level' },
      { field: 'caseCount', header: 'Case Count' },
      { field: 'short_comment', header: 'Short Comment' },
    ];

    this.domainwithall = [
      { label: 'Drug', value: 'Drug' },
      { label: 'Cosmetic', value: 'Cosmetic' },
      { label: 'Medical Device', value: 'Medical Device' },
    ];
    this.statuswithall = [
      { label: 'OPEN', value: 'OPEN' },
      { label: 'ONGOING', value: 'ONGOING' },
      { label: 'CLOSED', value: 'CLOSED' },
    ];
    this.Prioritywithall = [
      { label: 'Grade 1', value: 'Grade 1' },
      { label: 'Grade 2', value: 'Grade 2' },
      { label: 'Grade 3', value: 'Grade 3' },
    ];
    this.trackingcols = [
      { field: 'domain', header: 'Domain' },
      { field: 'product', header: 'Product Name' },
      { field: 'AE', header: 'Signal Name' },
      { field: 'code', header: 'Signal Code' },
      { field: 'manual', header: 'Manual' },
      { field: 'status', header: 'Status' },
      { field: 'assigned', header: 'Assigned To' },
      { field: 'priority', header: 'Priority' },
      { field: 'reported_date', header: 'Reported Date' },
      { field: 'validation_date', header: 'Validation Date' },
      { field: 'targetDate', header: 'Target Date' },
    ];
    this.isNeeded = this.actionsNeeded;
    this.selectedDate = moment.utc().add(1, 'd').format('DD-MMM-YYYY');
    this.getStatisticalMethods();
    this.getProductTypes();

    this.periodicity = [
      { id: 3, name: '3 Months' },
      { id: 6, name: '6 Months' },
      { id: 9, name: '9 Months' },
      { id: 12, name: '12 Months' },
    ];

    this.methods = [
      { label: 'PRR', value: 'PRR' },
      { label: 'PRR+Chisquare', value: 'PRR+Chisquare' },
      { label: 'Frequency', value: 'Frequency' },
      { label: 'DME', value: 'DME' },
    ];

    this.options = [
      { id: 0, value: 'YES' },
      { id: 1, value: 'NO' },
    ];

    this.subs = this.httpService.change.subscribe(
      (comment) => (this.icsrCommentUpdated = comment)
    );

    setTimeout(() => {
      if (this.receivedMsg === 'adminDashboard') {
        this.localStorage.saveObject('table-data', this.tableData);
      }
    }, 1000);
  }

  ngDoCheck() {
    this.cdref.detectChanges();
    if (this.icsrCommentUpdated === true) {
      this.tableData = [
        ...this.tableData.slice(0, this.update.rowIndex),
        this.update,
        ...this.tableData.slice(this.update.rowIndex + 1),
      ];
    }
    this.httpService.nextChange(false);
  }

  getProductTypes() {
    this.httpService.GetProductTypes().subscribe(
      (types: any) => {
        const filteredTypes = types.products.filter((item) => {
          return item.count > 500;
        });
        this.pngOptions = filteredTypes;
        this.selectedPng = this.pngOptions[0].name;
        this.getProducts();
      },
      (error) => {
        /**to find issue */
        this.validationModal.showMessage(
          'cust table domain issue' + error,
          'error'
        );
      }
    );
  }

  enableEditing(item: any, i: any) {
    for (let index = 0; index < this.tableData.length; index++) {
      if (i !== index) {
        const element = this.tableData[index];
        element.isClicked = false;
      }
    }
    item.isClicked = true;
  }

  cancelEditing(item: any, i: any) {
    item.isClicked = false;
    const ltd = JSON.parse(this.localStorage.getItemRObjects('table-data'));
    this.tableData =
      ltd !== null || ltd !== undefined || ltd.length >= 1 ? ltd : [];
  }

  // getallProducts(item: any) {
  //   this.httpService.GetProductsByEvent(item, 'All').subscribe((eventsproduct: any) => {
  //     // this.single = types.data;;
  //     this.productListprimeng = eventsproduct.data;
  //   });
  // }

  // getallEvents(item: any) {
  //   this.httpService.GetEventsByProduct(item, 'All').subscribe((events: any) => {
  //     // this.single = types.data;;
  //     this.allevents = events.data;

  //   });
  // }

  /*Method to show available products */
  getProducts() {
    // console.log(this.selectedPng);
    this.pngProdName = '';
    if (this.selectProductFamily === 'Individual Product') {
      this.selectedfamily = false;
    } else {
      this.selectedfamily = true;
    }
    const selPng =
      this.selectedPng === undefined ||
      this.selectedPng === null ||
      this.selectedPng.length < 1
        ? 'Drug'
        : this.selectedPng;
    this.httpService
      .GetAvailableProducts(selPng, this.selectedfamily)
      .subscribe(
        (data: any) => {
          this.productList = data.products;
        },
        (error) => {
          /**to find issue */
          this.validationModal.showMessage(
            'cust table product issue ' + error,
            'error'
          );
        }
      );
  }

  /**Method to create custom signal in signal tracking page */
  createCustomSignal(ty: any, p: any, ev: any, c: any) {
    // tslint:disable-next-line: triple-equals
    if (ty == undefined || ty == '' || ty.match(/^\s*$/)) {
      this.validationModal.showMessage('Please select Product Type', 'warning');
      this.ngxLoader.stop();

      return;
    }
    // tslint:disable-next-line: triple-equals
    if (p == undefined || p == '' || p.match(/^\s*$/)) {
      this.validationModal.showMessage(
        'Product Name cannot be empty',
        'warning'
      );
      this.ngxLoader.stop();

      return;
    }
    // tslint:disable-next-line: triple-equals
    if (ev == undefined || ev == '' || ev.match(/^\s*$/)) {
      this.validationModal.showMessage('Event Name cannot be empty', 'warning');
      this.ngxLoader.stop();

      return;
    }
    const res = this.encodeValue.validateComment(c);
    if (c.length > 1 && res === false) {
      this.validationModal.showMessage(
        'Note cannot be begin or end with spaces',
        'warning'
      );
      this.ngxLoader.stop();

      return;
    }

    const crossedOrNot = this.encodeValue.checkCommentOrNotCrossedLimit(c);
    if (crossedOrNot) {
      this.validationModal.showMessage('Maximum characters allowed for note is 1000', 'warning');
      this.ngxLoader.stop();
      return;
    }
    this.ngxLoader.start();

    const model = {
      type: ty,
      name: p,
      event: ev,
      comment: c,
    };

    this.httpService.CreateCustomSignal(model).subscribe(
      (data: any) => {
        this.ngxLoader.stop();
        if (data.comment === 'Signal Code with entered product and event details already exists') {
          this.validationModal.showMessage(data.comment, 'warning');
        } else {
          this.validationModal.showMessage(data.data.comment, 'success');
          this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => {
            this.router.navigate(['/signal-tracking']);
          });
        }
        this.displayDialog = false;
      },
      (error) => {
        this.ngxLoader.stop();
        this.validationModal.showMessage(
          'cust table custom signal issue ' + error,
          'error'
        );
      }
    );
    this.displayDialog = false;
  }

  /**Method to create user in user management table */
  saveChanges(item: any) {
    this.httpService.UpdateAdminUser(item).subscribe(
      (data: any) => {
        item.isClicked = !item.isClicked;
        this.ngOnInit();
        this.localStorage.saveObject('table-data', this.tableData);
      },
      (error) => {
        /**to find issue */
        this.validationModal.showMessage(
          'user management table ' + error,
          'error'
        );
      }
    );
  }

  /**Method to check privileges for users */
  checkPrivileges(item: any, whom: string, event: any) {
    if (whom === 'admin') {
      if (
        item.is_admin.toLowerCase() === 'no' &&
        item.is_manager.toLowerCase() === 'no'
      ) {
        this.validationModal.showMessage(
          'Cannot assign same value for both Admin and Manager',
          'warning'
        );
        item.is_admin = 'YES';
      }
    } else if (whom === 'manager') {
      if (
        item.is_manager.toLowerCase() === 'no' &&
        item.is_admin.toLowerCase() === 'no'
      ) {
        this.validationModal.showMessage(
          'Cannot assign same value for both Manger and Admin',
          'warning'
        );
        item.is_manager = 'YES';
      }
    }
  }

  /**Method to validate groups in user management table */
  validateGroups(groupValue: any) {
    const val = groupValue.toLowerCase();
    if (val !== 'yes' || val !== 'no') {
      return false;
    }
    return true;
  }

  /**Method to open icsr listings related to particular signal */
  openRelatedIcsrList(item: any, currentOrNot: any, index: any) {
    if (item.signal_id !== -1) {
      this.isValidSignal = true;
    }

    if (item.level !== 'PT') {
      this.validationModal.showMessage(
        'Cases can only be drilled down for Preferred Term of MedDRA Hierarchy.',
        'info'
      );
      return;
    }

    const name = item.name ? item.name : item.pt;
    /**statement for updating single row in detection page filling with properties required for model class */
    // this.update.domain
    this.update.rowIndex = index;
    this.update.product = item.product;
    this.update.name = item.name;
    this.update.domain = item.domain;
    this.update.short_comment = item.short_comment;
    this.update.previous_short_comment = item.previous_short_comment;
    this.update.method = item.method;
    this.update.caseCount = item.caseCount;
    this.update.current_review_period = item.current_review_period;
    this.update.statSigComment = item.statSigComment;
    this.update.signal_id = item.signal_id;
    this.update.result = item.result ? item.result : {};
    this.update.level = item.level;
    this.update.prodFamily = this.prodFam;
    const modalRef = this.modalService.open(CustomModalComponent, {
      size: 'xl',
    });
    modalRef.componentInstance.showIcsrModal = true;
    modalRef.componentInstance.selectedProduct = item.product;
    modalRef.componentInstance.label = name;
    modalRef.componentInstance.type = this.type;
    modalRef.componentInstance.selSigItem = item;
    modalRef.componentInstance.CurrentQOrNot = currentOrNot;
  }

  /*Method to show statistical listings */
  getStatisticalMethods() {
    this.httpService.GetStatisticalMethods().subscribe(
      (data: any) => {
        this.methodsList = data.methods;
        this.methodsList.forEach((element) => {
          element.itemName.toUpperCase();
        });
        this.changedMethodsList = this.methodsList;
      },
      (error) => {
        this.validationModal.showMessage('custom table issue' + error, 'error');
      }
    );
  }

  /*Method to open icsr's modal for a signal*/
  openRelatedSignalData(data: any, index: any) {
    const modalRef = this.modalService.open(CustomModalComponent, {
      size: 'xl',
    });
    modalRef.componentInstance.showSignalTrackModal = true;
    modalRef.componentInstance.sigTrackData = data;
  }

  /*Method to get users list */
  getUsersList() {
    this.httpService
      .GetUsersList()
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.usersList = data.users;
          const unassigned = { id: '-1', itemName: 'UnAssigned' };
          this.usersList.push(unassigned);
        },
        (error) => {
          this.ngxLoader.stop();
          this.validationModal.showMessage(
            'userlist issue custom table' + error,
            'error'
          );
        }
      );
    this.selectedUser = [{ id: 0, itemName: '--Select User--' }];
    this.userSettings = { singleSelection: true };
  }

  getlesssevendays(date1, date2) {
    const Difference_In_Time = date1.getTime() - date2.getTime();
    let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    Difference_In_Days = Difference_In_Days * -1;
    if (Difference_In_Days < 8) {
      return true;
    } else {
      return false;
    }
  }

  compare_dates(date1, date2) {
    if (date1 > date2) {
      return true;
    } else {
      return false;
    }
  }

  checkdate(date) {
    const targetdate = new Date(date);
    const today = new Date();
    return this.compare_dates(new Date(today), new Date(targetdate));
  }
  checklenght(string) {
    const str = string.length;
    console.log(str, string);
    const arryStr = string.split(',');
    let retunstr = "";

    for (let i = 0; i < arryStr.length; i++) {
      if (str > 15) {
        retunstr += arryStr[i].substring(0, 14);
      } else {
        retunstr += arryStr[i];
      }
      retunstr += '<br>';
    }

    return retunstr;
  }
  formatstring(string) {

    const str = string.length;
    console.log(str, string);
    const arryStr = string.split(',');
    let retunstr = "";

    for (let i = 0; i < arryStr.length; i++) {
      if (str > 15) {
        retunstr += arryStr[i];
      }
    
    }

    return retunstr;
  }

  getsevendays(date) {
    const targetdate = new Date(date);
    const today = new Date();
    return this.getlesssevendays(new Date(today), new Date(targetdate));
  }

  exportExcel() {
    if (this.tableData.length < 1) {
      this.validationModal.showMessage(
        'No records found to download',
        'warning'
      );
      return;
    }
    const finalarr1 = [];
    for (let i = 0; i < this.tableData.length; i++) {
      const y = [];
      const onj = {
        Domain: this.tableData[i].domain,
        Product: this.tableData[i].product,
        Signal: this.tableData[i].AE,
        'Signal Code': this.tableData[i].code,
        'IsManual?': this.tableData[i].is_custom,
        Status: this.tableData[i].status,
        'Assigned To': this.tableData[i].assigned,
        Priority: this.tableData[i].priority,
        'Reported Date': this.tableData[i].reported_date,
        'Validation Date': this.tableData[i].validation_date,

        'Target Date': this.tableData[i].targetDate,
      };
      finalarr1.push(onj);
    }
    this.httpService
      .downloaddetails(window.location.href, 'Signal Tracking', 'Excel')
      .subscribe((data: any) => {
        const x = JSON.stringify(data.data);
        const keys = [];
        const res = [];
        const obj = JSON.parse(x);
        // tslint:disable-next-line: forin
        for (const i in data.data) { res.push(obj[i]); }
        // tslint:disable-next-line: forin
        for (const k in data.data) { keys.push(k); }
        const finalarr = [];
        for (let i = 0; i < keys.length; i++) {
          const onj = {
            Info: keys[i], // data.data[i],
            Details: res[i],
          };
          finalarr.push(onj);
        }
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(finalarr);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'User Details');
        const ws1 = XLSX.utils.json_to_sheet(finalarr1);
        XLSX.utils.book_append_sheet(wb, ws1, 'Data');
        XLSX.writeFile(wb, 'Signal Tracking.xlsx');
      });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import('file-saver').then((FileSaver) => {
      const EXCEL_TYPE =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE,
      });
      FileSaver.saveAs(
        data,
        fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
      );
    });
  }

  showDialogToAdd() {
    // this.newCar = true;
    this.nerecordsdata = {};
    this.displayDialog = true;
  }

  /**Method to get current date */
  getDateDetails(item: any) {
    return moment.utc().format('DD-MMM-YYYY');
  }

  formatDate(date) {
    let month = date.getMonth();
    let day = date.getDate();

    if (month < 10) {
      month = month;
    }
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec',
    ];
    if (day < 10) {
      day = '0' + day;
    }
    return day + '-' + monthNames[month] + '-' + date.getFullYear();
  }

  loadTrackingLazy(event: LazyLoadEvent) {
    const filtercols = [];
    // tslint:disable-next-line: forin
    for (const k in event.filters) {
      filtercols.push(k);
      if (k === 'code') {
        const getlength = event.filters.code.value;
        if (getlength.length < 9) {
          return;
        } else {
          this.signalcode = event.filters.code.value;
        }
      }
      if (k === 'domain') {
        this.trackingdoamin = event.filters.domain.value;
      }
      if (k === 'product') {
        const mapData = event.filters.product.value.value.map((item) => {
          return item.name;
        });
        this.finalproducts = this.converter.convert(mapData.join('\''));
      }

      if (k === 'assigned_to') {
        const mapData = event.filters.assigned_to.value.value.map((item) => {
          return item.id;
        });
        this.assigneduser = mapData.join('\'');
        this.assigneduser = this.assigneduser.replace(/\s/g, '');
      }
      if (k === 'events') {
        this.trackingevent = this.converter.convert(
          event.filters.events.value.name
        );
      }
      if (k === 'status') {
        this.trackingstatus = event.filters.status.value;
      }
      if (k === 'priority') {
        this.trackingpriority = event.filters.priority.value;
      }
      if (k === 'reported_date') {
        if (this.reported_date_flag) {
          this.reported_date_From = this.formatDate(
            event.filters.reported_date.value
          );
          this.reported_date_flag = false;
          return;
        } else {
          this.reported_date_To = this.formatDate(
            event.filters.reported_date.value
          );
          this.reported_date_flag = true;
        }
      }
      if (k === 'validation_date') {
        if (this.validation_date_flag) {
          this.validation_date_From = this.formatDate(
            event.filters.validation_date.value
          );
          this.validation_date_flag = false;
          return;
        } else {
          this.validation_date_To = this.formatDate(
            event.filters.validation_date.value
          );
          this.validation_date_flag = true;
        }
      }
      if (k === 'targetDate') {
        if (this.targetDate_flag) {
          this.targetDate_From = this.formatDate(
            event.filters.targetDate.value
          );
          this.targetDate_flag = false;
          return;
        } else {
          this.targetDate_To = this.formatDate(event.filters.targetDate.value);
          this.targetDate_flag = true;
        }
      }
    }

    if (!filtercols.includes('events')) {
      this.trackingevent = 'All';
    }
    if (!filtercols.includes('code')) {
      this.signalcode = 'All';
    }
    if (!filtercols.includes('reported_date')) {
      this.reported_date_From = 'NA';
      this.reported_date_To = 'NA';
      this.reported_date_flag = true;
    }
    if (!filtercols.includes('validation_date')) {
      this.validation_date_From = 'NA';
      this.validation_date_To = 'NA';
      this.reported_date_flag = true;
    }
    if (!filtercols.includes('targetDate')) {
      this.targetDate_From = 'NA';
      this.targetDate_To = 'NA';
      this.reported_date_flag = true;
    }

    this.ngxLoader.start();
    this.loading = true;

    setTimeout(() => {
      // tslint:disable-next-line: max-line-length
      this.httpService
        .GetSignalTrackingDataWithAllFilter(
          this.trackingdoamin !== 'undefined' && this.trackingdoamin
            ? this.trackingdoamin
            : 'All',
          'All',
          this.finalproducts !== 'undefined' && this.finalproducts
            ? this.finalproducts
            : 'All',
          this.trackingevent !== 'undefined' && this.trackingevent
            ? this.trackingevent
            : 'All',
          this.trackingstatus !== 'undefined' && this.trackingstatus
            ? this.trackingstatus
            : 'All',
          this.signalcode !== 'undefined' && this.signalcode
            ? this.signalcode
            : 'All',
          this.trackingstatus !== 'undefined' && this.trackingstatus
            ? this.trackingstatus
            : 'All',
          this.reported_date_From !== 'undefined' && this.reported_date_From
            ? this.reported_date_From
            : 'NA',
          this.reported_date_To !== 'undefined' && this.reported_date_To
            ? this.reported_date_To
            : 'NA',
          this.validation_date_From !== 'undefined' && this.validation_date_From
            ? this.validation_date_From
            : 'NA',
          this.validation_date_To !== 'undefined' && this.validation_date_To
            ? this.validation_date_To
            : 'NA',
          this.targetDate_From !== 'undefined' && this.targetDate_From
            ? this.targetDate_From
            : 'NA',
          this.targetDate_To !== 'undefined' && this.targetDate_To
            ? this.targetDate_To
            : 'NA',
          this.trackingpriority !== 'undefined' && this.trackingpriority
            ? this.trackingpriority
            : 'All',
          this.assigneduser !== 'undefined' && this.assigneduser
            ? this.assigneduser
            : 'All',
          'both',
          event.first + 1,
          event.first + event.rows
        )
        .subscribe(
          (data: any) => {
            this.trackingtableData = data.Signals;
            this.totalRecords = data.records_count;
            this.ngxLoader.stop();
            this.loading = false;
          },
          // this.httpService.GetValidSignals().subscribe( (data: any) => {
          //   this.rows = data.Signals;
          //   this.ngxLoader.stop();
          // },
          (error) => {
            this.ngxLoader.stop();
            this.validationModal.showMessage(
              'cust table tracking load issue' + error,
              'error'
            );
            // if (error === 'Unauthorized') {
            //   this.authService.clearData();
            //   this.router.navigate(['/']);
            // }
          }
        );
    }, 600);
  }

  exportCSV(dt: any) {
    if (dt._totalRecords < 1) {
      this.validationModal.showMessage('No Record found to export', 'warning');
      return false;
    }
    // tslint:disable-next-line: prefer-const
    let finalarrdata = [];
    const filterval = dt.filteredValue != null ? dt.filteredValue : dt._value;
    for (let i = 0; i < filterval.length; i++) {
      let y = [];
      if (filterval[i].assigned_to.length > 0) {
        y = filterval[i].assigned_to.map((item) => item.itemName);
      }
      const onj = {
        Domain: filterval[i].domain,
        Product: filterval[i].product,
        Signal: filterval[i].AE,
        'Signal Code': filterval[i].code,
        Status: filterval[i].status,
        'Assigned To': y.length > 0 ? y.join(',') : 'UnAssigned',
        Priority: filterval[i].priority,
        'Reported Date': filterval[i].reported_date,
        'Validation Date': filterval[i].validation_date,

        'Target Date': filterval[i].targetDate,
      };
      finalarrdata.push(onj);
    }
    this.httpService
      .downloaddetails(window.location.href, 'Signal Tracking', 'CSV')
      .subscribe((data: any) => {
        const x = JSON.stringify(data.data);
        const keys = [];
        const res = [];
        const obj = JSON.parse(x);
        // tslint:disable-next-line: forin
        for (const i in data.data) { res.push(obj[i]); }
        // tslint:disable-next-line: forin
        for (const k in data.data) { keys.push(k); }
        const finalarr = [];
        for (let i = 0; i < keys.length; i++) {
          const onj = {
            Info: keys[i], // data.data[i],
            Details: res[i],
          };
          finalarr.push(onj);
        }
        import('xlsx').then((xlsx) => {
          const worksheet = XLSX.utils.json_to_sheet(finalarr, {
            skipHeader: false,
          });
          XLSX.utils.sheet_add_json(worksheet, finalarrdata, {
            skipHeader: false,
            origin: 'A11',
          });
          const workbook = {
            Sheets: { data: worksheet },
            SheetNames: ['data'],
          };
          XLSX.utils.book_append_sheet(workbook, worksheet, 'test');
          XLSX.writeFile(workbook, 'Signal Tracking.csv');
        });
      });
  }

  downloadUnhandledInExcel() {
    const finalarr = [];

    for (let i = 0; i < this.tableData.length; i++) {
      const y = [];
      const values = this.tableData[i].result.ChiSquare;
      const fVal = values ? values : '';
      const onj = {
        'Signal ID': this.tableData[i].signal_id,
        Name: this.tableData[i].name,
        Product: this.tableData[i].product,
        Method: this.tableData[i].method,
        Domain: this.tableData[i].domain,
        'Statistical Value': this.tableData[i].result.PRR + ', ' + fVal,
        'Case Count': this.tableData[i].caseCount,
        'Current Review Period': this.tableData[i].current_review_period,
        'Short Comment': this.tableData[i].short_comment,
      };

      finalarr.push(onj);
    }
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(finalarr);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'SignalDetected_Unhandled');
    });
  }

  downloadQueryInExcel() {
    const finalarr = [];

    for (let i = 0; i < this.tableData.length; i++) {
      const y = [];
      const values = this.tableData[i].result.ChiSquare;
      const fVal = values ? values : '';
      const onj = {
        'Signal ID': this.tableData[i].signal_id,
        Name: this.tableData[i].name,
        Product: this.tableData[i].product,
        Method: this.tableData[i].method,
        Domain: this.tableData[i].domain,
        'Statistical Value': this.tableData[i].result.PRR + ', ' + fVal,
        'Case Count': this.tableData[i].caseCount,
        'Short Comment': this.tableData[i].short_comment,
      };

      finalarr.push(onj);
    }
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(finalarr);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'SignalDetected_Query');
    });
  }

  ngOnDestroy() {
    // this.httpService.nextChange(false);
    this.subs.unsubscribe();
  }
}
