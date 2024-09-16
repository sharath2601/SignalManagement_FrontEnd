import { ValidationModal } from './../../helpers/validation-modal';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { HttpService } from 'src/app/services/http.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as XLSX from 'xlsx';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import {
  faPencilAlt,
  faSave,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

import { AuthenticationService } from 'src/app/services/authentication.service';

import * as moment from 'moment';
import { Subject } from 'rxjs';

import { GenericDomainProductFamily } from 'src/app/services/GenericDomainProductFamily';
import { Converter } from 'src/app/helpers/converter';
import { parseJSON } from 'jquery';

@Component({
  selector: 'app-signal-planning',
  templateUrl: './signal-planning.component.html',
  styleUrls: ['./signal-planning.component.css'],
})
export class SignalPlanningComponent implements OnInit {
  faDownload = faDownload;
  faPencilAlt = faPencilAlt;
  faSave = faSave;
  faTimes = faTimes;
  productTypes: any;
  planningData: any;
  productFamily: { id: number; name: string }[];
  selectProductFamily: any;
  selDType: any;
  planningcols: { field: string; header: string }[];
  selectedfamily: boolean;
  periodicity: { id: number; name: string }[];
  isadmin: any;
  data: any;
  constructor(
    private httpService: HttpService,
    private authenticationService: AuthenticationService,
    private ngxLoader: NgxUiLoaderService,
    private converter: Converter,
    private prodFamily: GenericDomainProductFamily,
    private validationModal: ValidationModal
  ) {}

  ngOnInit() {
    // this.ngxLoader.start();
    this.ngxLoader.start();
    this.getProductTypes();
    this.planningcols = [
      { field: 'name', header: 'Name' },
      { field: 'prev_review_period', header: 'Last Review Period' },
      { field: 'periodicity_in_quarters', header: 'Periodicity in Quarters' },
      { field: 'next_quarter', header: 'Next Review Period' },
    ];
    this.periodicity = [
      { id: 0, name: '0 Months/Non Galderma Product' },
      { id: 1, name: '3 Months' },
      { id: 2, name: '6 Months' },
      { id: 3, name: '9 Months' },
      { id: 4, name: '12 Months' },
    ];
    this.productFamily = this.prodFamily.selectProductFamilyType();
    this.selectProductFamily = this.productFamily[0];
    this.showdata();
    // const d = type ? type : 'Drug';
  }

  getProductTypes() {
    this.httpService.GetProductTypes().subscribe(
      (types: any) => {
        const filteredTypes = types.products.filter((items) => {
          return items.count > 500;
        });
        this.productTypes = filteredTypes;
        // console.log(filteredTypes[0]);
        this.selDType = filteredTypes[0].name;
      },
      (error) => {
        /**to find issue */
        this.validationModal.showMessage(
          'planning domain issue ' + error,
          'error'
        );
      }
    );
  }

  showdata() {
    this.isadmin = this.authenticationService.currentUserValue.roles.is_admin;
    if (this.selectProductFamily.name === 'Individual Product') {
      this.selectedfamily = false;
    } else {
      this.selectedfamily = true;
    }
    this.httpService
      .GetPlanningProdDetails(
        this.selDType ? this.selDType : 'Drug',
        this.selectedfamily
      )
      .subscribe(
        (data: any) => {
          this.ngxLoader.stop();
          this.planningData = data.data;
        },
        (error) => {
          this.ngxLoader.stop();
          /**to find issue */
          this.validationModal.showMessage(
            'planning initial issue ' + error,
            'error'
          );
        }
      );
  }
  exportCSV(dt: any) {
    if (dt._totalRecords < 1) {
      this.validationModal.showMessage('No Record found to export', 'info');
      return false;
    }
    const finalarrdata = [];
    const filterval = dt.filteredValue != null ? dt.filteredValue : dt._value;
    for (let i = 0; i < filterval.length; i++) {
      const onj = {
        Name: filterval[i].name,
        'Last Review Period': filterval[i].prev_review_period,
        'Periodicity in Quarters': filterval[i].periodicity_in_quarters,
        'Next Review Period': filterval[i].next_quarter,
      };

      finalarrdata.push(onj);
    }
    this.httpService
      .downloaddetails(window.location.href, 'Signal Planning', 'CSV')
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
          XLSX.writeFile(workbook, 'Signal Planning.csv');
        });
      });
  }
  updatePlanningProd(item: any) {
    const sm = item.signalling_method;
    const pr = this.converter.convert(item.name);
    let per;
    if (item.periodicity_in_quarters === 0) {
      per = 0;
    }
    if (item.periodicity_in_quarters === 1) {
      per = 3;
    } else if (item.periodicity_in_quarters === 2) {
      per = 6;
    } else if (item.periodicity_in_quarters === 3) {
      per = 9;
    } else if (item.periodicity_in_quarters === 4) {
      per = 12;
    }
    // const ty = this.type;

    // if (sm === undefined) {
    //   this.validationModal.showMessage('Please select method and Periodicity', 'warning');
    //   return;
    // }

    this.httpService
      .UpdatePlanningProd(
        this.selDType ? this.selDType : 'Drug',
        this.selectedfamily,
        per,
        'prr',
        pr
      )
      .subscribe(
        (data: any) => {
          this.validationModal.showMessage(data.comment, 'success');
          this.httpService
            .GetPlanningProdDetails(
              this.selDType ? this.selDType : 'Drug',
              this.selectedfamily
            )
            .subscribe(
              (planningdata: any) => {
                this.ngxLoader.stop();
                this.planningData = planningdata.data;
              },
              (error) => {
                this.ngxLoader.stop();
                this.validationModal.showMessage(
                  'planning update issue 1' + error,
                  'error'
                );
              }
            );
          item.is_clicked = !item.is_clicked;
        },
        (error) => {
          item.is_clicked = !item.is_clicked;
          /**to find issue */
          this.validationModal.showMessage(
            'planning update issue 2' + error,
            'error'
          );
        }
      );
  }
  exportExcel() {
    if (this.planningData.length < 1) {
      this.validationModal.showMessage(
        'No records found to download',
        'warning'
      );
      return;
    }

    const finalarr1 = [];
    for (let i = 0; i < this.planningData.length; i++) {
      const onj = {
        Name: this.planningData[i].name,
        'Last Review Period': this.planningData[i].prev_review_period,
        'Periodicity in Quarters': this.planningData[i].periodicity_in_quarters,
        'Next Review Period': this.planningData[i].next_quarter,
      };
      finalarr1.push(onj);
    }
    this.httpService
      .downloaddetails(window.location.href, 'Signal Planning', 'Excel')
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
        XLSX.writeFile(wb, 'Signal Planning.xlsx');
      });

    // import('xlsx').then(xlsx => {
    //     const worksheet = xlsx.utils.json_to_sheet(finalarr);
    //     const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    //     const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    //     this.saveAsExcelFile(excelBuffer, 'SignalEval');
    // });
  }

  // saveAsExcelFile(buffer: any, fileName: string): void {
  //     import('file-saver').then(FileSaver => {
  //         const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  //         const EXCEL_EXTENSION = '.xlsx';
  //         const data: Blob = new Blob([buffer], {
  //             type: EXCEL_TYPE
  //         });
  //         FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  //     });
  // }
}
