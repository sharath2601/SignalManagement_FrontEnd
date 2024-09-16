import { GenericDomainProductFamily } from 'src/app/services/GenericDomainProductFamily';
import { Observable } from 'rxjs';
import { Pagination } from './../../helpers/pagination';
import { NarrativeCommentUpdate } from './../../models/narrative-comment-update';
import { TableUpdation } from './../../models/table-updation';
import { ValidationModal } from './../../helpers/validation-modal';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { HttpService } from './../../services/http.service';
import { Component, OnInit, Input, DoCheck, ChangeDetectorRef } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomindireportComponent } from '../customindireport/customindireport.component';
import Swal from 'sweetalert2';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SignalTrackUpdate } from 'src/app/models/signal-track-update.model';
import * as moment from 'moment';
import { Converter } from 'src/app/helpers/converter';
import { Encoder } from 'src/app/services/encoder';
import * as XLSX from 'xlsx';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-custom-modal',
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.css']
})
export class CustomModalComponent implements OnInit, DoCheck {

  @Input() modalContent: any;
  currentPage = 1;
  term: any;
  @Input() selectedProduct: any;
  @Input() label: any;
  @Input() type: any;
  @Input() CurrentQOrNot: any;
  @Input() selectedRPCQuarter: any;
  @Input() Productfamily: any;

  icsrList: any;
  isPtClicked = false;
  narrativeReport: any = {};
  IndividualIcsrComment: any;
  indiReport = false;
  @Input() showIcsrModal = false;
  selectedDate;
  @Input() showSignalTrackModal = false;
  @Input() whichPage: any;
  usersList: any = [];
  priorityList = [
    { 'id': 0, 'itemName': 'Grade 1' },
    { 'id': 1, 'itemName': 'Grade 2' },
    { 'id': 2, 'itemName': 'Grade 3' }
  ];
  validationList: any;
  statusList = [
    { 'id': 0, 'itemName': 'ONGOING' },
    { 'id': 1, 'itemName': 'OPEN' },
    { 'id': 2, 'itemName': 'CLOSED' }
  ];
  gradeValidation: any = [];
  selectedPriority: any;
  selectedUser: any;
  selectedValidation: any;
  selectedStatus: any;
  selectAgeGroup: any;
  medicalHistory: any;
  gender: any;
  timeOnset: any;
  reChallenge: any;
  deChallenge: any;
  ageGroups: any = [
    { 'id': 0, 'name': '0-17' },
    { 'id': 1, 'name': '18-64' },
    { 'id': 2, 'name': '64 & above' }
  ];
  genderList = [
    { 'id': 0, 'name': 'Male' },
    { 'id': 1, 'name': 'Female' }
  ];
  challengeList = [
    { 'id': 0, 'name': 'True' },
    { 'id': 1, 'name': 'False' }
  ];
  isCommentUpdated: any;
  selectedValidItem: any;
  statSigCom: any;
  // object from signal detection & variables for detection icsrlist
  @Input() selSigItem: any = {};
  fromDate: any = '';
  toDate: any = '';
  startCount: any;
  endCount: any;
  nextC1: any;
  nextc2: any;
  prevC1: any;
  prevC2: any;
  selQ: any;
  loadData: any;
  qList: any;
  stringifiedQ: any;
  showQuarterDropdown: boolean;
  totalCount: any;
  currentQCount: any;
  reachedEnd: boolean;
  qSel: boolean;

  // object from signal tracking
  @Input() sigTrackData: any = {};
  selGradeReason: any;
  pComment: any;
  nComment: any;
  countryList: any = [];
  selCountry: any;
  donwloadContent: any;
  signalcode: any;
  is_custom: any;
  loadingData: any;
  isProdChanged: any;
  productfamily: any;

  constructor(private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private httpService: HttpService,
    private sigTrackUpdate: SignalTrackUpdate,
    private router: Router,
    private converter: Converter,
    private encodeValue: Encoder,
    private ngxLoader: NgxUiLoaderService,
    private validationModal: ValidationModal,
    private narrativeComment: NarrativeCommentUpdate,
    private rowUpdate: TableUpdation,
    private pagination: Pagination,
    private vList: GenericDomainProductFamily
    ) {
      router.events.subscribe((val) => {
        if (val instanceof NavigationEnd) {
          this.closeModal();
        }
      });
    }


  ngOnInit(): void {
    this.loadingData = false;
    this.qSel = false;

    this.validationList = this.vList.getValidationList();

    this.gradeValidation = [
      { 'id': 1, 'itemName': 'Associated Drug Exposure' },
      { 'id': 2, 'itemName': 'Potential impact on public health' },
      { 'id': 3, 'itemName': 'Rare and Significant' },
      { 'id': 4, 'itemName': 'Potential for serious consequences' },
      { 'id': 5, 'itemName': 'Benefit risk impact' }
    ];

    if (this.showIcsrModal) {
      this.stringifiedQ = 'All';
      this.startCount = 1;
      this.endCount = 50;
      this.getICSRS(this.label, this.stringifiedQ, this.startCount, this.endCount);
      this.nextC1 = this.startCount;
      this.nextc2 = this.endCount;
      this.prevC1 = 0;
      this.getQuarterList();
      // this.selQ = 'Current';
      this.showQuarterDropdown = this.CurrentQOrNot === 'Yes' ? true : false;
      // this.selectedValidItem = 'Did not signal in current quarter';
      this.selectedValidItem = this.selSigItem.short_comment;
      this.totalCount = this.CurrentQOrNot === 'Yes' ? this.selSigItem.current_review_period : this.selSigItem.caseCount;
      this.productfamily = this.Productfamily;

      // this.getCountryList();
    }

    if (this.showSignalTrackModal) {
      this.getUsersList();
      let usermapData;
      if (this.sigTrackData.assigned_to.length > 0) {
        usermapData = this.sigTrackData.assigned_to.map((item) => {
          return item.itemName;
        });
      }
      this.selectedDate = this.sigTrackData.targetDate;
      this.selectedPriority = this.sigTrackData.priority;
      this.pComment = this.sigTrackData.comment.comment ? this.sigTrackData.comment.comment.trim() : '';
      this.selectedUser = usermapData;
      this.selGradeReason = this.sigTrackData.reason.itemName;
      this.selectedStatus = this.sigTrackData.status;
      this.nComment = this.sigTrackData.note;
      this.signalcode = this.sigTrackData.code;
      this.is_custom = this.sigTrackData.is_custom;
      this.productfamily = this.sigTrackData.Productfamily;

    }
    this.reachedEnd = false;
  }

  ngDoCheck() {
    this.httpService.isCommentUpdated
    .pipe(take(1))
    .subscribe(statechange => this.isCommentUpdated = statechange);
    if (this.isCommentUpdated) {
      this.validationModal.showMessage('Please wait while data is updating', 'info');
      this.getICSRS(this.label, this.stringifiedQ, this.startCount, this.endCount);
    }
    this.httpService.makeComment(false);
  }

  /**method to close modal window */
  closeModal() {
    this.activeModal.close();
  }

  checkCommentLength(str: string) {
    if (str.length > 1000) {
      this.validationModal.showMessage('Maximum characters allowed for comment is 1000', 'warning');
      return;
    }
  }

  /**Method to set quarter in any situation */
  setQuarter(currentOrNot: any) {
    currentOrNot = this.CurrentQOrNot;
    let q: any;
    if (currentOrNot === 'Yes') {
      q = this.selectedRPCQuarter;
    } else if (currentOrNot === 'No') {
      switch (this.selQ) {
        case undefined:
          q = 'All';
          break;
        case '':
          q = 'All';
          break;
        default:
          q = this.selQ;
      }
    }
    return q;

  }

  /**method to get icsr's listings */
  getICSRS(ptName: any, quarter: any, startCount: any, endCount: any) {
    this.isProdChanged = this.rowUpdate.prodFamily;
    this.loadingData = true;
    const productName = this.converter.convert(this.selectedProduct);
    const fTy = this.selSigItem.domain;
    const cEve = this.converter.convert(ptName);
    let selectedQuarter: any = this.setQuarter(this.CurrentQOrNot);
    selectedQuarter = this.encodeValue.encodeStr(selectedQuarter);
    if (selectedQuarter === '') {
      selectedQuarter = 'All';
    }

    this.httpService.GetIcsrList(fTy, this.isProdChanged,
       productName, cEve, selectedQuarter, startCount, endCount).subscribe((list: any) => {
      this.icsrList = list.cases;
      this.isPtClicked = true;
      this.showIcsrModal = true;
      this.loadingData = false;
      this.totalCount = list.total_count;
    },
      (error) => {
        this.loadingData = false;
        this.validationModal.showMessage('custom modal icsrlist' + error, 'error');
      }
    );
  }

  /**Method to open narrative window */
  getIndividualNarratvie(id: any, comment: any, index: any) {
    this.narrativeComment.comment = comment;
    this.narrativeComment.aer_number = id;
    this.narrativeComment.rI = index;
    this.ngxLoader.start();
    this.httpService.GetIndividualICSRDetails(id).subscribe((narrative: any) => {
      this.narrativeReport = narrative;
      const obj = {
        label: this.label,
        type: this.selSigItem.domain,
        cOrNot: this.CurrentQOrNot,
        isDetOrNot: this.showIcsrModal,
        product: this.selSigItem.product,
        item: this.selSigItem
      };
      const ref = this.modalService.open(CustomindireportComponent, { size: 'xl', scrollable: true });
      ref.componentInstance.narrativeReport = this.narrativeReport;
      ref.componentInstance.icsrItem = obj;
      ref.componentInstance.fromWhichPage = true;
      this.ngxLoader.stop();
    },
      (error) => {
        this.ngxLoader.stop();
        this.validationModal.showMessage('narrative page issue' + error, 'error');
      }
    );
  }

  /**on text change of note in modal window */
  onTextChange(value: any) {
    if (value.length > 1) {
      const val = this.encodeValue.validateComment(value);
      if (!val) {
        this.validationModal.showMessage('Note cannot contain spaces at the begining and end', 'warning');
      }
    }
  }

  /*Method to update signal report in tracking & planning page */
  updateSignal(comment: string, priority: any, user: any, status: any, reason: any, date: string) {
    const reasonId = this.gradeValidation.find(i => i.itemName === reason) ;

    const userId = [];

    let usermapData: any;
    if (user !== undefined) {
      for (let i = 0; i < user.length; i++) {
        userId.push(this.usersList.find(j => j.itemName === user[i]));
      }
      usermapData = userId.map((item) => {
        return item.id;
      });
    } else {
      usermapData = ['NA'];
    }

    const res = this.encodeValue.validateComment(comment);
    const crossedOrNot = this.encodeValue.checkCommentOrNotCrossedLimit(comment);

    if (comment.length >= 1) {
      if (res === false) {
        this.validationModal.showMessage('Note cannot contain spaces at the begining and end', 'warning');
        return;
      }
    }

    if (crossedOrNot) {
      this.validationModal.showMessage('Maximum characters allowed for note is 1000', 'warning');
      return;
    }

    this.ngxLoader.start();
    // if (comment == '' || comment.match(/^\s*$/)) {
    //   this.validationModal.showMessage('Note cannot be empty', 'warning');
    //   this.ngxLoader.stop();

    //   return;
    // }

    //  if(comment.length > 1)
    //  {
    this.sigTrackUpdate.comment = comment.trim();
    //  }
    this.sigTrackUpdate.priority = priority;
    this.sigTrackUpdate.user = usermapData.length < 1 ? 'NA' : usermapData.toString();
    this.sigTrackUpdate.targetDate = date;
    // this.sigTrackUpdate.signalId = selectedSignalId;
    this.sigTrackUpdate.reason = reasonId ? reasonId.id : '-1';
    this.sigTrackUpdate.status = status;
    this.sigTrackUpdate.isPt = this.sigTrackData.is_pt;
    this.sigTrackUpdate.signalId = this.sigTrackData.id;
    this.sigTrackUpdate.isCustom = this.sigTrackData.is_custom;

    this.httpService.UpdateSignal(this.sigTrackUpdate).subscribe((data: any) => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/signal-tracking']);
      });
      this.ngxLoader.stop();
      if (data.comment === 'Please assign and complete the evaluation report, before closing the signal') {
        this.validationModal.showMessage(data.comment, 'warning');
      } else if (data.comment === 'Please close the evaluation report, before closing the signal') {
        this.validationModal.showMessage(data.comment, 'warning');
      } else {
        this.validationModal.showMessage(data.comment, 'success');
      }

      this.activeModal.close();
    },
      (error) => {
        this.ngxLoader.stop();
        this.validationModal.showMessage('tracking signal update ' + error, 'error');
      });

  }

  /*Method to get users list */
  getUsersList() {
    this.httpService.GetUsersList().subscribe((data: any) => {
      this.usersList = data.users;
    },
      (error) => {
        this.ngxLoader.stop();
        this.validationModal.showMessage('tracking userlist issue ' + error, 'error');
      }
    );
  }

  async deleteValidSignal() {
    const { value: text } = await Swal.fire({
      input: 'textarea',
      title: 'Comment',
      text: 'Please write the reason why you want to delete the Signal.',
      inputPlaceholder: 'Write Comment',
      inputAttributes: {
        'aria-label': 'Type your message here'
      },
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write comment!';
        }
      }
    });

    if (text) {
      const model = {
        code: this.signalcode,
        is_custom: this.is_custom,
        comment: text
      };
      this.httpService.DeletevalidateSignal(model).subscribe((data: any) => {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/signal-tracking']);
        });
        this.activeModal.close();
        if (data.comment === 'Could not delete Signal as it already has some reports') {
          this.validationModal.showMessage(data.comment, 'warning');
        } else {
          this.validationModal.showMessage(data.comment, 'success');
        }
      },
        (error) => {
          this.validationModal.showMessage('delete signal issue ' + error, 'error');
        }
      );
    }
  }

  downloadAllCases(domain: any, qtr: any, pro: any, event: any) {
    let cq ;
    if (!this.showQuarterDropdown) {
      cq = qtr ? this.encodeValue.encodeStr(qtr) : 'All';
    } else {
     cq = this.selectedRPCQuarter;
    }
    this.validationModal.showMessage('It will take some time to download', 'info');

    // this.httpService.DownloadCaseCount(domain, false, cq, pro, event).subscribe((data: any) => {
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
    this.httpService.DownloadCaseCount(domain,  this.productfamily, cq, pro, event,
      'SignalDetection Download All Cases', window.location.href).subscribe(data => {
      const blob = new Blob([data], {
        type: 'application/zip'
      });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }

  /*Method to automatically set target date upon selection of priority */
  onItemSelect(item: any) {
    let dt: any = this.sigTrackData.validation_date;
    switch (item) {
      case 'Grade 1':
        dt = moment.utc(dt).add(30, 'd').format('DD-MMM-YYYY');
        break;
      case 'Grade 2':
        dt = moment.utc(dt).add(60, 'd').format('DD-MMM-YYYY');
        break;
      case 'Grade 3':
        dt = moment.utc(dt).add(120, 'd').format('DD-MMM-YYYY');
        break;
    }

    this.selectedDate = dt;
  }

  /**update method for comment in icsrlist page from detection page */
  updateStatSig(c: any, s: any) {
    let item: any;
    if (s === undefined || s === '') {
      item = this.validationList.find(i => i.itemName === 'Validation in Progress');
    } else if (s === 'Did not signal in current quarter') {
      item = { id: -2, itemName: 'Did not signal in current quarter' };
    } else {
      item = this.validationList.find(i => i.itemName === s);
    }

    if (c.comment === undefined || c.comment.length  < 1) {
      this.validationModal.showMessage('Comment cannot be empty', 'warning');
      return;
    }

    const res = this.encodeValue.validateComment(c.comment);
    if (res === false && c.comment.length < 1) {
      this.validationModal.showMessage('Comment either empty or contain spaces at the begining and end', 'warning');
      return;
    }

    const crossedOrNot = this.encodeValue.checkCommentOrNotCrossedLimit(c.comment);
    if (crossedOrNot) {
      this.validationModal.showMessage('Maximum 1000 characters allowed for comment', 'warning');
      return;
    }

    const m = {
      signalId: this.selSigItem.signal_id,
      comment: c.comment,
      isPt: this.selSigItem.is_pt,
      isValid: item.id
    };

    this.httpService.UpdateStatisticalSignal(m).subscribe((data: any) => {
      this.rowUpdate.short_comment = data.short_comment;
      this.rowUpdate.statSigComment = data.statSigComment;
      this.httpService.nextChange(true);
      this.activeModal.close();
      this.validationModal.showMessage(data.comment, 'success');
    },
      (error) => {
        this.validationModal.showMessage('icsr signal update issue ' + error, 'error');
      }
    );
  }

  onQuarterChange(selectedQuarter: any) {
    this.qSel = true;
    this.stringifiedQ = this.encodeValue.encodeStr(this.stringifiedQ);
    // tslint:disable-next-line: no-unused-expression
    this.stringifiedQ === '' ? 'All' : this.stringifiedQ;

    this.getICSRS(this.label, this.stringifiedQ, 1, 50);
  }


  countLessThanReq(num: any) {
    const t = num < 50 ? true : false;
    return t;
  }

  /**method to get cases list based on number */
  getSet(c1: any, c2: any, whichSet: string) {
    switch (whichSet) {
      // case 'first':
      //   this.startCount = this.startCount + c1;
      //   this.endCount = this.endCount + c2;
      //   this.nextC1 = this.startCount;
      //   this.nextc2 = this.endCount;
      //   const fromD = moment.utc(this.fromDate).format('DD-MMM-YYYY');
      //   const toD = moment.utc(this.toDate).format('DD-MMM-YYYY');
      //   // tslint:disable-next-line: no-unused-expression
      //   fromD === undefined || '' ? 'NA' : fromD;
      //   // tslint:disable-next-line: no-unused-expression
      //   toD === undefined || '' ? 'NA' : toD;
      //   this.getICSRS(this.label, this.stringifiedQ, this.startCount, this.endCount);
      //   break;
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
        const fD = moment.utc(this.fromDate).format('DD-MMM-YYYY');
        const tD = moment.utc(this.toDate).format('DD-MMM-YYYY');
        this.currentPage = this.currentPage + 1;
        const getEndPage = this.pagination.getEndPage(this.totalCount, 50);
        const remItems = this.pagination.getRemainingItems(this.totalCount, 50);
        if (this.currentPage === getEndPage) {
          if (this.pagination.remainingItemsExist(this.totalCount, 50)) {
            this.endCount = (this.endCount - 50) + remItems;
          }
          this.reachedEnd = true;
        }
        this.getICSRS(this.label, this.stringifiedQ, this.nextC1, this.nextc2);
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
        const frD = moment.utc(this.fromDate).format('DD-MMM-YYYY');
        const tDa = moment.utc(this.toDate).format('DD-MMM-YYYY');
        this.currentPage = this.currentPage - 1;
        this.reachedEnd = false;
        this.getICSRS(this.label, this.stringifiedQ, this.prevC1, this.prevC2);
        break;
    }
  }

  /**method to get available quarters list */
  getQuarterList() {
    this.loadData = true;
    this.httpService.GetAvailableQaurters().subscribe((quarters: any) => {
      this.qList = quarters.data;
      this.loadData = false;
    },
    (error) => {
      this.loadData = false;
      this.validationModal.showMessage('icsrlist qlist ' + error, 'error');
    }
    );
  }
}
