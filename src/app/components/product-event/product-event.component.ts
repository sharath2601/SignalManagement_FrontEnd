import { take, takeUntil } from 'rxjs/operators';
import { ValidationModal } from './../../helpers/validation-modal';
import { Encoder } from 'src/app/services/encoder';
import { NarrativeCommentUpdate } from './../../models/narrative-comment-update';
import { HttpService } from 'src/app/services/http.service';
import {
  Component,
  OnInit,
  DoCheck,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import Swal from 'sweetalert2';
import { CustomindireportComponent } from '../customindireport/customindireport.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LazyLoadEvent } from 'primeng/api/lazyloadevent';
import * as XLSX from 'xlsx';
import { GenericDomainProductFamily } from 'src/app/services/GenericDomainProductFamily';
import { Converter } from 'src/app/helpers/converter';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
// import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-event',
  templateUrl: './product-event.component.html',
  styleUrls: ['./product-event.component.css'],
})
export class ProductEventComponent implements OnInit, DoCheck, OnDestroy {
  animations: boolean;
  private _dataTable: any;
  // product-event variables
  productList: any;
  selectedPE: any;
  showParameters: any;
  signals: any = [];
  selectedS: any;
  parameters: any = [];
  selectedParameter: any = null;
  result: any = [];
  peview: any = [500, 400];
  caseList: any = [];
  showcaseslist: any;
  currentPage = 1;
  narrativeReport: any = {};
  pecColor = {
    domain: [
      '#265690',
      '#eb5627',
      '#6c5b7b',
      '#355c7d',
      '#00FF00',
      '#02e9f5',
      '#f77102',
      '#e3db0e',
    ],
  };
  showChart: any;
  xAxisLabel: any;
  showSMethod: any;
  domains: any;
  selectedDomain: any;
  isCommentUpdated: any;
  selEve: any;
  selP: any;
  selE: any;
  selParam;
  sm: any;
  comments: any;
  methods: any;
  totalRecords: number;
  selectedCommentMethod: any;
  comment: any;
  caseCountNum: any;
  cols: { field: string; header: string }[];
  loading: boolean;
  filteredBrands: any[];
  signalmethod: any;
  mergesignalmethod: any;
  startCount: any;
  endCount: any;
  totalCount: any;
  donwloadContent: any;
  productLoader: any = false;
  signalLoader: any = false;
  productFamily: { id: number; name: string }[];
  selectProductFamily: any;
  selectedfamily: boolean;
  showtotalcases: boolean;
  subs: Subscription;

  constructor(
    private httpService: HttpService,
    private ngxLoader: NgxUiLoaderService,
    private converter: Converter,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private encodeValue: Encoder,
    private prodFamily: GenericDomainProductFamily,
    private nComment: NarrativeCommentUpdate,
    private validationModal: ValidationModal
  ) {}

  ngOnInit(): void {
    this.productFamily = this.prodFamily.selectProductFamilyType();
    this.selectProductFamily = this.productFamily[0].name;
    this.selectedDomain = 'Drug';
    // this.selectedParameter = 'Gender';
    this.showParameters = false;
    this.showChart = false;
    this.showcaseslist = false;
    this.showSMethod = false;

    this.getProductTypes();
    // this.getSignalsData();
    this.getParameters();

    this.subs = this.httpService.isCommentUpdated.subscribe(
      (res) => (this.isCommentUpdated = res)
    );
    this.cols = [
      { field: 'aer_number', header: 'AER No.' },
      { field: 'comment', header: 'Signal Reviewer\'s Comments' },
    ];

    this.startCount = 1;
    this.endCount = 50;
  }

  public disableAnimations() {
    this.animations = true;
    setTimeout(() => {
      this.animations = false;
    }, 1000);
  }

  ngDoCheck(): void {
    this.cdr.detectChanges();

    if (this.isCommentUpdated === true) {
      this.caseList = [
        ...this.caseList.slice(0, this.nComment.rI),
        this.nComment,
        ...this.caseList.slice(this.nComment.rI + 1),
      ];
    }
    this.httpService.makeComment(false);
  }

  loadAERcommentsLazy(event: LazyLoadEvent) {
    if (this.selectProductFamily === 'Individual Product') {
      this.selectedfamily = false;
    } else {
      this.selectedfamily = true;
    }
    this.loading = true;
    const pa = this.setParameter(this.selectedParameter)
      ? this.setParameter(this.selectedParameter)
      : 'gender';
    const pr = this.selectedPE;
    // ? p.name : p;

    this.httpService
      .GetSACasesData(
        this.selectedDomain,
        this.selectedfamily,
        pa,
        this.converter.convert(pr),
        this.selectedS,
        this.converter.convert(this.selEve),
        event.first + 1,
        event.first + event.rows
      )
      .subscribe(
        (data: any) => {
          this.caseList = data.data;
          this.totalRecords = data.cases_count;
          this.loading = false;
          this.ngxLoader.stop();
          this.loading = false;
        },
        (error) => {
          this.ngxLoader.stop();
          this.validationModal.showMessage(
            'analytics cases issue ' + error,
            'error'
          );
        }
      );
  }

  percentageFormatting(c) {
    return c.toFixed(2);
  }

  getProductTypes() {
    this.httpService.GetProductTypes().subscribe(
      (types: any) => {
        const filteredTypes = types.products.filter((item) => {
          return item.count > 500;
        });

        this.domains = filteredTypes;
        this.getProducts('Drug');
      },
      (error) => {
        this.validationModal.showMessage(
          'analytics domain issue ' + error,
          'error'
        );
      }
    );
  }

  /*Method to show available products */
  getProducts(item: any) {
    if (this.selectProductFamily === 'Individual Product') {
      this.selectedfamily = false;
    } else {
      this.selectedfamily = true;
    }
    this.productLoader = true;
    this.httpService.GetAvailableProducts(item, this.selectedfamily).subscribe(
      (data: any) => {
        // this.productList = [];
        this.signals = [];
        this.mergesignalmethod = '';
        this.showtotalcases = false;
        this.selectedParameter = '';
        this.showcaseslist = false;
        this.showChart = false;
        this.selectedPE = '';
        this.selectedS = '';
        this.productList = data.products;
        this.productLoader = false;
      },
      (error) => {
        this.validationModal.showMessage(
          'analytics products issue ' + error,
          'error'
        );
      }
    );
  }

  getSignalsData() {
    if (this.selectProductFamily === 'Individual Product') {
      this.selectedfamily = false;
    } else {
      this.selectedfamily = true;
    }
    this.signalLoader = true;
    this.mergesignalmethod = '';
    this.showcaseslist = false;
    this.signals = [];
    this.showtotalcases = false;
    this.showChart = false;
    this.selectedParameter = '';
    this.selectedS = '';
    if (this.selectedPE === '' || this.selectedPE === null) {
      this.validationModal.showMessage('Select a Product', 'warning');
      return;
    }
    this.httpService
      .GetAvailableEvents(
        this.selectedDomain,
        this.selectedfamily,
        this.converter.convert(this.selectedPE)
      )
      .subscribe(
        (events: any) => {
          this.signals = events.data;
          this.signalLoader = false;
        },
        (error) => {}
      );
  }

  getParameters() {
    this.parameters = [
      { value: 'Gender', label: 'Gender' },
      { value: 'Age', label: 'Age' },
      { value: 'Medical History', label: 'Medical History' },
      { value: 'Dechallenge', label: 'Dechallenge' },
      { value: 'Rechallenge', label: 'Rechallenge' },
      { value: 'Time to Onset', label: 'Time to Onset' },
      { value: 'Country', label: 'Country' },
      { value: 'Concomitant Medication', label: 'Concomitant Medication' },
      { value: 'Seriousness', label: 'Seriousness' },
      { value: 'Event Outcome', label: 'Event Outcome' },
      { value: 'Death', label: 'Death' },
    ];
  }

  axisFormat(val) {
    if (val % 2 === 0) {
      return val.toLocaleString();
    } else {
      return '';
    }
  }

  showData(p: any, e: any, param: any) {
    if (e === null || e === undefined || e === 'null' || e.length < 1) {
      this.showtotalcases = false;
      this.showChart = false;
      this.showcaseslist = false;
      this.mergesignalmethod = '';
      return;
    }
    if (param === null || param === '' || param === ' ') {
      this.getTotalCases();
      this.showChart = false;
      this.showcaseslist = false;
      return;
    }

    this.mergesignalmethod = '';
    if (this.selectProductFamily === 'Individual Product') {
      this.selectedfamily = false;
    } else {
      this.selectedfamily = true;
    }
    this.showcaseslist = false;
    if (param === '' || param === null) {
      this.validationModal.showMessage('Select a variable', 'warning');
      return;
    }

    if (e === '' || e === null) {
      this.validationModal.showMessage('Select a event', 'warning');
      return;
    }

    if (p !== undefined && e !== undefined && param !== undefined) {
      this.ngxLoader.start();
      const parameter = this.setParameter(param)
        ? this.setParameter(param)
        : 'gender';

      const pr = p.name ? p.name : p;
      this.xAxisLabel = pr;
      this.showSMethod = true;

      this.httpService
        .GetData(
          this.selectedDomain,
          this.selectedfamily,
          parameter,
          this.converter.convert(pr),
          e
        )
        .subscribe(
          (data: any) => {
            if (data.data.length < 1) {
              this.ngxLoader.stop();
              this.validationModal.showMessage('No data Avaliable', 'info');
              return;
            }
            const ob = data.data[0];
            const oKeys = Object.keys(ob);
            const ar = this.changelabel(data.data, oKeys[0], oKeys[1]);
            this.showChart = true;

            let temp = JSON.stringify(ar);
            temp = temp.replace(/\"\"/g, '"Blank"');
            this.result = JSON.parse(temp);

            this.getTotalCases();

            this.getSignalAnalyticsComment(
              this.selectedDomain,
              this.selectedfamily,
              this.converter.convert(pr),
              e,
              parameter
            );
            this.ngxLoader.stop();
          },
          (error) => {
            this.ngxLoader.stop();
            /**to find issue */
            this.validationModal.showMessage(
              'analytics data issue' + error,
              'error'
            );
          }
        );
    }
  }

  /**Method to get total num of cases */
  getTotalCases() {
    if (this.selectProductFamily === 'Individual Product') {
      this.selectedfamily = false;
    } else {
      this.selectedfamily = true;
    }
    this.httpService
      .GetTotalCaseCount(
        this.selectedDomain,
        this.selectedfamily,
        this.converter.convert(this.selectedPE),
        this.selectedS
      )
      .subscribe(
        (data: any) => {
          this.caseCountNum = data.count;
          this.showtotalcases = true;
        },
        (error) => {
          /**to find issue */
          this.validationModal.showMessage(
            'analytics cases issue' + error,
            'error'
          );
        }
      );
  }

  downloadallcases() {
    if (this.selectProductFamily === 'Individual Product') {
      this.selectedfamily = false;
    } else {
      this.selectedfamily = true;
    }
    this.validationModal.showMessage(
      'It will take some time to download',
      'warning'
    );
    this.httpService
      .DownloadCaseCount(
        this.selectedDomain,
        this.selectedfamily,
        'All',
        this.selectedPE,
        this.selectedS,
        'Signal Analytics Download All Cases',
        window.location.href
      )
      .subscribe((data) => {
        const blob = new Blob([data], {
          type: 'application/zip',
        });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      });
    // this.httpService.
    // DownloadCaseCount(this.selectedDomain, this.selectedfamily, 'All', this.selectedPE, this.selectedS).
    //   subscribe((data: any) => {
    //     this.donwloadContent = data.data;
    //     const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.donwloadContent.cases);
    //     // /* generate workbook and add the worksheet */
    //     const wb: XLSX.WorkBook = XLSX.utils.book_new();
    //     //  const wb1: XLSX.WorkBook = XLSX.utils.book_append_sheet;
    //     XLSX.utils.book_append_sheet(wb, ws, 'Cases');

    //     const ws1 = XLSX.utils.json_to_sheet(this.donwloadContent.product_events);

    //     /* Add the worksheet to the workbook */
    //     XLSX.utils.book_append_sheet(wb, ws1, 'Details');

    //     // /* save to file */
    //     XLSX.writeFile(wb, 'CaseDownload.xlsx');
    //   },
    //     (error) => {
    //       this.validationModal.showMessage(error, 'error');
    //     }
    //   );
  }

  showCasesData(event: any) {
    this.showcaseslist = false;

    this.ngxLoader.start();

    setTimeout(() => (this.showcaseslist = true), 0);
    // this.showcaseslist = true;
    const selectedItem = event.name;
    this.selEve = selectedItem;
    this.ngxLoader.stop();
  }

  changelabel(arr: any, p1: any, p2: any) {
    arr = arr.map(function (o) {
      o['name'] = o[p1];
      o['value'] = o[p2];
      delete o[p1];
      delete o[p2];
      return o;
    });

    return arr;
  }

  setParameter(param: any) {
    let parameter = '';
    switch (param) {
      case 'Gender':
        parameter = 'gender';
        break;
      case 'Death':
        parameter = 'death';
        break;
      case 'Dechallenge':
        parameter = 'dechallenge';
        break;
      case 'Rechallenge':
        parameter = 'rechallenge';
        break;
      case 'Medical History':
        parameter = 'mh';
        break;
      case 'Age':
        parameter = 'age_groups';
        break;
      case 'Country':
        parameter = 'country';
        break;
      case 'Concomitant Medication':
        parameter = 'conmed';
        break;
      case 'Seriousness':
        parameter = 'seriousness';
        break;
      case 'Event Outcome':
        parameter = 'ae_outcome';
        break;
      case 'Time to Onset':
        parameter = 'time_on_set';
        break;
    }

    return parameter;
  }

  showNarrative(id: any, comment: any, index: any) {
    this.nComment.aer_number = id;
    this.nComment.comment = comment;
    this.nComment.rI = index;
    this.httpService
      .GetIndividualICSRDetails(id)
      .subscribe((narrative: any) => {
        this.narrativeReport = narrative;
        const ref = this.modalService.open(CustomindireportComponent, {
          size: 'xl',
          scrollable: true,
        });
        ref.componentInstance.narrativeReport = this.narrativeReport;
        ref.componentInstance.fromWhichPage = false;
      });
  }

  getSignalAnalyticsComment(
    type: any,
    prodfamily,
    prod: any,
    eve: any,
    met: any
  ) {
    this.httpService
      .GetSignalAnalyticsComment(type, prodfamily, prod, eve)
      .subscribe((data: any) => {
        this.comments = data.data;
        const fComments = this.comments;
        this.methods = fComments.map((element) => {
          return element.method;
        });
        this.signalmethod = this.methods[0];
        this.mergesignalmethod = this.methods.join(', ');

        if (this.comments[0].signal_comment !== undefined) {
          this.comment = this.comments[0].signal_comment;
        }
        // this.comment
      });
  }

  checkCommentLength(str: string) {
    if (str.length > 1000) {
      this.validationModal.showMessage('Maximum Character length for comment is 1000.', 'warning');
      return;
    }
  }

  /**Method to update comment in for signal reviewer's */
  updateComment() {
    if (
      this.comment.comment === undefined ||
      this.comment.comment.length === 0
    ) {
      this.validationModal.showMessage('Comment cannot be empty', 'warning');
      return;
    }

    const res = this.encodeValue.validateComment(this.comment.comment);
    if (res === false) {
      this.validationModal.showMessage(
        'Comment cannot contain spaces at the begining and end',
        'warning'
      );
      return;
    }

    const crossedOrNot = this.encodeValue.checkCommentOrNotCrossedLimit(this.comment.comment);
    if (crossedOrNot) {
      this.validationModal.showMessage('Maximum Character length for comment is 1000.', 'warning');
      return;
    }
    const item = this.comments.filter((i) => {
      return i.method === this.signalmethod;
    });
    const model = {
      comment: this.comment.comment,
      signalId: item[0].id,
    };
    this.httpService.UpdateSignalAnalyticsComment(model).subscribe(
      (data: any) => {
        this.validationModal.showMessage(data.comment, 'success');
        this.comment = data.statSigComment;
      },
      (error) => {
        /**to find issue */
        this.validationModal.showMessage(
          'analytics update comment issue ' + error,
          'error'
        );
      }
    );
  }

  exportCSV(dt) {
    if (dt._totalRecords < 1) {
      this.validationModal.showMessage('No Record found to export', 'info');
      return false;
    }
    const finalarrdata = [];
    const filterval = dt.filteredValue != null ? dt.filteredValue : dt._value;
    for (let i = 0; i < filterval.length; i++) {
      const onj = {
        'Aer No.': filterval[i].aer_number,
        'Signal Reviewers Comments': filterval[i].comment.comment
          ? filterval[i].comment.comment +
            ' ' +
            filterval[i].comment.user +
            ' ' +
            filterval[i].comment.time_stamp
          : '',
      };

      finalarrdata.push(onj);
    }
    this.httpService
      .downloaddetails(window.location.href, 'Signal Analytics', 'CSV')
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
          XLSX.writeFile(workbook, 'Signal Analytics.csv');
        });
      });
    // this._dataTable = dt;
    // // this.loading = true;
    // const pa = this.setParameter(this.selectedParameter) ? this.setParameter(this.selectedParameter) : 'gender';
    // const pr = this.selectedPE;
    // // ? p.name : p;
    // if (this.selectProductFamily === 'Individual Product') {
    //   this.selectedfamily = false;
    // } else {
    //   this.selectedfamily = true;
    // }
    // this.httpService.
    //   GetSACasesData(this.selectedDomain, this.selectedfamily, pa, pr.toUpperCase(),
    //     this.selectedS, this.converter.convert(this.selEve), 1, this.totalRecords).subscribe((data: any) => {
    //       data.data.forEach(element => {
    //         element.comment = element.comment.comment;
    //         if (element.comment === undefined) {
    //           element.comment = '';
    //         }
    //       });
    //       this._dataTable.value = data.data;
    //       this._dataTable.exportCSV();
    //     },
    //       (error) => {
    //         this.validationModal.showMessage(error, 'error');
    //         this.ngxLoader.stop();

    //       }
    //     );
  }
  exportExcelCases() {
    const finalarr1 = [];
    const pa = this.setParameter(this.selectedParameter)
      ? this.setParameter(this.selectedParameter)
      : 'gender';
    const pr = this.selectedPE;
    // ? p.name : p;
    if (this.selectProductFamily === 'Individual Product') {
      this.selectedfamily = false;
    } else {
      this.selectedfamily = true;
    }
    this.httpService
      .GetSACasesData(
        this.selectedDomain,
        this.selectedfamily,
        pa,
        this.converter.convert(pr),
        this.selectedS,
        this.converter.convert(this.selEve),
        1,
        this.totalRecords
      )
      .subscribe(
        (data: any) => {
          data.data.forEach((element) => {
            element.comment =
              element.comment.comment +
              ' ' +
              element.comment.user +
              ' ' +
              element.comment.time_stamp;
            if (element.comment === 'undefined undefined undefined') {
              element.comment = '';
            }
          });
          // console.log(data.data);
          // if(data.data.length<1)
          // {
          //   this.validationModal.showMessage('No Record found to export', 'info');
          //   return false;
          // }
          for (let i = 0; i < data.data.length; i++) {
            const y = [];
            // if (dt._value[i].assigned_to.length > 0) {
            //  y = dt._value[i].assigned_to.map(item => item.itemName);
            // }
            const onj = {
              'AER Number': data.data[i].aer_number,
              'Signal Reviewers Comments': data.data[i].comment,
            };
            finalarr1.push(onj);
          }
          this.httpService
            .downloaddetails(window.location.href, 'Signal Analytics', 'Excel')
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
              XLSX.writeFile(wb, 'Signal Analytics.xlsx');
            });
        },
        (error) => {
          this.ngxLoader.stop();
          this.validationModal.showMessage(
            'analytics export issue e ' + error,
            'error'
          );
        }
      );
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

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
