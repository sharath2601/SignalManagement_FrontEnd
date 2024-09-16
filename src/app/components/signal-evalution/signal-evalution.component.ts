import { ValidationModal } from './../../helpers/validation-modal';
import { CustomSignalsComponent } from './../custom-signals/custom-signals.component';
import { SignalReport } from './../../models/signal-report.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpService } from './../../services/http.service';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewChildren,
  QueryList,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  faPencilAlt,
  faDownload,
  faSquare,
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { Subject } from 'rxjs';
import * as docx from 'docx';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  Alignment,
} from 'docx';
import saveAs from 'file-saver';
import { IcsrCommentUpdate } from 'src/app/models/icsr-comment-update.model';
import { StatisticalUpdate } from 'src/app/models/statistical-update.model';
import { Router } from '@angular/router';
import { signalData } from 'src/app/services/signal-data';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Converter } from 'src/app/helpers/converter';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { asBlob } from 'html-docx-js';
import htmlDocx from 'html-docx-js/dist/html-docx';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-signal-evalution',
  templateUrl: './signal-evalution.component.html',
  styleUrls: ['./signal-evalution.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SignalEvalutionComponent implements OnInit, OnDestroy {
  public Editor = ClassicEditor;
  public isDisabled = false;
  /**Variables declaration starts here */
  faDownload = faDownload;
  currentSignals = [];
  faPencil = faPencilAlt;
  show = false;
  htmlContent = '';
  @ViewChildren('div') divs: QueryList<any>;
  @ViewChild('report') report: ElementRef;
  reportId;
  signalCode;
  userName;
  step = 0;
  oneAtATime = true;
  editorForm: FormGroup;
  role: any;
  pt: any;
  /**Variables declaration ends here */
  // editorConfig = {
  //   editable: true,
  //   spellcheck: false,
  //   height: '10rem',
  //   minHeight: '5rem',
  //   placeholder: 'Type something. Test the Editor... ヽ(^。^)丿',
  //   translate: 'no'
  // };
  text1: string;
  text2: string;
  /**variables added show icsr's in evaluation page need to be filtered */
  selectedSearch: string;
  searchBy: any[] = [
    { id: 0, name: 'Preferred Product Description(PPD)', selectedItem: true },
    { id: 1, name: 'Local Trade Name', selectedItem: false },
    { id: 2, name: 'Formula ID', selectedItem: false },
  ];
  hierachialSelection = [];
  columns = [
    { name: 'product' },
    // { name: 'method' },
    { name: 'result' },
    { name: 'caseCount' },
    { name: 'name' },
  ];
  productList = [];
  selectedProductItem = [];
  AEList = [];
  productSettings = {};
  methodSettings = {};
  hierarchySettings = {};
  AEsettings = {};
  methodsList = [];
  changedMethodsList = [];
  selectedMethodItem = [];
  selectedHierarchialItem = [];
  selectedAEItem = [];
  rows = [];
  ColumnMode;
  isClicked = false;
  icsrRows = [];
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
  evalsingcols: any[];

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
  getUnhandledSignals = false;
  getIsPt: any;
  selectedHierarchy: any = '';
  indiRows = [];
  newComment = '';
  selectedName: any;
  signalData: any = [];
  textEditor: boolean;
  editOption: any;
  editorHeader: void;
  EditorComment: boolean;
  currentPage: any;
  comment: any;
  faPencilAlt = faPencilAlt;
  parameters: any;
  getlatest_comments: any;
  custom: any;
  domain: any;
  product: any;
  readonly: any;
  displayEvents: boolean;
  allcomments: any;
  /**ends here */

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private ngxloader: NgxUiLoaderService,
    private authService: AuthenticationService,
    private signalReport: SignalReport,
    private commentModel: IcsrCommentUpdate,
    private statModel: StatisticalUpdate,
    private ngxLoader: NgxUiLoaderService,
    private router: Router,
    private modalService: NgbModal,
    private converter: Converter,
    private validationModal: ValidationModal
  ) {
    this.userName = this.authService.currentUserValue.user_name;
    this.role = this.authService.currentUserValue.roles.is_admin;
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  ngOnInit() {
    this.editorForm = this.formBuilder.group({
      intro: ['', Validators.required],
      backgroundInfo: ['', Validators.required],
      preclinical: ['', Validators.required],
      clinical: ['', Validators.required],
      safetyData: ['', Validators.required],
      literatureData: ['', Validators.required],
      discussion: ['', Validators.required],
      conclusion: ['', Validators.required],
    });

    // this.ngxloader.start();
    this.editOption = 'Hello';
    this.httpService.currentEvaluateObj.pipe(take(1)).subscribe((params) => {
      this.parameters = params;
      if (this.parameters.dashboard === 'Yes') {
        this.getFilteredSignals();
      } else {
        this.getCurrentSignals();
      }
    });
    this.evalsingcols = [
      { field: 'domain', header: 'Domain' },
      { field: 'product', header: 'Product Name' },
      { field: 'pt', header: 'Signal' },
      { field: 'signal_code', header: 'Signal Code' },
      { field: 'assigned', header: 'Assigned Name' },
      { field: 'target_date', header: 'Target Date' },
      { field: 'progress', header: 'Status' },
    ];
  }

  getFilteredSignals() {
    const obj = this.parameters;
    this.ngxLoader.start();
    const cEve = this.converter.convert(obj.event);

    this.httpService
      .GetEvalFilteredSignalsbyStatus(
        obj.type,
        obj.prodfamily,
        obj.quarter,
        obj.pName,
        obj.event,
        obj.statusValue.toUpperCase()
      )
      .subscribe(
        (data: any) => {
          this.ngxLoader.stop();
          this.currentSignals = data.signal_report_details;
          // tslint:disable-next-line: forin
          for (const i in this.currentSignals) {
            const y = this.currentSignals[i].assigned_to.map((item) =>
              item.itemName.replace(/\s/g, '')
            );

            const key = 'assigned';
            const value = y.join(', ');
            this.currentSignals[i][key] = value;
          }
        },
        (error) => {
          this.ngxLoader.stop();
          /**to find issue */
          this.validationModal.showMessage(
            'evaluation filter issue 1' + error,
            'error'
          );
        }
      );
  }

  get f() {
    return this.editorForm.controls;
  }

  /*Method to submit report after adding the data into editors */
  submitReport() {
    const od = {
      doc_name: 'Evaluation Report',
      fields: this.signalData,
    };

    this.httpService
      .SaveSignalReport(
        this.reportId,
        this.signalCode,
        JSON.stringify(od),
        this.custom
      )
      .subscribe(
        (data: any) => {
          this.validationModal.showMessage(data.comment, 'success');

          setTimeout(() => {
            this.show = false;
          }, 1200);
          this.getCurrentSignals();
        },
        (error) => {
          /**to find issue */
          this.validationModal.showMessage(
            'evaluation save report issue ' + error,
            'error'
          );
        }
      );
  }

  /*Method to get assigned signals */
  getCurrentSignals() {
    this.ngxloader.start();
    this.httpService.GetCurrentSignals().subscribe(
      (data: any) => {
        this.currentSignals = data.signal_report_details;
        // tslint:disable-next-line: forin
        for (const i in this.currentSignals) {
          const y = this.currentSignals[i].assigned_to.map((item) =>
            item.itemName.replace(/\s/g, '')
          );
          const key = 'assigned';
          const value = y.join(', ');
          this.currentSignals[i][key] = value;
        }

        this.ngxloader.stop();
      },
      (error) => {
        this.ngxloader.stop();
        /**to find issue */
        this.validationModal.showMessage(
          'evaluation signal issue ' + error,
          'error'
        );
      }
    );
  }

  exportExcel() {
    if (this.currentSignals.length < 1) {
      this.validationModal.showMessage(
        'No records found to download',
        'warning'
      );
      return;
    }
    const finalarr1 = [];

    for (let i = 0; i < this.currentSignals.length; i++) {
      const y = [];
      // if (dt._value[i].assigned_to.length > 0) {
      //  y = dt._value[i].assigned_to.map(item => item.itemName);
      // }
      const onj = {
        Domain: this.currentSignals[i].domain,
        Product: this.currentSignals[i].product,
        Signal: this.currentSignals[i].pt,
        'Signal Code': this.currentSignals[i].signal_code,
        'Assigned To': this.currentSignals[i].assigned,
        'Target Date': this.currentSignals[i].target_date,
        Progress: this.currentSignals[i].progress,
      };
      finalarr1.push(onj);
    }
    this.httpService
      .downloaddetails(window.location.href, 'Signal Evaluation', 'Excel')
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
        XLSX.writeFile(wb, 'Signal Evaluation.xlsx');
      });
    // import('xlsx').then(xlsx => {
    //     const worksheet = xlsx.utils.json_to_sheet(finalarr);
    //     const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    //     const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    //     this.saveAsExcelFile(excelBuffer, 'SignalEval');
    // });
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

  showEditorLayout(event) {
    // this.ngxLoader.start();
    this.signalCode = event.signal_code;
    this.reportId = event.report_id;
    this.signalCode = event.signal_code;
    this.domain = event.domain;

    this.product = event.product;
    this.pt = event.pt;
    this.signalCode = event.signal_code;

    this.custom = event.is_custom ? 1 : 0;
    // tslint:disable-next-line: max-line-length
    this.router.navigate([]).then((result) => {
      window.open(
        '/#/signal-report/' +
          this.domain +
          '/' +
          this.signalCode +
          '/' +
          this.reportId +
          '/' +
          this.product +
          '/' +
          this.pt +
          '/' +
          this.custom,
        '_blank'
      );
    });

    // this.httpService.GetSignalReport(event.report_id, this.custom).subscribe((data: any) => {
    //   this.getLatestComment();
    //   this.ngxLoader.stop();
    //   this.signalData = data.report_data.fields ? data.report_data.fields : data.report_data;
    //   this.readonly = data.read_only;

    //   if (this.readonly === true) {
    //     this.isDisabled = true;
    //   } else {
    //     this.isDisabled = false;
    //   }
    // },
    //   (error) => {
    //     this.ngxLoader.stop();
    //     this.validationModal.showMessage(error, 'error');
    //   }
    // );
    // this.show = true;
  }

  // editSection(event) {
  //   this.editOption = event.Sectionbody;
  //   this.editorHeader = event.Sectionheading;
  //   this.textEditor = true;
  //   this.ngxSmartModal.open('editModal');
  //   this.ngxSmartModal.setModalData(this.editOption, 'editModal');
  // }

  // saveSection(event) {
  //   this.EditorComment = true;
  //   this.ngxSmartModal.open('commentModal');
  //   this.ngxSmartModal.setModalData(this.editOption, 'commentModal');

  // }

  getLatestComment() {
    this.httpService.GetLatestComments(this.reportId, this.custom).subscribe(
      (data: any) => {
        this.getlatest_comments = data.comments;
      },
      (error) => {
        /**to find issue */
        this.validationModal.showMessage(
          'evaluation lat comment' + error,
          'error'
        );
      }
    );
  }
  exportCSV(dt: any) {
    if (dt._totalRecords < 1) {
      this.validationModal.showMessage('No Record found to export', 'warning');
      return false;
    }
    const filterval = dt.filteredValue != null ? dt.filteredValue : dt._value;

    const finalarr1 = [];
    for (let i = 0; i < filterval.length; i++) {
      const y = filterval[i].assigned_to.map((item) => item.itemName);

      const onj = {
        Domain: filterval[i].domain,
        Product: filterval[i].product,
        Signal: filterval[i].pt,
        'Signal Code': filterval[i].signal_code,
        'Assigned To': y.join(','),
        'Target Date': filterval[i].target_date,
        'Report Status': filterval[i].progress,
      };
      finalarr1.push(onj);
    }
    this.httpService
      .downloaddetails(window.location.href, 'Signal Evaluation', 'CSV')
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
          XLSX.utils.sheet_add_json(worksheet, finalarr1, {
            skipHeader: false,
            origin: 'A11',
          });
          const workbook = {
            Sheets: { data: worksheet },
            SheetNames: ['data'],
          };
          XLSX.utils.book_append_sheet(workbook, worksheet, 'test');
          XLSX.writeFile(workbook, 'Signal Evaluation.csv');
        });
      });
  }

  Getallcomments(sId: any) {
    this.httpService.GetComments(sId, this.reportId, this.custom).subscribe(
      (data: any) => {
        this.allcomments = data.comments;
        if (this.allcomments.length > 0) {
          this.displayEvents = true;
        } else {
          this.validationModal.showMessage('No Comment Added Yet.', 'warning');
        }
      },
      (error) => {
        this.validationModal.showMessage(
          'evaluation all comment issue' + error,
          'error'
        );
      }
    );
  }

  saveComment(c: any, sId: any) {
    this.httpService.SaveComment(this.reportId, c, sId, this.custom).subscribe(
      (data) => {},
      (error) => {
        /**to find issue */
        this.validationModal.showMessage(
          'evaluation save comment issue ' + error,
          'error'
        );
      }
    );
  }

  addCommentClick(sId: any, comment: any) {
    // tslint:disable-next-line: triple-equals
    if (comment == '' || comment.match(/^\s*$/)) {
      this.validationModal.showMessage('Comment cannot be empty', 'warning');
      return;
    }
    this.httpService
      .SaveComment(this.reportId, comment, sId, this.custom)
      .subscribe(
        (data) => {
          this.validationModal.showMessage('Comment Added', 'success');
          this.getLatestComment();
          setTimeout(() => {
            // document.getElementsByClassName('text_'+sId).innerHTML ="";

            document.getElementById(
              'comment_' + sId
            ).innerHTML = this.getlatestcommentbysection(sId);
          }, 2000);
        },
        (error) => {
          /**to find issue */
          this.validationModal.showMessage(
            'evaluation add comment issue ' + error,
            'error'
          );
        }
      );
  }
  // closeEditorModal() {
  //   this.ngxSmartModal.close('editModal');
  //   this.ngxSmartModal.resetModalData('editModal');
  // }
  getlatestcommentbysection(id: any) {
    const as = $(this.getlatest_comments).filter(function (i, n) {
      return n.section_id === id;
    });
    if (as.length > 0) {
      return as[0].comment + '/' + as[0].user + '/' + as[0].created;
    } else {
      return 'No Comment Added Yet';
    }
  }

  /*Data formatted in excel sheets */
  download() {
    const filList = this.currentSignals.map((item) => {
      delete item.file_exists;
      delete item.is_pt;
      item['serial No.'] = item['report_id'];
      delete item.report_id;
      item['assignee'] = item.assigned_to.full_name;
      delete item.assigned_to;
      return item;
    });
    const headers = ['serial No.', 'signal_code', 'assignee', 'target_date'];
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.currentSignals, {
      header: headers,
    });

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'signals.xlsx');
  }

  downloadDoc() {
    let converted = '';
    for (let i = 0; i < this.signalData.length; i++) {
      const title =
        signalData[i].id === '0'
          ? ''
          : '<h2>' +
            signalData[i].id +
            '. ' +
            signalData[i].title +
            '</h2><br>';
      converted = converted + title + this.signalData[i].data;
    }
    converted = htmlDocx.asBlob(converted.replace(/"/g, '\''));
    saveAs(converted, this.signalCode + '.docx');
    const val: any = [];
    let introHead, introDesc;
    for (let i = 0; i < this.signalData.length; i++) {
      const htmlToText = require('html-to-text');

      const signalDatavalue = htmlToText.fromString(this.signalData[i].data);
      introHead = new Paragraph({
        children: [
          new TextRun({
            text:
              signalData[i].id === '0'
                ? 'SIGNAL EVALUATION REPORT'
                : signalData[i].id + ' ' + signalData[i].title,
            bold: true,
            font: {
              name: 'Arial',
            },
          }),
        ],
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.START,
        // thematicBreak: true,
        // pageBreakBefore: true,
        style: 'heading',
        spacing: {
          before: 500,
        },
      });
      val.push(introHead);
      introDesc = new Paragraph({
        children: [
          new TextRun({
            text: signalDatavalue,
            font: {
              name: 'Arial',
            },
          }),
        ],

        style: 'description',
      });
      val.push(introDesc);
    }
  }

  /**On Clicking back button inside template editor layout,
   * hiding template editor layout and showing signals assigned layout
   */
  hideLayoutEditor() {
    this.show = !this.show;
    this.httpService.UnLockReport(this.reportId, this.custom).subscribe(
      (data: any) => {},
      (error) => {
        this.validationModal.showMessage(error, 'error');
      }
    );
    this.getCurrentSignals();
  }

  ngOnDestroy(): void {
    this.httpService.setEvaluateParameters({});
  }

  showCommentModal(id: any) {
    const modalRef = this.modalService.open(CustomSignalsComponent, {
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.reportId = this.reportId;
    modalRef.componentInstance.sectionId = id;
  }

  CompleteReport() {
    const od = {
      doc_name: 'Evaluation Report',
      fields: this.signalData,
    };

    this.httpService
      .CompleteSignalReport(
        this.reportId,
        this.signalCode,
        JSON.stringify(od),
        this.custom
      )
      .subscribe(
        (data: any) => {
          this.validationModal.showMessage(data.comment, 'success');

          setTimeout(() => {
            this.show = false;
          }, 1200);
          this.getCurrentSignals();
        },
        (error) => {
          /**to find issue */
          this.validationModal.showMessage(
            'evaluation complete report issue ' + error,
            'error'
          );
        }
      );
  }
}
