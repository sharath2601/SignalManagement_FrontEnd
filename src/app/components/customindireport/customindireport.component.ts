import { NarrativeCommentUpdate } from './../../models/narrative-comment-update';
import { Encoder } from 'src/app/services/encoder';
import { HttpService } from 'src/app/services/http.service';
import { Component, OnInit, Input, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { ValidationModal } from 'src/app/helpers/validation-modal';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-customindireport',
  templateUrl: './customindireport.component.html',
  styleUrls: ['./customindireport.component.css'],
  animations: [

  ]
})
export class CustomindireportComponent implements OnInit, AfterContentChecked {
  @Input() narrativeReport: any = {};
  IndividualIcsrComment: any;
  term: any;
  currentPage = 1;
  aerNo: any;
  basicDetails: any = {};
  ae_details: any = [];
  suspectDrug: any;
  showPage: any;
  pv_comment: any;
  company_comment: any;
  mh: any;
  concmt: any;
  res: any;
  @Input() icsrItem: any;
  @Input() fromWhichPage = false;

  constructor(private activeModal: NgbActiveModal,
    private encodeValue: Encoder,
    private cdr: ChangeDetectorRef,
    private httpService: HttpService,
    private modalService: NgbModal,
    private nComment: NarrativeCommentUpdate,
    private validationModal: ValidationModal,
    private router: Router) {
      router.events.subscribe((val) => {
        if (val instanceof NavigationEnd) {
          this.closeModal();
        }
      });
    }

  ngOnInit(): void {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    this.basicDetails = this.narrativeReport.case ? this.narrativeReport.case.basic_case_details : this.narrativeReport;
    this.ae_details = this.narrativeReport.case ? this.narrativeReport.case.AE_details : this.narrativeReport.prod_event_details;
    this.suspectDrug = this.ae_details.ppd ? this.ae_details.ppd : this.narrativeReport.suspect_products;

    // tslint:disable-next-line: max-line-length
    this.pv_comment = this.basicDetails.pharmacovigilance_comment ? this.basicDetails.pharmacovigilance_comment : this.basicDetails.pv_comment;
    this.company_comment = this.basicDetails.company_comment;
    this.IndividualIcsrComment = this.basicDetails.comment.comment;
    this.concmt = this.basicDetails.all_concomitants ? this.basicDetails.all_concomitants : this.basicDetails.concomitant;
    this.mh = this.basicDetails.medical_history ? this.basicDetails.medical_history : ' ';
    this.mh = this.mh ? this.encodeValue.encodePound(this.mh) : 'Not Available';
    this.showPage = true;

    // this.httpService.change.subscribe(res => this.res = res);

  }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
  }

  /**Method to close the popup window */
  closeModal() {
    this.activeModal.close();
  }

  checkCommentLength(str: string) {
    if (str.length > 1000) {
      this.validationModal.showMessage('Maximum character length allowed for comment is 1000', 'warning');
    }
  }

  /**Method to update comment in narrative page */
  updateIcsrComment(num: any, comment: any) {
    if (comment === '' || comment === undefined || comment.length === 0) {
      this.validationModal.showMessage('Signal Reviewers Comment cannot be empty', 'warning');
      return;
    }

    const res = this.encodeValue.validateComment(comment);
    if (res === false) {
      this.validationModal.showMessage('Comment cannot contain spaces at the begining and end', 'warning');
      return;
    }

    const crossedOrNot = this.encodeValue.checkCommentOrNotCrossedLimit(comment);
    if (crossedOrNot) {
      this.validationModal.showMessage('Maximum character length allowed for comment is 1000', 'warning');
      return;
    }
    this.httpService.UpdateIndividualICSRCommentReport(num, comment).subscribe((data: any) => {
      this.nComment.comment = data.comment_obj;
      this.validationModal.showMessage(data.comment, 'success');
      this.closeModal();
      this.httpService.makeComment(true);
    },
      (error) => {
        /**to find issue */
        this.validationModal.showMessage('comment update issue' + error, 'error');
      }
    );
  }

  Download_icsr() {
    this.narrativeReport.comment = this.narrativeReport.comment.comment;
    const usersJson: any[] = Array.of(this.narrativeReport);
    // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(usersJson);
    // // /* generate workbook and add the worksheet */
    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // //  const wb1: XLSX.WorkBook = XLSX.utils.book_append_sheet;
    // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    // const usersJson2: any[] = Array.of(this.narrativeReport.prod_event_details);
    // const ws1 = XLSX.utils.json_to_sheet(this.narrativeReport.prod_event_details);
    // XLSX.utils.book_append_sheet(wb, ws1, 'Details');
    // XLSX.writeFile(wb, 'CaseDownload.xlsx');

    this.httpService.downloaddetails(window.location.href, 'Case Narrative', 'Excel').subscribe((data: any) => {
      var x = JSON.stringify(data.data);
      var keys = [];
      var res = [];
      var obj = JSON.parse(x);
      for (var i in data.data)
        res.push(obj[i]);
      for (var k in data.data)
        keys.push(k);
      let finalarr = [];
      for (let i = 0; i < keys.length; i++) {
        const onj = {
          'Info': keys[i],// data.data[i],
          'Details': res[i]
        };
        finalarr.push(onj);
      }
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(finalarr);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'User Details');
      const ws1 = XLSX.utils.json_to_sheet(usersJson);
      XLSX.utils.book_append_sheet(wb, ws1, 'Case');
      const ws2 = XLSX.utils.json_to_sheet(this.narrativeReport.prod_event_details);
      XLSX.utils.book_append_sheet(wb, ws2, 'Details');

      XLSX.writeFile(wb, 'Case Narrative.xlsx');
    });
  }



}
