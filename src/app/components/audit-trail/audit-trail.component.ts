import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpService } from 'src/app/services/http.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import * as XLSX from 'xlsx';
import { ValidationModal } from './../../helpers/validation-modal';

@Component({
  selector: 'app-audit-trail',
  templateUrl: './audit-trail.component.html',
  styleUrls: ['./audit-trail.component.css']
})
export class AuditTrailComponent implements OnInit {
  logRows = [];
  searchTypes: string[] = ['By Count', 'By Date' ];
  selectedSearch = 'By Count';
  isType = false;
  from;
  to;
  fromDate;
  toDate;
  term: any;
  currentPage = 1;
  auditcols: any;
  constructor(private httpService: HttpService,
    private validationModal: ValidationModal,
    private ngxLoader: NgxUiLoaderService) { }

  ngOnInit() {
    // this.ngxLoader.start();
    this.getAuditTrailLogs('count', 0, 100000);
    this.auditcols = [
      { field: 'user', header: 'User' },
      { field: 'method', header: 'Nodule' },
      { field: 'date', header: 'Date/Time (in GMT)' },
      { field: 'comment', header: 'Description' },
      // { field: 'Comment', header: 'Comments' }

  ];
  }

  /*Method to get logs of current user */
  getAuditTrailLogs(type: string, from: any, to: any) {
    this.ngxLoader.start();
    this.httpService.GetAuditTrail('Count', from, to).subscribe((data: any) => {
      data.records.forEach(element => {
        element.complete_time = moment.utc(element.complete_time).format('HH:mm:ss');
        this.ngxLoader.stop();
      });
      this.logRows = data.records;
    }, (error) => {
      this.ngxLoader.stop();
      this.validationModal.showMessage('audit trail issue ' + error, 'error');
    });
    // this.ngxLoader.stop();
  }

  radioChange(item: any) {
    this.isType = item.value === 'By Date' ? true : false;
  }
  exportCSV(dt: any) {
    if(dt._totalRecords < 1)
    {
      this.validationModal.showMessage('No Record found to export', 'info');
      return false;
    }
    let finalarrdata = [];
    const filterval = dt.filteredValue != null ? dt.filteredValue : dt._value;
    for (let i = 0; i < filterval.length; i++) {
      const onj = {
        'User': filterval[i].user,
        'Method': filterval[i].method,
        'DateTime': filterval[i].date+filterval[i].complete_time,
        'Next Review Period': filterval[i].comment,
      };

      finalarrdata.push(onj);
    }
    this.httpService.downloaddetails(window.location.href, 'Audit Trail', 'CSV').subscribe((data: any) => {
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
      import('xlsx').then(xlsx => {
        var worksheet = XLSX.utils.json_to_sheet(finalarr, { skipHeader: false });
        XLSX.utils.sheet_add_json(worksheet, finalarrdata, { skipHeader: false, origin: "A11" });
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        XLSX.utils.book_append_sheet(workbook, worksheet, 'test')
        XLSX.writeFile(workbook, 'Audit Trail.csv')
      });
    });
  }

}
