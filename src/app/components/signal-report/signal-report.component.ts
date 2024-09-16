import { ValidationModal } from './../../helpers/validation-modal';
import { CustomSignalsComponent } from './../custom-signals/custom-signals.component';
import { SignalReport } from './../../models/signal-report.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpService } from './../../services/http.service';
import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faPencilAlt, faDownload, faSquare } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { Subject } from 'rxjs';
import * as docx from 'docx';
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, Alignment } from 'docx';
import saveAs from 'file-saver';
import { IcsrCommentUpdate } from 'src/app/models/icsr-comment-update.model';
import { StatisticalUpdate } from 'src/app/models/statistical-update.model';
import {Router, ActivatedRoute} from '@angular/router';

import { signalData } from 'src/app/services/signal-data';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Converter } from 'src/app/helpers/converter';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { asBlob } from 'html-docx-js';
import htmlDocx from 'html-docx-js/dist/html-docx';
@Component({
  selector: 'app-signal-report',
  templateUrl: './signal-report.component.html',
  styleUrls: ['./signal-report.component.css']
})
export class SignalReportComponent implements OnInit {

  public Editor = ClassicEditor;
  public isDisabled = false;
  readonly: boolean;
  signalData: any;
  signalCode: any;
  reportId: any;
  domain: any;
  product: any;
  pt: any;
  custom: any;
  getlatest_comments: any;
  allcomments: any;
  displayEvents: boolean;
  show: boolean;

  constructor(    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private ngxloader: NgxUiLoaderService,
    private authService: AuthenticationService,
    private signalReport: SignalReport,
    private commentModel: IcsrCommentUpdate,
    private statModel: StatisticalUpdate,
    private ngxLoader: NgxUiLoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private converter: Converter,
    private validationModal: ValidationModal) { }

  ngOnInit(): void {
    // console.log(this.activatedRoute.queryParams);
    this.reportId = this.route.snapshot.paramMap.get('reportid');
    this.signalCode = this.route.snapshot.paramMap.get('code');
    this.domain = this.route.snapshot.paramMap.get('domain');
    this.product = this.route.snapshot.paramMap.get('product');
    this.pt = this.route.snapshot.paramMap.get('event');
    this.custom = this.route.snapshot.paramMap.get('custom');
    this.ngxLoader.start();

  //  this.signalCode = this.router.snapshot.paramMap.get("userType")




    this.httpService.GetSignalReport(this.reportId, this.custom).subscribe((data: any) => {
      this.getLatestComment();
      this.ngxLoader.stop();
      this.signalData = data.report_data.fields ? data.report_data.fields : data.report_data;
      this.readonly = data.read_only;
      this.show = true;
      if (this.readonly === true) {
        this.isDisabled = true;
      } else {
        this.isDisabled = false;
      }
    },
      (error) => {
        this.ngxLoader.stop();
        /**to find issue */
        this.validationModal.showMessage('report initial issue ' + error, 'error');
      }
    );
  }
  getLatestComment() {
    this.httpService.GetLatestComments(this.reportId, this.custom).subscribe((data: any) => {
      this.getlatest_comments = data.comments;
    },
      (error) => {
        /**to find issue */
        this.validationModal.showMessage('report lat comment' + error, 'error');
      }
    );
  }
  Getallcomments(sId: any) {

    this.httpService.GetComments(sId, this.reportId, this.custom).subscribe((data: any) => {
      this.allcomments = data.comments;
      if (this.allcomments.length > 0) {
      this.displayEvents = true;
      } else {
        this.validationModal.showMessage('No Comment Added Yet.', 'warning');

      }

    },
      (error) => {
        /**to find issue */
        this.validationModal.showMessage('report all comments issue ' + error, 'error');
      }
    );
  }

  saveComment(c: any, sId: any) {
    this.httpService.SaveComment(this.reportId, c, sId, this.custom).subscribe((data) => {
    },
      (error) => {
        this.validationModal.showMessage('report save comment issue ' + error, 'error');
      }
    );
  }
  addCommentClick(sId: any, comment: any) {
    // tslint:disable-next-line: triple-equals
    if (comment == '' || comment.match(/^\s*$/)) {
      this.validationModal.showMessage('Comment cannot be empty', 'warning');
      return;
    }
    this.httpService.SaveComment(this.reportId, comment, sId, this.custom).subscribe((data) => {
      this.validationModal.showMessage('Comment Added', 'success');
      this.getLatestComment();
      setTimeout(() => {
        // document.getElementsByClassName('text_'+sId).innerHTML ="";

        document.getElementById('comment_' + sId).innerHTML = this.getlatestcommentbysection(sId);
      }, 2000);
    },
      (error) => {
        /**to find issue */
        this.validationModal.showMessage('report add comment issue ' + error, 'error');
      }
    );
  }
  // closeEditorModal() {
  //   this.ngxSmartModal.close('editModal');
  //   this.ngxSmartModal.resetModalData('editModal');
  // }
  getlatestcommentbysection(id: any) {
    const as = $(this.getlatest_comments).filter(function (i, n) { return n.section_id === id; });
    if (as.length > 0) {
      return as[0].comment + '/' + as[0].user + '/' + as[0].created;
    } else {
      return 'No Comment Added Yet';
    }
  }
  submitReport() {
    const od = {
      doc_name: 'Evaluation Report',
      fields: this.signalData
    };

    this.httpService.SaveSignalReport(this.reportId, this.signalCode, JSON.stringify(od), this.custom).subscribe((data: any) => {
      this.validationModal.showMessage(data.comment, 'success');

      setTimeout(() => {
        // this.show = false;
        window.close();
      }, 1200);
    //  this.getCurrentSignals();

    },
      (error) => {
        /**to find issue */
        this.validationModal.showMessage('report submit issue ' + error, 'error');
      }
    );
  }
  CompleteReport() {
    const od = {
      doc_name: 'Evaluation Report',
      fields: this.signalData
    };

    this.httpService.CompleteSignalReport(this.reportId, this.signalCode, JSON.stringify(od), this.custom).subscribe((data: any) => {
      this.validationModal.showMessage(data.comment, 'success');

      setTimeout(() => {
        window.close();
      }, 1200);
    //  this.getCurrentSignals();

    },
      (error) => {
        /**to find issue */
        this.validationModal.showMessage('report complete issue ' + error, 'error');
      }
    );
  }
  downloadDoc() {

    let converted = '';
    for (let i = 0; i < this.signalData.length; i++) {
      const title = (signalData[i].id === '0') ? '' : '<h2>' + signalData[i].id + '. ' + signalData[i].title + '</h2><br>';
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
            text: ((signalData[i].id === '0') ? 'SIGNAL EVALUATION REPORT' : signalData[i].id + ' ' + signalData[i].title),
            bold: true,
            font: {
              name: 'Arial'
            }
          })
        ],
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.START,
        // thematicBreak: true,
        // pageBreakBefore: true,
        style: 'heading',
        spacing: {
          before: 500
        },
      });
      val.push(introHead);
      introDesc = new Paragraph({
        children: [
          new TextRun({
            text: signalDatavalue,
            font: {
              name: 'Arial'
            }
          })
        ],

        style: 'description'
      });
      val.push(introDesc);

    }

  }
}
