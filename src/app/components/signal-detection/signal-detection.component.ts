import { GenericLocalStorage } from './../../helpers/generic-local-storage';
import { GenericDomainProductFamily } from './../../services/GenericDomainProductFamily';
import { ValidationModal } from './../../helpers/validation-modal';
import { Encoder } from './../../services/encoder';
import { HttpService } from './../../services/http.service';
import { Component, OnInit, OnDestroy, DoCheck } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { faSquare, faDownload } from '@fortawesome/free-solid-svg-icons';
import { Converter } from 'src/app/helpers/converter';
import { take, first } from 'rxjs/operators';
import { TableUpdation } from 'src/app/models/table-updation';
import { CustomModalComponent } from '../custom-modal/custom-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { Pagination } from 'src/app/helpers/pagination';

@Component({
  selector: 'app-signal-detection',
  templateUrl: './signal-detection.component.html',
  styleUrls: ['./signal-detection.component.css']
})
export class SignalDetectionComponent implements OnInit, OnDestroy, DoCheck {
  /*variables declaration starts */
  faDownload = faDownload;
  selectedSearch: string;
  // searchBy: any[] = [
  //   { 'id': 0, 'name': 'Preferred Product Description(PPD)', 'selectedItem': true },
  //   { 'id': 1, 'name': 'Local Trade Name', 'selectedItem': false },
  //   { 'id': 2, 'name': 'Formula ID', 'selectedItem': false }
  // ];
  hierachialSelection = [];
  productList = [];
  selectedProductItem: any;
  AEList = [];
  qAEList = [];
  methodsList = [];
  changedMethodsList = [];
  selectedMethodItem: any;
  selectedHierarchialItem: any;
  selectedAEItem: any;
  rows = [];
  ColumnMode;
  isClicked = false;
  icsrRows = [];
  selectedValidItem = [];
  validationSettings = {};
  IndividualIcsrComment: string;
  isChanged = true;
  isValidSignal = false;
  enteredComment;
  selectedSignalId;
  isProdMethSelected = true;
  faSquare = faSquare;
  selectedSingleIcsrIndex;
  selectedItem: any;
  detectedDate: any;
  showMethodColumn: any;
  unhandledSignals: any = [];
  getUnhandledSignals = true;
  getIsPt: any;
  selectedHierarchy: any = '';
  selectedName: any;
  hasData = false;
  domains: any = [];
  qDomains: any = [];
  qProductList: any = [];
  qMethodsList: any = [];
  qHierachialSelection: any = [];
  selectDomainType: any;
  selectProdFamType: any;
  isphCh: any;
  isMCh: any;
  isPChanged: any;
  isTypeChange: any;
  parameters: any;
  gridview: boolean;
  tableCols: any = [];
  unhandledRows = [];
  qList: any;
  selectedQ: any;
  sdt: any;
  spf: any;
  sp: any;
  spr: any;
  ss: any;
  sm: any;
  startCount: any;
  endCount: any;
  nextC1: any;
  nextc2: any;
  prevC1: any;
  prevC2: any;
  signalsCount: any = '';
  fromDashboard: any;
  totalCount: any;
  icsrCommentUpdated: any;
  nextPrevClick: boolean;
  currentPage: any;
  queryPageProductLoader: boolean;
  queryPageMethodsLoader: boolean;
  queryPageEventsLoader: boolean;
  reachedEnd: boolean;
  indiPrFamilyList: any;
  isProdFamSel: any;
  isQProdFamSel: any;
  qIndiPrFamilyList: any;
  isCommentUpdatedInCasesList: any;
  cols: any;
  queryPrrCols: any;
  queryPrrChiCols: any;
  queryFCols: any;
  queryDCols: any;
  isManagementOrNot: boolean;
  managementMethod: any;
  valList: any;
  selectedValItem: any;
  retainedQ: any;
  multiselectedproduct: any;
  quarterselected: any;
  seletedpt: any;
  detectedsingcols: { field: string; header: string; }[];
  Querydetectedsingcols: { field: string; header: string; }[];

  // local storage variables
  selectedT = ''; selectedFamT = ''; selectedP = ''; selectedEv = ''; selectedRp = ''; selectedM = ''; selected = '';
  /**variables declaration ends */

  // groupValueFn = (_: string, children: any[]) => ();

  constructor(private httpService: HttpService,
    private ngxLoader: NgxUiLoaderService,
    private converter: Converter,
    private encodeValue: Encoder,
    private validationModal: ValidationModal,
    private pF: GenericDomainProductFamily,
    private update: TableUpdation,
    private modalService: NgbModal,
    private localStorage: GenericLocalStorage,
    private pagination: Pagination
   // private csvService: CsvService
  ) { }

  ngOnInit() {
    this.isQProdFamSel = 'False';
    this.startCount = 1;
    this.endCount = 50;
    this.nextC1 = this.startCount;
    this.nextc2 = this.endCount;
    this.prevC1 = 0;
    this.currentPage = 1;
    this.selectDomainType = 'Drug';
    this.selectProdFamType = 'Individual Product';
    this.getQuartersList();

    this.getQProductTypes();
    this.getQStatisticalMethods();
    this.getStatisticalMethods();
    this.getHierarchy();
    this.getQHierarchy();
    this.valList = this.pF.getValidationList();
    this.reachedEnd = false;
    this.getUnhandledSignals = !this.getUnhandledSignals;
    this.indiPrFamilyList = this.pF.selectProductFamilyType();
    this.qIndiPrFamilyList = this.pF.selectProductFamilyType();

    // setTimeout(() => {
    //   this.getLocalStorageValues();
    // }, 1000);


    setTimeout(() => {
      if (this.getUnhandledSignals === false) {
        this.httpService.currentObj.pipe(take(1)).subscribe((params) => {
          this.parameters = params;
          if (this.parameters.dashboard === 'Yes') {
            this.getFilteredSignals(this.parameters);
          } else {
            let dom, pf, pr, rp, ev, pv, qv;
            if (localStorage.length > 0) {
               dom = this.localStorage.getItemRObjects('dsdomainname');
               pf = this.localStorage.getItemRObjects('dsproductfamily');
               pr = JSON.parse(this.localStorage.getItemRObjects('dsProductdropdown'));
               rp = JSON.parse(this.localStorage.getItemRObjects('dsQuarterdropdown'));
               ev = this.localStorage.getItemRObjects('dsEventdropdown');
               pv = this.localStorage.getItemRObjects('dsProductvalue');
               qv = this.localStorage.getItemRObjects('dsQuartervalue');
              //  method = this.localStorage.getItemRObjects('selected-method');
              //  valItem = JSON.parse(this.localStorage.getItemRObjects('selected-valid-item'));
              }
            this.sdt = dom === undefined || dom === null || dom.length < 1 ? 'Drug' : dom;
            this.spf = pf === undefined || pf === null || pf.length < 1 ? 'Individual Product' : pf;
            this.sp = pr === undefined || pr === null || pr.length < 1 ? '' : pr;
            this.spr = rp === undefined || rp === null || rp.length < 1 ?  '' : rp;
            // this.sm = method === undefined || method === null || method.length < 1 || method === 'null' ? '' : method;
            this.ss = ev === undefined || ev === null || ev.length < 1 || ev === 'null' ? '' : ev;
            // this.selectedValItem = valItem === undefined || valItem === null || valItem.length < 1 ? '' : valItem[0].id;
            this.isProdFamSel = this.spf === 'Product Family' ? 'True' : 'False';
            this.getProductTypes();
            this.isProdFamSel = this.spf === 'Individual Product' ? 'False' : 'True';
            this.changeEvents('All');
            // const item = this.selectedValItem.id;
            this.isManagementOrNot = false;
            this.filterUnhandledSignals(this.sdt, this.sp,
             this.spr, this.ss, 'All', this.startCount, this.endCount, this.isManagementOrNot, false);
          }
        });
      } else if (this.getUnhandledSignals === true) {
        this.queryPageProductLoader = false;
        this.queryPageMethodsLoader = false;
        this.queryPageEventsLoader = false;
        this.makeQuery();
      }
    }, 1000);
    this.detectedsingcols = [
      { field: 'product', header: 'Product Name' },
      { field: 'name', header: 'Event Name' },
      { field: 'method', header: 'Detection Method' },
      { field: 'result', header: 'Statistical Value' },
      { field: 'caseCount', header: 'Case Count' },
      { field: 'current_review_period', header: 'RPC Count' },
      { field: 'previous_short_comment', header: 'Short Comment' },
    ];
    this.Querydetectedsingcols = [
      { field: 'product', header: 'Product Name' },
      { field: 'name', header: 'Event Name' },
      { field: 'method', header: 'Detection Method' },
      { field: 'result', header: 'Statistical Value' },
      { field: 'caseCount', header: 'Case Count' },
      { field: 'current_review_period', header: 'RPC Count' },
      { field: 'previous_short_comment', header: 'Short Comment' },
    ];
  }

  ngDoCheck() {
    this.httpService.change.pipe(first()).subscribe(c => this.isCommentUpdatedInCasesList = c);
    if (this.isCommentUpdatedInCasesList) {
      this.validationModal.showMessage('Please wait while updating table', 'info');
      this.filterUnhandledSignals(this.sdt, this.sp, this.spr,
        this.ss, this.selectedValItem, this.startCount, this.endCount, this.isManagementOrNot, true);
    }
    this.httpService.nextChange(false);
  }

  /**To get the localstorage values/ variables */
  // getLocalStorageValues() {
  //   this.selectedT =
  //   this.selectedT = this.localStorage.getItemRObjects('dsdomainname');
  //   this.selectedFamT = this.localStorage.getItemRObjects('dsproductfamily');
  //   pr = JSON.parse(this.localStorage.getItemRObjects('dsProductdropdown'));
  //   rp = JSON.parse(this.localStorage.getItemRObjects('dsQuarterdropdown'));
  //   ev = this.localStorage.getItemRObjects('dsEventdropdown');
  //   pv = this.localStorage.getItemRObjects('dsProductvalue');
  //   qv = this.localStorage.getItemRObjects('dsQuartervalue');
  // }

  /**Method on every call navigation click on arrow buttons */
  changeSets(c1: any, c2: any, whichSet: string) {
    this.httpService.nextChange(false);
    switch (whichSet) {
      case 'next':
        if (this.reachedEnd) {
          return;
        }
        this.nextC1 = this.nextC1 + 50;
        this.nextc2 = this.nextc2 + 50;
        this.prevC1 = this.nextC1;
        this.prevC2 = this.nextc2;

        this.startCount = this.nextC1;
        this.endCount = this.nextc2;

        if (this.sp === undefined) {
          this.sp = 'All';
        }
        if (this.spr === undefined) {
          this.spr = 'All';
        }
        if (this.ss === undefined) {
          this.ss = 'All';
        }
        this.nextPrevClick = true;
        this.currentPage = this.currentPage + 1;
        this.filterUnhandledSignals(this.sdt, this.sp, this.spr, this.ss,
           this.selectedValItem, this.nextC1, this.nextc2, this.isManagementOrNot, false);
        break;
      case 'prev':
        if (this.nextC1 === 1) {
          return;
        }
        this.prevC1 = this.prevC1 - 50;
        this.prevC2 = this.prevC2 - 50;
        this.nextC1 = this.prevC1;
        this.nextc2 = this.prevC2;

        this.startCount = this.prevC1;
        this.endCount = this.prevC2;
        this.nextPrevClick = false;
        this.currentPage = this.currentPage - 1;
        this.reachedEnd = false;
        this.filterUnhandledSignals(this.sdt, this.sp, this.spr, this.ss,
           this.selectedValItem, this.prevC1, this.prevC2, this.isManagementOrNot, false);
        break;
    }
  }

  /**Method to get the quarters list */
  getQuartersList() {
    this.httpService.GetAllQuarters().subscribe((data: any) => {
      this.qList = data.data;
    },
      (error) => {
      }
    );
  }

  /**Method to show the filter signals, when page navigated from dashboard */
  getFilteredSignals(params: any) {
    const obj = params;
    this.signalsCount = obj.count;

    const cEvent = this.converter.convert(obj.event);
    const cPr = this.encodeValue.encodeStr(obj.pName);
    const localQVal = localStorage.getItem('dsQuartervalue');
    const cQu = localQVal !== null ? localQVal : 'All';
    const cProd = this.converter.convert(cPr);
    this.totalCount = obj.count;

    this.sdt = obj.type;

    this.spf = obj.isProdFamSel ? 'Product Family' : 'Individual Product';
    this.isProdFamSel = obj.isProdFamSel;

    this.getProductTypes();

    // this.getProducts(this.sdt, this.isProdFamSel);

    const localQuarterValue = JSON.parse(localStorage.getItem('dsQuarterdropdown'));
    this.spr = localQuarterValue !== null ? localQuarterValue : '';

    // if (obj.orgQuarters !== 'All' && obj.orgQuarters !== null && obj.orgQuarters !== undefined) {
    //   const q = obj.orgQuarters;
    //   const qite = this.converter.renameObjProp(q);
    //   this.spr = qite;
    // }

    if (obj.method !== 'All' && obj.method !== null) {
      this.sm = obj.method;
    }

    if (obj.orgProducts !== 'All' && obj.orgProducts !== null) {
      const ite = this.converter.renameObjProp(obj.orgProducts);
      this.sp = ite;
      this.changeEvents(this.sp);
    } else {
      this.changeEvents('All');
    }

    if (obj.event !== 'All') {
      this.ss = obj.event;
      this.changeProducts(this.ss);
    } else {
      this.changeProducts(obj.event);
    }

    this.ngxLoader.start();

    if (obj.sType) {
      this.isManagementOrNot = true;
      this.sm = '';
      this.managementMethod = obj.method;
      this.httpService.GetFilteredTypeUnhandledSignals(obj.type, obj.isProdFamSel, cQu, obj.pName, obj.event, obj.method,
        this.startCount, this.endCount).subscribe((data: any) => {
          this.unhandledRows = data.Signals;
          this.totalCount = data.records_count;
          const getEndPage = this.pagination.getEndPage(this.totalCount, 50);
          const remItems = this.pagination.getRemainingItems(this.totalCount, 50);
          if (this.currentPage === getEndPage) {
            if (this.pagination.remainingItemsExist(this.totalCount, 50)) {
              this.endCount = (this.endCount - 50) + remItems;
            }
            this.reachedEnd = true;
          } else {
            this.reachedEnd = false;
          }
          // this.getPaginationValues(this.totalCount, this.unhandledRows.length, this.startCount, this.endCount);
          this.ngxLoader.stop();
        },
          (error) => {
            this.ngxLoader.stop();
            /**to find issue */
            this.validationModal.showMessage('detection filter issue 1' + error, 'error');
          });
    } else {
      this.isManagementOrNot = false;
      this.httpService.GetFilteredUnhandledSignals(obj.type, obj.isProdFamSel,
        cQu, cProd, cEvent, obj.method, 'All', this.startCount, this.endCount)
        .subscribe((data: any) => {
          this.unhandledRows = data.Signals;
          this.totalCount = data.records_count;
          const getEndPage = this.pagination.getEndPage(this.totalCount, 50);
          const remItems = this.pagination.getRemainingItems(this.totalCount, 50);
          if (this.currentPage === getEndPage) {
            if (this.pagination.remainingItemsExist(this.totalCount, 50)) {
              this.endCount = (this.endCount - 50) + remItems;
            }
            this.reachedEnd = true;
          } else {
            this.reachedEnd = false;
          }
          // this.getPaginationValues(this.totalCount, this.unhandledRows.length, this.startCount, this.endCount);
          this.ngxLoader.stop();
        },
          (error) => {
            this.ngxLoader.stop();
            /**to find issue */
            this.validationModal.showMessage('detection filter issue 2' + error, 'error');
          });

    }

  }

  /**Method to get the Product Types in unhandled signals pages*/
  getProductTypes() {
    this.httpService.GetProductTypes().subscribe((types: any) => {
      const filteredTypes = types.products.filter((item) => {
        return item.count > 500;
      });
      this.domains = filteredTypes;
      const selDomain = this.sdt ? this.sdt : 'Drug';
      this.getProducts(selDomain, this.isProdFamSel);
    },
      (error) => {
        /**to find issue */
        this.validationModal.showMessage('detection domain issue un' + error, 'error');
      }
    );
  }

  /**Method to get the product types in query page */
  getQProductTypes() {
    this.httpService.GetProductTypes().subscribe((types: any) => {
      const filteredTypes = types.products.filter((item) => {
        return item.count > 500;
      });
      this.qDomains = filteredTypes;
      this.getQProducts('Drug', this.isQProdFamSel);
    },
      (error) => {
        /**to find issue */
        this.validationModal.showMessage('detection domain issue q ' + error, 'error');
      }
    );
  }

  getQProducts(item: any, prodFamSel: any) {
    this.queryPageProductLoader = true;
    this.httpService.GetAvailableProducts(item, prodFamSel).subscribe((data: any) => {
      this.qProductList = data.products;
      this.queryPageProductLoader = false;
    },
      (error) => {
        /**to find issue */
        this.validationModal.showMessage('detection product issue q ' + error, 'error');
      }
    );
  }

  /**Method on signalling method change */
  onMethodChange(selItem: string) {
    this.rows = [];
    this.httpService.onMethodChange(selItem);
  }

  /*Method to show available products */
  getProducts(item: any, prodFamSel: any) {
    this.httpService.GetAvailableProducts(item, prodFamSel)
    .pipe(take(1))
    .subscribe((data: any) => {
      this.productList = data.products;
    },
      (error) => {
        /**to find issue */
        this.validationModal.showMessage('detection prodcut issue un ' + error, 'error');
      }
    );
  }

  /*Method to show statistical listings */
  getStatisticalMethods() {
    this.httpService.GetStatisticalMethods().subscribe((data: any) => {
      this.methodsList = data.methods;
      this.methodsList.forEach(element => {
        element.itemName.toUpperCase();
      });
      this.changedMethodsList = this.methodsList;
    },
      (error) => {
        /**to find issue */
        this.validationModal.showMessage('detection stat issue un ' + error, 'error');
      }
    );
  }

  getQStatisticalMethods() {
    this.queryPageMethodsLoader = true;
    this.httpService.GetStatisticalMethods().subscribe((data: any) => {
      this.qMethodsList = data.methods;
      this.qMethodsList.forEach(element => {
        element.itemName.toUpperCase();
      });

      this.changedMethodsList = this.qMethodsList;
      this.queryPageMethodsLoader = false;

    },
      (error) => {
        /**to find issue */
        this.validationModal.showMessage('detection stat issue q ' + error, 'error');
      }
    );
  }

  /*Method to show hierarchy list */
  getHierarchy() {
    this.hierachialSelection = [
      { 'id': 1, 'itemName': 'SOC' },
      { 'id': 2, 'itemName': 'HLGT' },
      { 'id': 3, 'itemName': 'HLT' },
      { 'id': 4, 'itemName': 'PT' },
    ];
  }

  getQHierarchy() {
    this.qHierachialSelection = [
      { 'id': 1, 'itemName': 'SOC' },
      { 'id': 2, 'itemName': 'HLGT' },
      { 'id': 3, 'itemName': 'HLT' },
      { 'id': 4, 'itemName': 'PT' },
    ];
  }

   /**Method to open icsr listings related to particular signal */
   openRelatedIcsrList(item: any, currentOrNot: any, index: any, whichPage: any, rpc: any) {
    let isprodSel: any;
     if (whichPage === 'QueryPage') {
       isprodSel = this.selectProdFamType === 'Individual Product' ? false : true;
     } else {
       isprodSel = this.spf === 'Individual Product' ? false : true;
     }
    if (currentOrNot === 'No' && item.caseCount === 0) {
      this.validationModal.showMessage('Cases does not exist', 'warning');
      return;
    }

    if (currentOrNot === 'Yes' && item.current_review_period === 0) {
      this.validationModal.showMessage('Cases does not exist', 'warning');
      return;
    }

    if (item.signal_id !== -1) {
      this.isValidSignal = true;
    }

    if (item.level !== 'PT') {
      this.validationModal.showMessage('Cases can only be drilled down for Preferred Term of MedDRA Hierarchy.', 'info');
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
    this.update.current_review_period = currentOrNot === 'Yes' ? rpc.count : '';
    this.update.statSigComment = item.statSigComment;
    this.update.signal_id = item.signal_id;
    this.update.result = item.result ? item.result : {};
    this.update.level = item.level;
    this.update.prodFamily = isprodSel;
    this.update.page = whichPage;
    const modalRef = this.modalService.open(CustomModalComponent, { size: 'xl' });
    modalRef.componentInstance.showIcsrModal = true;
    modalRef.componentInstance.selectedProduct = item.product;
    modalRef.componentInstance.label = name;
    modalRef.componentInstance.type = this.selectDomainType;
    modalRef.componentInstance.whichPage = whichPage;
    modalRef.componentInstance.selSigItem = item;
    modalRef.componentInstance.CurrentQOrNot = currentOrNot;
    modalRef.componentInstance.selectedRPCQuarter = rpc.Quarter;
    modalRef.componentInstance.Productfamily = isprodSel;

  }

  /**Method upon selection of product type in query page*/
  onTypeSelect(item: any, prodFamSel: any) {
    this.rows = [];
    this.selectedProductItem = '';
    this.selectedAEItem = '';
    const sel = item;
    this.isQProdFamSel = 'True' ? prodFamSel === 'Product Family' : 'False';
    this.getQProducts(sel, this.isQProdFamSel);
  }

  /* Mehtod on hierarchy, product selection in query page*/
  onItemSelect() {
    this.rows = [];
    this.qAEList = [];
    this.isProdMethSelected = this.selectedProductItem ? true : false;
    this.selectedAEItem = '';
    // this.ngxLoader.start();

    if (!this.isProdMethSelected) {
      return;
    }

    if (this.selectedHierarchialItem === undefined || this.selectedHierarchialItem === null) {
      return;
    }
    const selectedItem: string = this.converter.convert(this.selectedProductItem);

    this.queryPageEventsLoader = true;

    if (selectedItem.length > 0 && this.selectedHierarchialItem.length > 0) {
      this.httpService.GetAEs(this.selectDomainType, this.isQProdFamSel,
         selectedItem, this.selectedHierarchialItem.toLowerCase()).subscribe((data: any) => {
        this.qAEList = data.PTs;
        this.queryPageEventsLoader = false;
      },
        (error) => {
          this.ngxLoader.stop();
          /**to find issue */
          this.validationModal.showMessage('detection ae issue q ' + error, 'error');
        }
      );

    }
    // tslint:disable-next-line: max-line-length
  }

  /*Method to display signals on basis of combination of product, statistical method, hierarchy selection and AE */
  submitReport() {

    if ((this.selectedMethodItem === undefined)
      && (this.selectedProductItem === undefined)
      && (this.selectedHierarchialItem === undefined)) {
      this.validationModal.showMessage('No Data to display, Please select Product, Method and MedDRA Hierarchy', 'warning');
      return;
    }

    if (this.selectedMethodItem === undefined) {
      this.validationModal.showMessage('No Data to display, Please select Method', 'warning');
      return;
    }

    if (this.selectedProductItem === undefined) {
      this.validationModal.showMessage('No Data to display, Please select Product', 'warning');
      return;
    }

    if (this.selectedHierarchialItem === undefined) {
      this.validationModal.showMessage('No Data to display, Please select Hierarchy', 'warning');
      return;
    }

    const sHIt = this.selectedHierarchialItem;

      if ((this.selectedAEItem === undefined || this.selectedAEItem === null || this.selectedAEItem === '')) {
        this.validationModal.showMessage('No Data to display, Please select Event', 'warning');
        return;
      }


    this.ngxLoader.start();

      this.isClicked = true;

      const selType = this.selectDomainType;
      const selMet = this.selectedMethodItem;
      const selProd = this.converter.convert(this.selectedProductItem);
      const selAe = this.selectedAEItem ? this.converter.convert(this.selectedAEItem) : this.converter.convert('NA');
      const selHierarchy = this.selectedHierarchialItem;

      this.httpService
        .GetSignalDetectionReports(selType, this.isQProdFamSel, selMet, selProd, selHierarchy.toLowerCase(), selAe)
        .pipe(take(1))
        .subscribe((data: any) => {
          if (data.comment === 'No data exists') {
            this.validationModal.showMessage(data.comment, 'info');
            this.ngxLoader.stop();
            return;
          }
          this.ngxLoader.stop();
          const filteredList = data.signal_results.filter(value => {
            if (value.comment) {
              return !value.comment;
            } else {
              return data.signal_results;
            }
          });
          this.rows = filteredList;
          if (this.rows.length < 0) {
            this.validationModal.showMessage('No data available for selected Event', 'warning');
          }
        },
          (error) => {
            this.ngxLoader.stop();
            if (error === 'Invalid MedDRA name or product details') {
              this.validationModal.showMessage('Invalid MedDRA name or product details', 'warning');
            } else {
              /**to find issue */
              this.validationModal.showMessage('detection submission issue q' + error, 'error');
            }
          });

  }

  /**Common function to show the query page */
  showQueryDetails() {
    this.checkUnhandledSignals(true, true, false);
    // this.rows = [];
  }

  /*Method to check if there were any unhandled signals */
  checkUnhandledSignals(show: any, makeCall: any, fromDashboard: boolean) {
    this.getUnhandledSignals = show;
    // this.httpService.nextChange(true);
    // if (makeCall) {
    //   this.makeQuery();
    // }
    // if (fromDashboard) {
    //   this.getFilteredSignals();
    // }
  }

  /**Common function to show the query page */
  makeQuery() {
    this.getStatisticalMethods();
    this.getHierarchy();
    this.getProductTypes();
    this.selectDomainType = 'Drug';
  }

  /**Method to filter unhandled signals based on parameters passed */
  onChangeDropdown(item: any, whichOne: any) {
    this.unhandledRows = [];
    switch (whichOne) {
      case 'domain':
        this.sp = '';
        this.ss = '';
        this.localStorage.saveItem('dsdomainname', item);
        this.getProducts(item, this.isProdFamSel);
        this.changeEvents('All');
        this.localStorage.deleteItem('dsEventvalue');
        this.localStorage.deleteItem('dsEventdropdown');
        this.localStorage.deleteItem('dsProductvalue');
        this.localStorage.deleteItem('dsProductdropdown');
        // this.localStorage.deleteItem('dsQuarterdropdown');
        // this.localStorage.deleteItem('dsQuartervalue');
        break;
      case 'pFamily':
        this.sp = '';
        this.ss = '';
        this.isProdFamSel = 'True' ? item === 'Product Family' : 'False';
        this.localStorage.saveItem('dsproductfamily', item);
        this.getProducts(this.sdt, this.isProdFamSel);
        this.changeEvents('All');
        this.localStorage.deleteItem('dsEventvalue');
        this.localStorage.deleteItem('dsEventdropdown');
        this.localStorage.deleteItem('dsProductvalue');
        this.localStorage.deleteItem('dsProductdropdown');
        // this.localStorage.deleteItem('dsQuarterdropdown');
        // this.localStorage.deleteItem('dsQuartervalue');
        break;
      case 'product':
        if (item.length < 1) {
          this.localStorage.deleteItem('dsProductvalue');
          this.localStorage.deleteItem('dsProductdropdown');
          this.changeEvents('All');
        } else {
          const mapData = item.map((i) => {
            return i.name;
          });
          this.multiselectedproduct = this.converter.convert(mapData.join('\''));
          this.localStorage.saveItem('dsProductvalue', this.multiselectedproduct);
          this.localStorage.saveObject('dsProductdropdown', item);
          this.changeEvents(this.multiselectedproduct);
        }
        break;
      case 'quarter':
        // tslint:disable-next-line: prefer-const
        let qtrsele = [];
        // tslint:disable-next-line: prefer-const
        let getquarter, selectedquarter: any = [];
        for (let i = 0; i < item.length; i++) {
          if (item[i].name === undefined) {
            getquarter = this.qList.filter(function (itmes) {
              return itmes.Year === item[i].Year;
            });
            const a = {
              'Year': item[i].Year
            };
            qtrsele.push(a);
            for (let j = 0; j < getquarter.length; j++) {
              selectedquarter.push(getquarter[j]);
            }
          } else {
            selectedquarter.push(item[i]);
            const b = {
              'name': item[i].name
            };
            qtrsele.push(b);
          }
        }
        if (item.length < 1) {
          this.localStorage.deleteItem('dsQuartervalue');
          this.localStorage.deleteItem('dsQuarterdropdown');
        } else {
          const mapData = selectedquarter.map((it) => {
            return it.name;
          });
          this.quarterselected = this.converter.convert(mapData.join('\''));
          this.localStorage.saveItem('dsQuartervalue', this.quarterselected);
          this.localStorage.saveObject('dsQuarterdropdown', qtrsele);
        }
        break;
      case 'selectedPTdata':
          if (item == null) {
            this.localStorage.deleteItem('dsEventvalue');
            this.localStorage.deleteItem('dsEventdropdown');
            this.changeProducts('All');
          } else {
            this.seletedpt = this.converter.convert(item);
            this.localStorage.saveItem('dsEventvalue', this.seletedpt);
            this.localStorage.saveItem('dsEventdropdown', item);
            this.changeProducts(item);
          }
        break;
      case 'method':
        this.localStorage.saveItem('selected-method', item);
        break;
      case 'validation-item':
        const selItem = this.valList.filter(i => i.id === item);
        this.localStorage.saveItem('selected-valid-item', JSON.stringify(selItem));
        break;
    }
  }

  /**Method to change table data */
  filterUnhandledSignals(type: any, prod: any, quarter: any, event: any,
    shCcom: any, start: any, end: any, isManage: any, donotChange: any) {
    let filProd: any = [];
    if (prod !== null && prod !== undefined && prod.length >= 1) {
      filProd = prod.map((i) => {
        return i.name;
      });
    }
    const cProd = localStorage.getItem('dsProductvalue');
    let cQuarter;
    // let getquarter: any = [];
    const selectedquarter: any = [];
    cQuarter = localStorage.getItem('dsQuartervalue');
    // if (quarter !== 'All' && quarter !== undefined && quarter !== null) {
    //   for (let i = 0; i < quarter.length; i++) {
    //     if (quarter[i].name === undefined) {
    //       getquarter = this.qList.filter(function (itmes) {
    //         return itmes.Year === quarter[i].Year;
    //       });
    //       for (let j = 0; j < getquarter.length; j++) {
    //         selectedquarter.push(getquarter[j]);
    //       }
    //     } else {
    //       selectedquarter.push(quarter[i]);
    //     }
    //   }
    //   const mapData = selectedquarter.map((item) => {
    //     return item.name;
    //   });
    //   cQuarter = quarter ? this.encodeValue.encodeStr(mapData) : 'All';
    // } else {
    //   cQuarter = 'All';
    // }

    const qs: any = cQuarter;
    let prodConv: any;
    let cqs: any;
    const ps: any = cProd;
    let ev: any = event;
    let selMethod: any = this.sm;
    let selType: any = type;

    cqs = qs ? qs : 'All';
    prodConv = ps ? this.converter.convert(ps) : 'All';
    ev = event ? this.converter.convert(event) : 'All';
    selMethod = this.sm ? this.sm : 'All';
    selType = type;
    shCcom = shCcom === undefined || shCcom === null || shCcom.length < 1 ? 'All' : shCcom;
    // tslint:disable-next-line:max-line-length
    this.ngxLoader.start();

    if (isManage) {
      this.httpService.GetFilteredTypeUnhandledSignals(selType, this.isProdFamSel,
        cqs, prodConv, ev, this.managementMethod, start, end)
      .subscribe((data: any) => {
        data.Signals.forEach(element => {
          const isBlank = element.name === '' ? 'Blank' : element.name;
          element.name = isBlank;
        });
        this.unhandledRows = data.Signals;
        this.totalCount = data.records_count;
        if (this.unhandledRows.length < 1) {
          this.validationModal.showMessage('No records found', 'info');
        }

        if (this.endCount === this.totalCount) {
          this.ngxLoader.stop();
          return;
        } else {
          const getEndPage = this.pagination.getEndPage(this.totalCount, 50);
          const remItems = this.pagination.getRemainingItems(this.totalCount, 50);
          if (this.currentPage === getEndPage) {
            if (this.pagination.remainingItemsExist(this.totalCount, 50)) {
              this.endCount = (this.endCount - 50) + remItems;
            }
            this.reachedEnd = true;
          } else {
            this.reachedEnd = false;
          }
          // this.getPaginationValues(this.totalCount, this.unhandledRows.length, start, end);
        }


        this.ngxLoader.stop();
      },
        (error) => {
          this.ngxLoader.stop();
          /**to find issue */
          this.validationModal.showMessage('detection un issue 1' + error, 'error');
        }
      );
    } else {
      this.httpService.GetFilteredUnhandledSignals(selType, this.isProdFamSel,
        cqs, prodConv, ev, selMethod, shCcom, start, end)
        .subscribe((data: any) => {
       data.Signals.forEach(element => {
         const isBlank = element.name === '' ? 'Blank' : element.name;
         element.name = isBlank;
       });
       this.unhandledRows = data.Signals;
       this.totalCount = data.records_count;
       if (this.unhandledRows.length < 1) {
         this.validationModal.showMessage('No records found', 'info');
       }

       if (this.endCount === this.totalCount) {
        this.ngxLoader.stop();
        return;
       } else {
        const getEndPage = this.pagination.getEndPage(this.totalCount, 50);
        const remItems = this.pagination.getRemainingItems(this.totalCount, 50);
         if (this.currentPage === getEndPage) {
           if (this.pagination.remainingItemsExist(this.totalCount, 50)) {
             this.endCount = (this.endCount - 50) + remItems;
           }
           this.reachedEnd = true;
         } else {
           this.reachedEnd = false;
         }
        // this.getPaginationValues(this.totalCount, this.unhandledRows.length, start, end);
      }

       this.ngxLoader.stop();
     },
       (error) => {
         this.ngxLoader.stop();
         /**to find issue */
         this.validationModal.showMessage('detection un issue 2' + error, 'error');
       }
     );
    }
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

  /**Method to change events upon product selection in unhandled signals page  */
  changeEvents(item: any) {
    const strngfyItem = item.length >= 1 ? item : 'All';
    const s = this.encodeValue.encodeStr(strngfyItem);
    const selectedItem: any = this.converter.convert(s);
    this.httpService.GetEventsByProduct(this.sdt, this.isProdFamSel, selectedItem).subscribe((data: any) => {
      this.AEList = data.data;
    });
  }

  /**Method to change products on event-selection in unhandled signals page */
  changeProducts(item: any) {
    const ev = item === null || item === undefined || item.length < 1 ? 'All' : item;
    const s = this.encodeValue.encodeStr(ev);
    const p = this.converter.convert(s);
    this.httpService.GetProductsByEvent(this.sdt, this.isProdFamSel, p).subscribe((eventsproduct: any) => {
      this.productList = eventsproduct.data;
    });
  }

  ngOnDestroy() {
    this.httpService.setParameters({});
    // this.httpService.nextChange(false);
  }

  exportCSVquery(dt: any ) {
   if (dt._totalRecords < 1) {
     this.validationModal.showMessage('No Record found to export', 'info');
     return false;
   }
   const finalarrdata = [];

   for (let i = 0; i < dt._value.length; i++) {

    const y = [];
    const values = dt._value[i].result.ChiSquare;
    const fVal = values ? ' ,' + values : '';
    const onj = {
      'Name': dt._value[i].name,
      'Product' : dt._value[i].product,
      'Method' : dt._value[i].method,
      'Domain'  : dt._value[i].domain,
      'Statistical Value' : dt._value[i].result.PRR_Lower_Bound + ', ' +
      dt._value[i].result.PRR + ', ' + dt._value[i].result.PRR_Upper_Bound + fVal,
      'Case Count': dt._value[i].caseCount,
      'Short Comment': dt._value[i].short_comment
    };

    finalarrdata.push(onj);
   }
  //  console.log('Test=========', finalarrdata);
  // const filterval = dt.filteredValue != null ? dt.filteredValue : dt._value;
  //  for (let i = 0; i < filterval.length; i++) {
  //    const onj = {
  //      'Name': filterval[i].name,
  //      'Last Review Period': filterval[i].prev_review_period,
  //      'Periodicity in Quarters': filterval[i].periodicity_in_quarters,
  //      'Next Review Period': filterval[i].next_quarter,
  //    };

  //    finalarrdata.push(onj);
  //  }
   this.httpService.downloaddetails(window.location.href, 'Signal Detection', 'CSV').subscribe((data: any) => {
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
       XLSX.utils.book_append_sheet(workbook, worksheet, 'test');
       XLSX.writeFile(workbook, 'Detectionpage.csv');
     });
   });
  // import('xlsx').then(xlsx => {
  //               const worksheet = xlsx.utils.json_to_sheet(dt._value);
  //               const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  //               const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
  //               this.saveAsExcelFile(excelBuffer, 'Detectionpage');
  //           });
  }

  exportCSV(dt: any ) {
    // console.log(dt._value);
   // this.csvService.download(dt._value, 'Signaldetection');
   if (dt._totalRecords < 1) {
     this.validationModal.showMessage('No Record found to export', 'info');
     return false;
   }
   const finalarrdata = [];

    const fRpc = dt._value.map((i, index) => {
      return i.current_review_period;
    });

    const fC = fRpc.map((item, index) => {
      const fI = item.map((i) => {
        return i.count;
      });
      return fI;
    });

    dt._value.forEach((element, index) => {
      const values = element.result.ChiSquare;
      const prrV = element.result.PRR_Lower_Bound;
      const fPrrV = prrV ? prrV : '';
      const fVal = values ? ' ,' + values : '';

      const onj = {
        'Signal ID': element.signal_id,
        'Name': element.name,
        'Product': element.product,
        'Method': element.method,
        'Domain': element.domain,
        'Statistical Value': fPrrV + fVal,
        'Case Count': element.caseCount,
        'RPC Count': JSON.stringify(fC[index]),
        'Short Comment': element.short_comment,
        'Previous Short Comment': element.previous_short_comment
      };
      finalarrdata.push(onj);
    });

    // console.log('checking-value: ', dt._value);

    // for (let i = 0; i < dt._value.length; i++) {
    //   console.log('checking-index: ', i);
    //   const y = [];
    //   const values = dt._value[i].result.ChiSquare;
    //   const prrV = dt._value[i].result.PRR_Lower_Bound;
    //   const fPrrV = prrV ? prrV : '';
    //   const fVal = values ? ' ,' + values : '';
    //   const onj = {
    //     'Signal ID': dt._value[i].signal_id,
    //     'Name': dt._value[i].name,
    //     'Product': dt._value[i].product,
    //     'Method': dt._value[i].method,
    //     'Domain': dt._value[i].domain,
    //     'Statistical Value': fPrrV + fVal,
    //     'Case Count': dt._value[i].caseCount,
    //     'Current Review Period': this.concatRpc(dt._value[i].current_review_period),
    //     'Short Comment': dt._value[i].short_comment,
    //     'Previous Short Comment': dt._value[i].previous_short_comment
    //   };
    //   finalarrdata.push(onj);
    // }

   this.httpService.downloaddetails(window.location.href, 'Signal Detection', 'CSV').subscribe((data: any) => {
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
       XLSX.utils.book_append_sheet(workbook, worksheet, 'test');
       XLSX.writeFile(workbook, 'Detectionpage.csv');
     });
   });
  // import('xlsx').then(xlsx => {
  //               const worksheet = xlsx.utils.json_to_sheet(dt._value);
  //               const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  //               const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
  //               this.saveAsExcelFile(excelBuffer, 'Detectionpage');
  //           });
  }

  /**download the data in excel in unhandled signals page */
  downloadUnhandledInExcel() {
    const finalarr = [];
    let tData: any = [];
    let cQuarter: any;
    const selectedquarter: any = [];

    const dom = this.sdt === undefined || this.sdt === null || this.sdt.length < 1 ? 'All' : this.sdt;
    const pf = this.isProdFamSel;
    let pr = localStorage.getItem('dsProductvalue') ? localStorage.getItem('dsProductvalue') : 'All';
    const rp = localStorage.getItem('dsQuartervalue') ? localStorage.getItem('dsQuartervalue') : 'All';
    const ev = this.ss === undefined || this.ss === null || this.ss.length < 1 ? 'All' : this.ss;
    const m = this.sm === undefined || this.sm === null || this.sm.length < 1 ? 'All' : this.sm ;

    // const filteredProdList = pr !== 'All' ? pr.map(i => i.name) : pr;
    pr = this.converter.convert(pr);
    pr = this.encodeValue.encodeStr(pr);
    cQuarter = rp ? rp : 'All';


    // if (rp !== 'All' && rp !== undefined && rp !== null) {
    //   for (let i = 0; i < rp.length; i++) {
    //     if (rp[i].name === undefined) {
    //       getquarter = this.qList.filter(function (itmes) {
    //         return itmes.Year === rp[i].Year;
    //       });
    //       for (let j = 0; j < getquarter.length; j++) {
    //         selectedquarter.push(getquarter[j]);
    //       }
    //     } else {
    //       selectedquarter.push(rp[i]);
    //     }
    //   }
    //   const mapData = selectedquarter.map((item) => {
    //     return item.name;
    //   });
    //   cQuarter = rp ? this.encodeValue.encodeStr(mapData) : 'All';
    // } else {
    //   cQuarter = 'All';
    // }

    if (this.totalCount > 200) {
      this.validationModal.showMessage('This will take time to download', 'info');
    }

    if (this.isManagementOrNot) {
      this.httpService.GetFilteredTypeUnhandledSignals(dom, pf, cQuarter,
        pr, ev, this.managementMethod, 1, this.totalCount).
        subscribe((data: any) => {
          tData = data.Signals;
          const fRpc = tData.map((i, index) => {
            return i.current_review_period;
          });

          const fC = fRpc.map((item, index) => {
            const fI = item.map((i) => {
              const fli = i.count;
              const li = fli.toString();
              return li;
            });
            return fI;
          });

          console.log('checkign-li: ', fC);


          tData.forEach((element, i) => {
            const values = element.result.ChiSquare;
            const prrV = element.result.PRR_Lower_Bound;
            const fPrrV = prrV ? prrV : '';
            const fVal = values ? ' ,' + values : '';
            const qN: string = 'RPC Count' + cQuarter;
            const onj = {
              'Signal ID': element.signal_id,
              'Name': element.name,
              'Product' : element.product,
              'Method' : element.method,
              'Domain'  : element.domain,
              'Statistical Value' : fPrrV + fVal,
              'Case Count': element.caseCount,
              'RPC Count' : JSON.stringify(fC[i]),
              'Short Comment': element.short_comment,
              'Previous Short Comment': element.previous_short_comment
            };

            finalarr.push(onj);
          });

            // tslint:disable-next-line: no-shadowed-variable
            this.httpService.downloaddetails(window.location.href, 'Signal Detection', 'Excel').subscribe((data: any) => {
              // tslint:disable-next-line: prefer-const
              let x = JSON.stringify(data.data);
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
              const finalarr1 = [];
              for (let i = 0; i < keys.length; i++) {
                const onj = {
                  'Info': keys[i], // data.data[i],
                  'Details': res[i]
                };
                finalarr1.push(onj);
              }
              const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(finalarr1);
              const wb: XLSX.WorkBook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, 'User Details');
              const ws1 = XLSX.utils.json_to_sheet(finalarr);
              XLSX.utils.book_append_sheet(wb, ws1, 'Data');
              XLSX.writeFile(wb, 'Signal Detection.xlsx');
            });
      });
    } else {
      const valItem = this.selectedValItem === undefined ||
      this.selectedValItem === null || this.selectedValItem.length < 1 ? 'All' : this.selectedValItem;
      this.httpService.GetFilteredUnhandledSignals(dom, pf, cQuarter,
        pr, ev, m, valItem, 1, this.totalCount).
        subscribe((data: any) => {
          tData = data.Signals;

          const fRpc = tData.map((i, index) => {
            return i.current_review_period;
          });

          const fC = fRpc.map((item, index) => {
            const fI = item.map((i) => {
              return i.count;
            });
            return fI;
          });

          console.log('checkign-li: ', fC);

          tData.forEach((element, i) => {
            const values = element.result.ChiSquare;
            const prrV = element.result.PRR_Lower_Bound;
            const fPrrV = prrV ? prrV : '';
            const fVal = values ? ' ,' + values : '';
            const onj = {
              'Signal ID': element.signal_id,
              'Name': element.name,
              'Product' : element.product,
              'Method' : element.method,
              'Domain'  : element.domain,
              'Statistical Value' : fPrrV + fVal,
              'Case Count': element.caseCount,
              'RPC Count': JSON.stringify(fC[i]),
              'Short Comment': element.short_comment,
              'Previous Short Comment': element.previous_short_comment
            };

            finalarr.push(onj);
          });

          // for (let i = 0; i < tData.length; i++) {

          //   const y = [];
          //   const values = tData[i].result.ChiSquare;
          //   const fVal = values ? ' ,' + values : '';
          //   const prrV = tData[i].result.PRR_Lower_Bound;
          //   const fPrrV = prrV ? prrV : '';
          //   const onj = {
          //     'Signal ID': tData[i].signal_id,
          //     'Name': tData[i].name,
          //     'Product' : tData[i].product,
          //     'Method' : tData[i].method,
          //     'Domain'  : tData[i].domain,
          //     'Statistical Value' : fPrrV + fVal,
          //     'Case Count': tData[i].caseCount,
          //     'Current Review Period': JSON.stringify(fRpc[i]),
          //     'Short Comment': tData[i].short_comment,
          //     'Previous Short Comment': tData[i].previous_short_comment
          //   };

          //   finalarr.push(onj);
          //  }
            // import('xlsx').then(xlsx => {
            //     const worksheet = xlsx.utils.json_to_sheet(finalarr);
            //     const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            //     const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            //     this.saveAsExcelFile(excelBuffer, 'SignalDetected_Unhandled');
            // });
            // tslint:disable-next-line: no-shadowed-variable
            this.httpService.downloaddetails(window.location.href, 'Signal Detection', 'Excel').subscribe((data: any) => {
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
              const finalarr1 = [];
              for (let i = 0; i < keys.length; i++) {
                const onj = {
                  'Info': keys[i], // data.data[i],
                  'Details': res[i]
                };
                finalarr1.push(onj);
              }
              const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(finalarr1);
              const wb: XLSX.WorkBook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, 'User Details');
              const ws1 = XLSX.utils.json_to_sheet(finalarr);
              XLSX.utils.book_append_sheet(wb, ws1, 'Data');
              XLSX.writeFile(wb, 'Signal Detection.xlsx');
            });
        });
    }
  }

  /**download the data in excel in query page */
  downloadQueryInExcel() {
    const finalarr = [];

    for (let i = 0; i < this.rows.length; i++) {

      const y = [];
      const values = this.rows[i].result.ChiSquare;
      const fVal = values ? ' ,' + values : '';
      const onj = {
        'Name': this.rows[i].name,
        'Product' : this.rows[i].product,
        'Method' : this.rows[i].method,
        'Domain'  : this.rows[i].domain,
        'Statistical Value' : this.rows[i].result.PRR_Lower_Bound + ', ' +
         this.rows[i].result.PRR + ', ' + this.rows[i].result.PRR_Upper_Bound + fVal,
        'Case Count': this.rows[i].caseCount,
        'Short Comment': this.rows[i].short_comment
      };

      finalarr.push(onj);
     }
     this.httpService.downloaddetails(window.location.href, 'Signal Detection', 'Excel').subscribe((data: any) => {
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
      const finalarr1 = [];
      for (let i = 0; i < keys.length; i++) {
        const onj = {
          'Info': keys[i], // data.data[i],
          'Details': res[i]
        };
        finalarr1.push(onj);
      }
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(finalarr1);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'User Details');
      const ws1 = XLSX.utils.json_to_sheet(finalarr);
      XLSX.utils.book_append_sheet(wb, ws1, 'Data');
      XLSX.writeFile(wb, 'Signal Detection.xlsx');
    });
      // import('xlsx').then(xlsx => {
      //     const worksheet = xlsx.utils.json_to_sheet(finalarr);
      //     const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      //     const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      //     this.saveAsExcelFile(excelBuffer, 'SignalDetected_Query');
      // });
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

  /**method to get the pagination values */
  getPaginationValues(tCount: any, length: any, start: any, end: any) {
    let totalPages: any;
    let remainingRecords: any;
    let startPage: any;
    let endPage: any;
    let pageCount: any;
    let itemsPerPage: any;
    let currentPageCount: any;
    if (tCount % 50 === 0) {
      totalPages = tCount / 50;
      startPage = totalPages - (totalPages - 1);
      endPage = totalPages;
      pageCount = 50;
      itemsPerPage = length;
      currentPageCount = itemsPerPage;
      if (this.currentPage === endPage) {
        this.reachedEnd = true;
        this.endCount = (this.endCount - 50) + itemsPerPage;
      } else {
        this.reachedEnd = false;
      }
    } else {
      totalPages = Math.trunc(tCount / 50);
      remainingRecords = tCount % 50;
      startPage = Math.trunc(totalPages) - (Math.trunc(totalPages) - 1);
      endPage = Math.trunc(totalPages) + 1;
      pageCount = 50;
      itemsPerPage = length;
      currentPageCount = itemsPerPage;
      if (this.currentPage === endPage) {
        this.reachedEnd = true;
        this.endCount = (this.endCount - 50) + itemsPerPage;
      } else {
        this.reachedEnd = false;
      }
    }
  }

}
