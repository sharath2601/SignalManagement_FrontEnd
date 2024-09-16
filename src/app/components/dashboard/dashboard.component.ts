import { GenericLocalStorage } from './../../helpers/generic-local-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomSignalsComponent } from './../custom-signals/custom-signals.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomModalComponent } from './../custom-modal/custom-modal.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HttpService } from './../../services/http.service';
import { Component, OnInit, ViewEncapsulation, Input, AfterContentChecked, ChangeDetectorRef } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as moment from 'moment';
import { faPencilAlt, faSave, faBan, faDownload } from '@fortawesome/free-solid-svg-icons';
import { FormGroup } from '@angular/forms';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MatRadioChange } from '@angular/material';
import Swal from 'sweetalert2';
import htmlToImage from 'html-to-image';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Converter } from 'src/app/helpers/converter';
import { LazyLoadEvent } from 'primeng/api/lazyloadevent';
import * as XLSX from 'xlsx';


import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { ValidationModal } from 'src/app/helpers/validation-modal';
import { GenericDomainProductFamily } from 'src/app/services/GenericDomainProductFamily';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit, AfterContentChecked {
  @Input() type: string;

  animations: boolean;
  showselectedQuarter: any = 'All';
  icsrList: any;
  icsrcols: { field: string; header: string; }[];
  icsrevent: any;
  loading: boolean;
  showcaseslist = false;
  totalRecords: any;
  donwloadContent: any;

  // view: number[];
  chartview: number[];
  singlevalidated: any[];
  productList: any[];
  quarter: any;
  domainname: string;
  seletedpt = 'All';
  multiselectedproduct = 'All';
  quarterselected :any;

  noOfProductbyEvent: any;
  placeholderPTName = 'Signalled PT Name';
  single3: any;
  displayProduct: boolean;
  productnameshow: any;
  productcols: { field: string; header: string; }[];
  eventcols: { field: string; header: string; }[];
  eventnameshow: any;
  displayEvents: boolean;
  faDownload = faDownload;
  aeRows = [];
  public editorOptions: any = {};
  public data: any;
  labelData: any;
  totalcases: any;
  ShowSelectedProd: any = ' All';
  chartData: any;
  pChartData: any;
  chartReady = false;
  pChartReady = false;
  icsrRows = [];
  isValidSignal = false;
  validationList = [];
  selectedValidItem = [];
  validationSettings = {};
  isItemClicked = false;
  ptRows = [];
  selectedPItem: any;
  dates = [];
  startDateItem = [];
  startDateSettings = {};
  endDateItem = [];
  endDateSettings = {};
  rowData: any;
  showAdminLayout = false;
  userRows = [];
  isEditable = {};
  faPencilAlt = faPencilAlt;
  faSave = faSave;
  faban = faBan;
  createUserForm: FormGroup;
  selectionList = [];
  selectionSettings = {};
  selectedAdminItem = [];
  selectedGroupItem = [];
  selectedActiveItem = [];
  selectedManagerItem = [];
  displaycase = false;
  submitted = false;
  selectedItem: any;
  detectedDate: any;
  detectedSignals: any;
  validatedSignals: any;
  refutedSignals: any;
  evaluationReports: any;
  sProduct: any;
  sEvent: any;
  productData: any = [];
  eventData: any = [];
  productEventData: any = [];
  isSubmitted: any;
  productTypes: any = [];
  selectedType: any;
  QList: any = [];
  MedDraList: any = [];
  selectedQ: any;
  selectedM: any;
  Status = 'Status';
  single: any = [];
  single1: any = [];
  single2: any = [];
  selectedProduct: any = [];
  detectedData: any = [];
  validatedData: any = [];
  evaluatedData: any = [];
  dChartTypes: any = [];
  selectedCT: any;
  selectedCT2: any;
  selectedCT3: any;
  scale = 0;
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Product Name';
  showYAxisLabel = true;
  yAxisLabel = 'Signal Count';
  legendTitle = 'Info';
  isDrugClicked: any;
  isCosClicked: any;
  isMdClicked: any;
  // view: any[] = [700, 400];
  timeline = true;
  xAxis = true;
  yAxis = true;
  legend = true;
  domainscount: any;
  // options
  // gradient: boolean = true;
  // showLegend: boolean = true;
  showLabels = true;
  isDoughnut = false;
  multi: { name: string; series: { name: string; value: number; }[]; }[];
  multi1: { name: string; series: { name: string; value: number; }[]; }[];
  singlegrade: { name: string; value: number; }[];
  singlegrade1: { name: string; value: number; }[];

  Q22020: any;
  anyotherQuater: boolean;
  multi2: { name: string; series: { name: string; value: number; }[]; }[];
  signals: any;
  selectedS: any;
  domains: any;
  selectDomainType: any;
  selectedPeriod: any;
  // tslint:disable-next-line: member-ordering
  chartTypes1: { id: number; name: string; }[];
  // tslint:disable-next-line: member-ordering
  bar: boolean;
  // tslint:disable-next-line: member-ordering
  Stacked: any;
  drugcount: any;
  cosmeticcount: any;
  devicecount: any;
  noOfPTbyproduct: any;
  productFamily: any;
  colorScheme = {
    domain: ['#00FF00', '#02e9f5', '#f77102', '#e3db0e']
  };
  originalValuesProducts: any;
  originalValuesQuarter: any;
  customcount: any;
  selectProductFamily: any;
  selectedfamily: boolean;
  icsrList1: any;

  constructor(private httpService: HttpService,
    private ngxLoader: NgxUiLoaderService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private converter: Converter,
    private validationModal: ValidationModal,
    private prodFamily: GenericDomainProductFamily,
    private cdr: ChangeDetectorRef,
    private localStorage: GenericLocalStorage,
    private authenticationService: AuthenticationService) {
    if (authenticationService.currentUserValue.roles.is_admin) {
      this.showAdminLayout = true;
    }


  }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
  }

  compareAccounts = (item, selected) => {
    if (selected.Year && item.Year) {
      return item.Year === selected.Year;
    }
    if (item.name && selected.name) {
      return item.name === selected.name;
    }
    return false;

  }

  public disableAnimations() {
    this.animations = true;
    setTimeout(() => {
      this.animations = false;
    }, 1000);
  }

  getProductTypes() {
    this.httpService.GetProductTypes().subscribe((types: any) => {
      const filteredTypes = types.products.filter((item) => {
        return item.count > 500;
      });
      this.productTypes = filteredTypes;
    },
      (error) => {
        /**to find issue */
        this.validationModal.showMessage('dashboard domain issue' + error, 'error');
      }
    );
  }

  getAvailable_Quarters() {
    this.httpService.GetAllQuarters().subscribe((quarter: any) => {
      this.quarter = quarter.data;

     // this.selectedPeriod = [{ name : "Current" }];
      //this.quarter.splice(0, 0, { name: 'All', Year: '' });
      // this.selectedQ=  quarter.data[0].value;
    },
      (error) => {
        /**to find issue */
        this.validationModal.showMessage('dashboard quarter ' + error, 'error');
      }
    );
  }

  onActivate(data): void {
  }

  onDeactivate(data): void {
  }

  makeActive(drug: any, cos: any, md: any) {
    this.isDrugClicked = drug;
    this.isCosClicked = cos;
    this.isMdClicked = md;

  }

  onSelectQuarter(selectedQurter: any) {
    if (selectedQurter.name === 'Q2 2020') {
      this.Q22020 = true;
      this.anyotherQuater = false;
    } else {
      this.Q22020 = false;
      this.anyotherQuater = true;
    }
  }

  getProducts(item: any, profamily) {
    this.httpService.GetProductsByEvent(item, profamily, localStorage.getItem('dsEventvalue')==null?'All':localStorage.getItem('dsEventvalue')).subscribe((eventsproduct: any) => {
      this.productList = eventsproduct.data;
    });
  }

  onSelect(event, route, page, grade) {
    if (this.selectProductFamily.name === 'Individual Product' || this.selectProductFamily === 'Individual Product') {
      this.selectedfamily = false;
    } else {
      this.selectedfamily = true;
    }
    if (event.label === 'prr+Chi^2') {
      event.label = 'prr+chisquare';
    }
    if (event.label === 'freq') {
      event.label = 'frequency';
    }

    this.selectDomainType = this.selectDomainType.name ? this.selectDomainType.name : this.selectDomainType;

    if (event.value === 0) {
      this.validationModal.showMessage('No signals available', 'info');
      return;
    }
    let sp: any;
    if (page === 'detect') {
      if (this.selectedProduct === undefined || this.selectedProduct === '' || this.selectedProduct === null) {
        this.selectedProduct = 'All';
      }

      if (this.selectedPeriod === undefined || this.selectedPeriod === '') {
        this.selectedPeriod = 'All';
      }

      sp = {
        dashboard: 'Yes',
        type: this.selectDomainType,
        isProdFamSel: this.selectedfamily,
        quarter: this.quarterselected ? this.quarterselected : 'All',
        event: this.seletedpt ? this.seletedpt : 'All',
        method: event.label.toUpperCase(),
        pName: this.multiselectedproduct ? this.multiselectedproduct : 'All',
        count: event.value,
        orgProducts: this.selectedProduct,
        orgQuarters: this.selectedPeriod,
        page
      };

      this.httpService.setParameters(sp);
    } else if (page === 'validate') {
      sp = {
        dashboard: 'Yes',
        type: this.selectDomainType,
        prodfamily: this.selectedfamily,
        quarter: this.quarterselected ? this.quarterselected : 'All',
        pName: this.multiselectedproduct ? this.multiselectedproduct : 'All',
        event: this.seletedpt ? this.seletedpt : 'All',
        statusValue: event.label.toUpperCase(),
        page
      };
      this.httpService.setValidateParameters(sp);
    } else if (page === 'evaluate') {
      sp = {
        dashboard: 'Yes',
        type: this.selectDomainType,
        prodfamily: this.selectedfamily,

        quarter: this.quarterselected ? this.quarterselected : 'All',
        pName: this.multiselectedproduct ? this.multiselectedproduct : 'All',
        event: this.seletedpt ? this.seletedpt : 'All',
        statusValue: event.label.toUpperCase(),
        page
      };
      this.httpService.setEvaluateParameters(sp);
    } else if (page === 'detectstatus') {
      if (this.selectedProduct === undefined || this.selectedProduct === ''|| this.selectedProduct === null) {
        this.selectedProduct = 'All';
      }

      if (this.selectedPeriod === undefined || this.selectedPeriod === '') {
        this.selectedPeriod = 'All';
      }
      sp = {
        dashboard: 'Yes',
        type: this.selectDomainType,
        isProdFamSel: this.selectedfamily,
        quarter: this.quarterselected ? this.quarterselected : 'All',
        event: this.seletedpt ? this.seletedpt : 'All',
        method: event.label.toUpperCase(),
        pName: this.multiselectedproduct ? this.multiselectedproduct : 'All',
        orgProducts: this.selectedProduct,
        orgQuarters: this.selectedPeriod,
        count: event.value,
        sType: 'None Methods',
        page
      };
      this.httpService.setParameters(sp);
    }

    // tslint:disable-next-line: max-line-length
    this.router.navigateByUrl(route);
  }

  showproducts() {
    this.displayProduct = true;
  }

  showevents() {
    this.displayEvents = true;
  }
  exportCSV(dt: any) {
    if (dt.filteredValue != undefined &&dt.filteredValue.length < 1) {
      this.validationModal.showMessage('No Record found to export', 'info');
      return false;
    }

    const finalarrdata = [];
    const filterval = dt.filteredValue != null ? dt.filteredValue : dt._value;
    for (let i = 0; i < filterval.length; i++) {
      const onj = {
        'Product Name' : filterval[i].product_name,
      };
      finalarrdata.push(onj);
    }
    this.httpService.downloaddetails(window.location.href, 'Dashboard Product', 'CSV').subscribe((data: any) => {
      const x = JSON.stringify(data.data);
      const keys = [];
      const res = [];
      const obj = JSON.parse(x);
      // tslint:disable-next-line: forin
      for (const i in data.data) {
        res.push(obj[i]);
      }
      // tslint:disable-next-line: forin
      for (const k in data.data) {
        keys.push(k);
      }
      const finalarr = [];
      for (let i = 0; i < keys.length; i++) {
        const onj = {
          'Info': keys[i], // data.data[i],
          'Details': res[i]
        };
        finalarr.push(onj);
      }
      import('xlsx').then(xlsx => {
        const worksheet = XLSX.utils.json_to_sheet(finalarr, { skipHeader: false });
        XLSX.utils.sheet_add_json(worksheet, finalarrdata, { skipHeader: false, origin: 'A11' });
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        XLSX.utils.book_append_sheet(workbook, worksheet, 'test')
        XLSX.writeFile(workbook, 'Dashboard Product.csv')
      });
    });
  }
  exportExcel() {
    const finalarr1 = [];
    for (let i = 0; i < this.productnameshow.length; i++) {
     const y = [];
      // if (dt._value[i].assigned_to.length > 0) {
      //  y = dt._value[i].assigned_to.map(item => item.itemName);
      // }
      const onj = {
        'Product Name' : this.productnameshow[i].product_name,
      };
      finalarr1.push(onj);
     }
     this.httpService.downloaddetails(window.location.href, 'Product', 'Excel').subscribe((data: any) => {
      const x = JSON.stringify(data.data);
      const keys = [];
      const res = [];
      const obj = JSON.parse(x);
      for (const i in data.data) {
        res.push(obj[i]);
      }
      for (const k in data.data) {
        keys.push(k);
      }
      const finalarr = [];
      for (let i = 0; i < keys.length; i++) {
        const onj = {
          'Info': keys[i], // data.data[i],
          'Details': res[i]
        };
        finalarr.push(onj);
      }
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(finalarr);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'User Details');
      const ws1 = XLSX.utils.json_to_sheet(finalarr1);
      XLSX.utils.book_append_sheet(wb, ws1, 'Data');
      XLSX.writeFile(wb, 'Product.xlsx');
    });
  }
  exportCSV1(dt: any) {
    if (dt.filteredValue != undefined &&dt.filteredValue.length < 1) {
      this.validationModal.showMessage('No Record found to export', 'info');
      return false;
    }
    const finalarrdata = [];
    const filterval = dt.filteredValue != null ? dt.filteredValue : dt._value;
    for (let i = 0; i < filterval.length; i++) {
      const onj = {
        'Event Name' : filterval[i].event_name,
        'Frequency of Event Reported' : filterval[i].case_count,
      };

      finalarrdata.push(onj);
    }
    this.httpService.downloaddetails(window.location.href, 'Dashboard Event', 'CSV').subscribe((data: any) => {
      const x = JSON.stringify(data.data);
      const keys = [];
      const res = [];
      const obj = JSON.parse(x);
      for (const i in data.data) {
        res.push(obj[i]);
      }
      for (const k in data.data) {
        keys.push(k);
      }
      const finalarr = [];
      for (let i = 0; i < keys.length; i++) {
        const onj = {
          'Info': keys[i], // data.data[i],
          'Details': res[i]
        };
        finalarr.push(onj);
      }
      import('xlsx').then(xlsx => {
        const worksheet = XLSX.utils.json_to_sheet(finalarr, { skipHeader: false });
        XLSX.utils.sheet_add_json(worksheet, finalarrdata, { skipHeader: false, origin: 'A11' });
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        XLSX.utils.book_append_sheet(workbook, worksheet, 'test')
        XLSX.writeFile(workbook, 'Dashboard Event.csv')
      });
    });
  }
  exportExcelevent() {
    const finalarr1 = [];

    for (let i = 0; i < this.eventnameshow.length; i++) {
      const y = [];
      // if (dt._value[i].assigned_to.length > 0) {
      //  y = dt._value[i].assigned_to.map(item => item.itemName);
      // }
      const onj = {
        'Event Name' : this.eventnameshow[i].event_name,
        'Frequency of Event Reported' : this.eventnameshow[i].case_count,
      };

      finalarr1.push(onj);
     }
     this.httpService.downloaddetails(window.location.href, 'Dashboard Events', 'Excel').subscribe((data: any) => {
      const x = JSON.stringify(data.data);
      const keys = [];
      const res = [];
      const obj = JSON.parse(x);
      for (const i in data.data) {
        res.push(obj[i]);
      }
      for (const k in data.data) {
        keys.push(k);
      }
      const finalarr = [];
      for (let i = 0; i < keys.length; i++) {
        const onj = {
          'Info': keys[i], // data.data[i],
          'Details': res[i]
        };
        finalarr.push(onj);
      }
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(finalarr);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'User Details');
      const ws1 = XLSX.utils.json_to_sheet(finalarr1);
      XLSX.utils.book_append_sheet(wb, ws1, 'Data');
      XLSX.writeFile(wb, 'Events.xlsx');
    });
  }
  exportCSVcases(dt: any) {
    if (dt.filteredValue != undefined &&dt.filteredValue.length < 1) {
      this.validationModal.showMessage('No Record found to export', 'info');
      return false;
    }
    const finalarrdata = [];
    const filterval = dt.filteredValue != null ? dt.filteredValue : dt._value;
    for (let i = 0; i < filterval.length; i++) {
      const onj = {
        'AER Number' : filterval[i].aer_number,
        'Commnet' : filterval[i].comment,
      };

      finalarrdata.push(onj);
    }
    this.httpService.downloaddetails(window.location.href, 'Dashboard Event cases', 'CSV').subscribe((data: any) => {
      const x = JSON.stringify(data.data);
      const keys = [];
      const res = [];
      const obj = JSON.parse(x);
      for (const i in data.data) {
        res.push(obj[i]);
      }
      for (const k in data.data) {
        keys.push(k);
      }
      const finalarr = [];
      for (let i = 0; i < keys.length; i++) {
        const onj = {
          'Info': keys[i], // data.data[i],
          'Details': res[i]
        };
        finalarr.push(onj);
      }
      import('xlsx').then(xlsx => {
        const worksheet = XLSX.utils.json_to_sheet(finalarr, { skipHeader: false });
        XLSX.utils.sheet_add_json(worksheet, finalarrdata, { skipHeader: false, origin: 'A11' });
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        XLSX.utils.book_append_sheet(workbook, worksheet, 'test')
        XLSX.writeFile(workbook, 'Dashboard Event Cases.csv')
      });
    });
  }
  exportExcelCases() {
    const finalarr1 = [];
    this.httpService.GetIcsrList(this.domainname, this.selectedfamily, this.multiselectedproduct, this.icsrevent, this.quarterselected,  1,
      this.totalRecords).subscribe((list: any) => {
     this.icsrList1 = list.cases;
     for (let i = 0; i < this.icsrList1.length; i++) {
      const y = [];
      // if (dt._value[i].assigned_to.length > 0) {
      //  y = dt._value[i].assigned_to.map(item => item.itemName);
      // }
      const onj = {
        'AER Number' : this.icsrList1[i].aer_number,
        'Commnet' : this.icsrList1[i].comment,
      };
      finalarr1.push(onj);
     }
     this.httpService.downloaddetails(window.location.href, 'Dashboard Events Cases', 'Excel').subscribe((data: any) => {
      const x = JSON.stringify(data.data);
      const keys = [];
      const res = [];
      const obj = JSON.parse(x);
      for (const i in data.data) {
        res.push(obj[i]);
      }
      for (const k in data.data) {
        keys.push(k);
      }
      const finalarr = [];
      for (let i = 0; i < keys.length; i++) {
        const onj = {
          'Info': keys[i], // data.data[i],
          'Details': res[i]
        };
        finalarr.push(onj);
      }
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(finalarr);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'User Details');
      const ws1 = XLSX.utils.json_to_sheet(finalarr1);
      XLSX.utils.book_append_sheet(wb, ws1, 'Data');
      XLSX.writeFile(wb, 'Dashboard Events Cases.xlsx');
    });

   },
        (error) => {
          this.ngxLoader.stop();
          this.validationModal.showMessage('dashboard export issue ' + error, 'error');
        }
   );

  }

  saveAsExcelFile(buffer: any, fileName: string): void {
      import('file-saver').then(FileSaver => {
          const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
          const EXCEL_EXTENSION = '.xlsx';
          const data: Blob = new Blob([buffer], {
              type: EXCEL_TYPE
          });
          FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
      });
  }

  onChnagedropdown(ngmodelvalue: any, selectedvaluefromdropdown: any) {

    if (this.selectDomainType.name === undefined || localStorage.getItem('dsdomainname')==null) {
      this.domainname = localStorage.getItem('dsdomainname')==null ?'Drug' : localStorage.getItem('dsdomainname')
    } else {
      this.domainname = this.selectDomainType.name;
    }
    if(ngmodelvalue=='All')
    {
      this.domainname = localStorage.getItem('dsdomainname')==null ?'Drug' : localStorage.getItem('dsdomainname');

      if(this.localStorage.getItemRObjects('dsProductdropdown')!=null)
      {
      this.selectedProduct= JSON.parse(this.localStorage.getItemRObjects('dsProductdropdown'));
      }
      if(this.selectedProduct!=null && this.selectedProduct.length>0)
      {
        const mapData = this.selectedProduct.map((item) => {
          return item.name;
        });


        this.ShowSelectedProd = mapData.join(', ');
      }
      this.showselectedQuarter=localStorage.getItem('dsQuartervalue');
      let getval =JSON.parse(this.localStorage.getItemRObjects('dsQuarterdropdown'));
     // this.selectedPeriod= JSON.parse(this.localStorage.getItemRObjects('dsQuarterdropdown')) == null ? JSON.parse(this.localStorage.getItemRObjects('dsQuarterdropdown')) :  [{ name : "Current" }] ;
      this.selectedPeriod= getval != null ? JSON.parse(this.localStorage.getItemRObjects('dsQuarterdropdown')) :  [{ name : "Current" }] ;

//      this.quarterselected=localStorage.getItem('dsQuartervalue')==null? "All" :localStorage.getItem('dsQuartervalue');
      this.quarterselected=localStorage.getItem('dsQuartervalue')==null? "Current" :localStorage.getItem('dsQuartervalue');

      this.localStorage.saveItem('dsQuartervalue',localStorage.getItem('dsQuartervalue')==null? "Current" :localStorage.getItem('dsQuartervalue'));
        this.localStorage.saveObject('dsQuarterdropdown', getval != null ? JSON.parse(this.localStorage.getItemRObjects('dsQuarterdropdown')) :  [{ name : "Current" }] );
    }
    if (this.selectProductFamily.name === 'Individual Product' || this.selectProductFamily === 'Individual Product') {
      this.selectedfamily = false;
    } else {
      this.selectedfamily = true;
    }
    if (selectedvaluefromdropdown === 'domain') {
      this.selectedProduct = [];
      this.placeholderPTName = 'Signalled PT name';
      this.selectedS = '';
     // this.selectedPeriod = '';
     let getval =JSON.parse(this.localStorage.getItemRObjects('dsQuarterdropdown'));
      this.selectedPeriod= [{ name : "Current" }] ;

      this.localStorage.saveItem('dsdomainname', this.domainname);
      this.getProducts(this.domainname, this.selectedfamily);
      this.gethierData(this.selectedfamily);
      this.quarterselected = 'Current';
      this.multiselectedproduct = 'All';
      this.seletedpt = 'All';

      this.localStorage.deleteItem('dsEventvalue');
      this.localStorage.deleteItem('dsEventdropdown');
      this.localStorage.deleteItem('dsProductvalue');
      this.localStorage.deleteItem('dsProductdropdown');
      //this.localStorage.deleteItem('dsQuarterdropdown');
      //this.localStorage.deleteItem('dsQuartervalue');
      this.localStorage.saveItem('dsQuartervalue',this.quarterselected);
      this.localStorage.saveObject('dsQuarterdropdown', [{ name : "Current" }]);
    }
    if (selectedvaluefromdropdown === 'ProductFamily') {

      this.localStorage.saveItem('dsproductfamily',this.selectProductFamily.name);
      this.selectedProduct = [];
      this.placeholderPTName = 'Signalled PT name';
      this.selectedS = '';
      //this.selectedPeriod = '';
     // let getval =JSON.parse(this.localStorage.getItemRObjects('dsQuarterdropdown'));
      //this.selectedPeriod= getval != null ? JSON.parse(this.localStorage.getItemRObjects('dsQuarterdropdown')) :  [{ name : "Current" }] ;
      this.selectedPeriod= [{ name : "Current" }] ;

      this.quarterselected = 'Current';
      this.multiselectedproduct = 'All';
      this.seletedpt = 'All';
      // this.localStorage.saveItem('product-family', this.selectProductFamily.name);
      this.httpService.GetEventsByProduct(this.domainname, this.selectedfamily,
         this.multiselectedproduct).subscribe((productsevents: any) => {
        // this.single = types.data;;
        this.signals = productsevents.data;
        this.noOfPTbyproduct = productsevents.data.length;
      });
      this.httpService.GetProductsByEvent(this.domainname, this.selectedfamily, this.seletedpt).subscribe((eventsproduct: any) => {
        // this.single = types.data;;
        this.productList = eventsproduct.data;
        if (this.selectedProduct.length < 1) {
          this.noOfProductbyEvent = eventsproduct.data.length;
        }

      });

      this.localStorage.deleteItem('dsEventvalue');
      this.localStorage.deleteItem('dsEventdropdown');
      this.localStorage.deleteItem('dsProductvalue');
      this.localStorage.deleteItem('dsProductdropdown');
      // this.localStorage.deleteItem('dsQuarterdropdown');
      // this.localStorage.deleteItem('dsQuartervalue');
      this.localStorage.saveItem('dsQuartervalue',this.quarterselected);
      this.localStorage.saveObject('dsQuarterdropdown', [{ name : "Current" }]);
    }
    if (selectedvaluefromdropdown === 'selectedPTdata' ) {
      if (ngmodelvalue == null) {
        this.seletedpt = 'All';
        if (this.selectedProduct.length >= 0) {
          this.noOfPTbyproduct = this.signals.length;
        }
        this.localStorage.deleteItem('dsEventvalue');
        this.localStorage.deleteItem('dsEventdropdown');


      } else {
        this.seletedpt = this.converter.convert(ngmodelvalue);
        this.noOfPTbyproduct = 1;
        this.localStorage.saveItem('dsEventvalue',this.seletedpt);
        this.localStorage.saveItem('dsEventdropdown',ngmodelvalue);

      }

      // this.localStorage.saveItem('selected-pt', this.seletedpt);
      this.httpService.GetProductsByEvent(this.domainname, this.selectedfamily, this.seletedpt).subscribe((eventsproduct: any) => {
        // this.single = types.data;;
        this.productList = eventsproduct.data;
        if (this.selectedProduct.length < 1) {
          this.noOfProductbyEvent = eventsproduct.data.length;
        }

      });
    }
    if (selectedvaluefromdropdown === 'product') {

      if (ngmodelvalue.length < 1) {
        this.multiselectedproduct = 'All';
        this.noOfProductbyEvent = this.productList.length;
        this.ShowSelectedProd = 'All';
        this.localStorage.deleteItem('dsProductvalue');
        this.localStorage.deleteItem('dsProductdropdown');
      } else {
        const mapData = ngmodelvalue.map((item) => {
          return item.name;
        });


        this.ShowSelectedProd = mapData.join(', ');
        // this.localStorage.saveItem('sp', JSON.stringify(this.selectedProduct));
        this.originalValuesProducts = this.multiselectedproduct;
        this.multiselectedproduct = this.converter.convert(mapData.join('\''));
        this.noOfProductbyEvent = ngmodelvalue.length;
        this.localStorage.saveItem('dsProductvalue',this.multiselectedproduct);
        this.localStorage.saveObject('dsProductdropdown',ngmodelvalue);
      }
      if (this.selectedS == null) {

        // this.localStorage.saveItem('selected-product',  this.multiselectedproduct);
        this.httpService.GetEventsByProduct(this.domainname,
          this.selectedfamily, this.multiselectedproduct).subscribe((productsevents: any) => {
          // this.single = types.data;;
          this.signals = productsevents.data;
          this.noOfPTbyproduct = productsevents.data.length;

        });
      }
    }
    if (selectedvaluefromdropdown === 'quarter') {
      // tslint:disable-next-line:prefer-const
     // [ { "Year": 2019 }, {"name": "Q3 2018" } ]
     let qtrsele=[]
      let getquarter, selectedquarter: any = [];
      for (let i = 0; i < ngmodelvalue.length; i++) {
        if (ngmodelvalue[i].name === undefined) {
          getquarter = this.quarter.filter(function (itmes) {
            return itmes.Year === ngmodelvalue[i].Year;
          });
          const a= {
            "Year" : ngmodelvalue[i].Year
          }
          qtrsele.push(a);
          for (let j = 0; j < getquarter.length; j++) {
            selectedquarter.push(getquarter[j]);
          }
        } else {
          selectedquarter.push(ngmodelvalue[i]);
          const b= {
            "name" : ngmodelvalue[i].name
          }
          qtrsele.push(b);

        }
      }

      if (ngmodelvalue.length < 1) {
        this.quarterselected = '';
        this.showselectedQuarter =  'All';
        this.localStorage.deleteItem('dsQuartervalue');
        this.localStorage.deleteItem('dsQuarterdropdown');
      } else {

        const mapData = selectedquarter.map((item) => {
          return item.name;
        });
        // this.localStorage.saveItem('sq', JSON.stringify(this.selectedPeriod));

        this.originalValuesQuarter = this.quarterselected;
        this.quarterselected = this.converter.convert(mapData.join('\''));
        this.showselectedQuarter = mapData.join(', ');

        this.localStorage.saveItem('dsQuartervalue',this.quarterselected);
        this.localStorage.saveObject('dsQuarterdropdown',qtrsele);
      }

    }

    // this.localStorage.saveItem('selected-quarter', this.quarterselected);
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:max-line-length
    this.httpService.GetSignalDetected(this.domainname , this.selectedfamily, this.quarterselected ? this.quarterselected : 'All', this.multiselectedproduct ? this.multiselectedproduct : 'All', this.seletedpt ? this.seletedpt : 'All').subscribe((types: any) => {
      // this.single = types.data;

      let temp = JSON.stringify(types.data);
      temp = temp.replace('prr+chisquare', 'prr+Chi^2');
      temp = temp.replace('frequency', 'freq');
      this.single = JSON.parse(temp);

    });
    // tslint:disable-next-line:max-line-length
    this.httpService.GetSignalStatus(this.domainname, this.selectedfamily, this.quarterselected ? this.quarterselected : 'All', this.multiselectedproduct ? this.multiselectedproduct : 'All', this.seletedpt ? this.seletedpt : 'All').subscribe((types: any) => {
      this.single3 = types.data;
    });
    // tslint:disable-next-line: max-line-length
    this.httpService.GetSignalValidated(this.domainname, this.selectedfamily, this.quarterselected ? this.quarterselected : 'All', this.multiselectedproduct ? this.multiselectedproduct : 'All', this.seletedpt ? this.seletedpt : 'All').subscribe((types: any) => {
      this.single1 = types.data;
      this.customcount = types.custom_count;
    });
    // tslint:disable-next-line:max-line-length
    this.httpService.GetSignalEval(this.domainname, this.selectedfamily, this.quarterselected ? this.quarterselected : 'All', this.multiselectedproduct ? this.multiselectedproduct : 'All', this.seletedpt ? this.seletedpt : 'All').subscribe((types: any) => {
      this.single2 = types.data;
    });

    // tslint:disable-next-line:max-line-length
    this.httpService.GetTotalCasesCount(this.domainname, this.selectedfamily, this.quarterselected ? this.quarterselected : 'All', this.multiselectedproduct ? this.multiselectedproduct : 'All', this.seletedpt ? this.seletedpt : 'All').subscribe((types: any) => {
      this.totalcases = types.data.case_count;
    });
    // tslint:disable-next-line:max-line-length
    this.httpService.GetProductCount(this.domainname, this.selectedfamily, this.quarterselected ? this.quarterselected : 'All', this.multiselectedproduct ? this.multiselectedproduct : 'All', this.seletedpt ? this.seletedpt : 'All').subscribe((types: any) => {
       this.productnameshow = types.data;
      this.noOfProductbyEvent = types.data.length;

    });
    // tslint:disable-next-line: max-line-length
    this.httpService.GetEventCount(this.domainname, this.selectedfamily, this.quarterselected ? this.quarterselected : 'All', this.multiselectedproduct ? this.multiselectedproduct : 'All', this.seletedpt ? this.seletedpt : 'All').subscribe((types: any) => {
      this.eventnameshow = types.data;
      this.noOfPTbyproduct = types.data.length;
    });
  }

  loadAERcommentsLazy(event: LazyLoadEvent) {

    this.loading = true;
    // const pa = this.setParameter(this.selectedParameter) ? this.setParameter(this.selectedParameter) : 'gender';
    // const pr = this.selectedPE;// ? p.name : p;

    if (this.selectDomainType.name === undefined) {
      this.domainname = 'Drug';
    } else {
      this.domainname = this.selectDomainType.name;
    }
    this.httpService.GetIcsrList(this.domainname, this.selectedfamily, this.multiselectedproduct,
      this.icsrevent, this.quarterselected,  event.first + 1,
       event.first + event.rows).subscribe((list: any) => {
      this.icsrList = list.cases;
      this.showcaseslist = true;
      this.totalRecords = list.total_count;
      this.loading = false;
      this.ngxLoader.stop();

    },
         (error) => {
           this.ngxLoader.stop();
           /**to find issue */
           this.validationModal.showMessage('dashboard load issue ' + error, 'error');
         }
    );

  }

  downloadAllCases() {
    if (this.selectProductFamily.name === 'Individual Product' || this.selectProductFamily === 'Individual Product') {
      this.selectedfamily = false;
    } else {
      this.selectedfamily = true;
    }
    this.validationModal.showMessage('It will take some time to download', 'warning');
    if (this.selectDomainType.name === undefined) {
      this.domainname = 'Drug';
    } else {
      this.domainname = this.selectDomainType.name;
    }
    this.httpService.DownloadCaseCount(this.domainname, this.selectedfamily, this.quarterselected, this.multiselectedproduct, this.icsrevent, 'Signal Analytics Download All Cases', window.location.href).subscribe(data => {
      const blob = new Blob([data], {
        type: 'application/zip'
      });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  // this.httpService.
  // DownloadCases(this.domainname, this.selectedfamily, this.quarterselected, this.multiselectedproduct, this.icsrevent).
  // subscribe((data: any) => {
  //   this.donwloadContent = data.data;
  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.donwloadContent.cases);
  //   // /* generate workbook and add the worksheet */
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   //  const wb1: XLSX.WorkBook = XLSX.utils.book_append_sheet;
  //   XLSX.utils.book_append_sheet(wb, ws, 'Cases');

  //   const ws1 = XLSX.utils.json_to_sheet(this.donwloadContent.product_events);

  //   /* Add the worksheet to the workbook */
  //   XLSX.utils.book_append_sheet(wb, ws1, 'Details');

  //   // /* save to file */
  //   XLSX.writeFile(wb, 'CaseDownload.xlsx');
  // },
  //   (error) => {
  //     this.validationModal.showMessage(error, 'error');
  //   }
  // );

}
  openRelatedIcsrList(item: any) {

    if (this.multiselectedproduct === 'All' || this.multiselectedproduct == null) {
      this.validationModal.showMessage('Please select atleast one product to see cases.', 'warning');
      return;
    }
    this.showcaseslist = false;
    this.ngxLoader.start();
    this.icsrevent = item.event_name;
    this.displaycase = true;
    setTimeout(() => this.showcaseslist = true, 0);
  }

  ngOnInit() {
    this.ngxLoader.start();
    this.productFamily = this.prodFamily.selectProductFamilyType();
    this.selectProductFamily =localStorage.getItem('dsproductfamily')==null ?this.productFamily[0]: localStorage.getItem('dsproductfamily') ;
    this.isSubmitted = false;
    this.bar = true;
    this.isDrugClicked = true;
    this.isCosClicked = false;
    this.isMdClicked = false;
    this.Q22020 = true;
    this.getProductTypes();
    this.getAvailable_Quarters();
    this.selectDomainType = localStorage.getItem('dsdomainname') == null ? 'Drug' : localStorage.getItem('dsdomainname');
    this.selectedQ = 'Current';
    if (this.selectProductFamily.name === 'Individual Product' || this.selectProductFamily === 'Individual Product') {
      this.selectedfamily = false;
    } else {
      this.selectedfamily = true;
    }
    this.selectedS = localStorage.getItem('dsEventdropdown');
    this.seletedpt = localStorage.getItem('dsEventvalue');
    this.multiselectedproduct = localStorage.getItem('dsProductvalue');
    this.gethierData(this.selectedfamily);
    this.getProducts(localStorage.getItem('dsdomainname') == null ? 'Drug' : localStorage.getItem('dsdomainname'), this.selectedfamily);
    this.onChnagedropdown('All', 'All');
    this.MedDraList = [
      { 'id': 1, 'name': 'SOC' },
      { 'id': 2, 'name': 'HLGT' },
      { 'id': 3, 'name': 'HLT' },
      { 'id': 4, 'name': 'PT' },
    ];
    this.productcols = [
      { field: 'product_name', header: 'Product Name' },
    ];
    this.eventcols = [
      { field: 'event_name', header: 'Event Name' },
      { field: 'case_count', header: 'Frequency of Event Reported' },
    ];
    this.icsrcols = [
      { field: 'aer_number', header: 'AER No' },
      { field: 'comment.comment', header: 'Comment' },
    ];
    this.selectedM = this.MedDraList[3];
    this.ngxLoader.stop();
    this.httpService.GetProductCountByDomain().subscribe((domaintypes: any) => {
      this.domainscount = domaintypes.data;
      for (let i = 0; i < this.domainscount.length; i++) {
        for (const k in this.domainscount[i]) {
          if (k === 'Drug') {
            this.drugcount = this.domainscount[i]['Drug'];
          } else if (k === 'Cosmetic') {
            this.cosmeticcount = this.domainscount[i]['Cosmetic'];
          } else if (k === 'Medical Device') {
            this.devicecount = this.domainscount[i]['Medical Device'];
          }
        }

      }

    });
  }

  gethierData(selectfamily: any) {
    // const h = selectedM.name ? selectedM.name : 'PT';
    let var2;
    // if (this.selectDomainType.name === undefined) {
    //   var2 = 'Drug';
    // } else {
    //   var2 = this.selectDomainType.name;
    // }
    if (this.selectDomainType.name === undefined || localStorage.getItem('dsdomainname')==null) {
      var2 = localStorage.getItem('dsdomainname')==null ?'Drug' : localStorage.getItem('dsdomainname')
    } else {
      var2 = this.selectDomainType.name;
    }
    const var1 = this.multiselectedproduct ? this.multiselectedproduct : 'All';
    this.httpService.GetEventsByProduct(var2, selectfamily, var1).subscribe((data: any) => {
      this.signals = data.data;
      this.noOfPTbyproduct = this.signals.length;
    });
    // onChnagedropdown()
  }

  /**
   * Method is show related info on clicked signals data
   */
  openRelatedInfo(num: any, path: any) {
    if (path === '') {
      this.validationModal.showMessage('Yet to implement Refuted Signals Page', 'warning');
      return;
    }
    this.router.navigateByUrl(path);
    return;
  }

  download() {

    htmlToImage.toPng(document.getElementById('maindashboard'), { quality: 0.95 })
      .then(function (dataUrl) {
        const link = document.createElement('a');
        link.download = 'Main Dashboard.png';
        link.href = dataUrl;
        link.click();
      });
  //     htmlToImage.toJpeg(document.getElementById('maindashboard'), { quality: 0.95 })
  // .then(function (dataUrl) {
  //   var link = document.createElement('a');
  //   link.download = 'my-image-name.jpeg';
  //   link.href = dataUrl;
  //   link.click();
  // });
  }

  changeCharts1(type: any) {
    this.Stacked = true;
    this.bar = false;
  }

  renameObj(arr) {
    return arr.map(function (obj) {
      obj['name'] = obj['product'];
      obj['value'] = obj['pt_count'];
      delete obj['product'];
      delete obj['pt_count'];
      return obj;
    });
  }

  close(dt) {
    dt.reset();
  }

  formatxAxis(val) {
    if (val % 1 === 0) {
      return val.toLocaleString();
    } else {
      return '';
    }
  }

  percentageFormatting(c) {
    return  c.toFixed(2);
 }


}
