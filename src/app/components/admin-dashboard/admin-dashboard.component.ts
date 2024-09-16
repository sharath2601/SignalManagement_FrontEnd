import { ValidationModal } from './../../helpers/validation-modal';
import { Component, OnInit  } from '@angular/core';
import Swal from 'sweetalert2';
import { HttpService } from 'src/app/services/http.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as XLSX from 'xlsx';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  /**variables declaration starts here */
  userRows = [];
  userColumns = [];
  isEditable = false;
  submitted = false;
  faDownload = faDownload;
  isAdmin: any;
  selDType: any;
  domains: any;
  planningData: any;
  productTypes: any;
  isUpdated: any;
  recId: any;

  /**variables declaration ends here */

  constructor(private httpService: HttpService,
    private ngxLoader: NgxUiLoaderService,
    private authService: AuthenticationService,
    private validationModal: ValidationModal
  ) {
  }


  ngOnInit() {
    if (this.authService.currentUserValue.roles !== undefined) {
      if (this.authService.currentUserValue.roles.is_admin) {
        this.isAdmin = true;
      }
    }
    this.getUsers();
    // this.getProductTypes();
    // this.showPlanning(this.selDType);
  }

  getProductTypes() {
    this.httpService.GetProductTypes().subscribe((types: any) => {
      const filteredTypes = types.products.filter((items) => {
        return items.count > 500;
      });
      this.productTypes = filteredTypes;
    },
      (error) => {
        /**to find d issue */
       this.validationModal.showMessage('admin dash domain issue ' + error, 'error');
      }
    );
  }

  /*Method to get list of users for admin*/
  getUsers() {
    this.ngxLoader.start();
    this.httpService.GetUsers().subscribe((data: any) => {
      this.ngxLoader.stop();
      this.userRows = data.users_details;
    },
      (error) => {
        this.ngxLoader.stop();
        /**to find d issue */
        this.validationModal.showMessage('users issue in adm' + error, 'error');
      }
    );
  }

  /**method for signal planning */
  showPlanning(type: any) {
    this.ngxLoader.start();
    const d = type ? type : 'Drug';
    // this.httpService.GetPlanningProdDetails(d).subscribe((data: any) => {
    //   this.ngxLoader.stop();
    //   this.planningData = data.data;
    // },
    // (error) => {
    //   this.ngxLoader.stop();
    //   this.validationModal.showMessage(error, 'error');
    // }
    // );
  }

  showdatamining() {
    Swal.fire({
      text: 'This will halt the application. Do you want to continue ?',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.startDataMiningRun();
        Swal.fire({
          text: 'You will receive a notification once activity is completed',
          icon: 'info',
          showConfirmButton: true,
          confirmButtonText: 'Ok'
        });
      }
    });
  }

  startDataMiningRun() {
    this.httpService.RunDataMining().subscribe((data: any) => {
      this.validationModal.showMessage(data.comment, 'success');
    },
    (error) => {
      /**to find d issue */
      this.validationModal.showMessage('data mining run issue ' + error, 'error');
    });
  }

  changeTableData(d: any) {
    // this.httpService.GetPlanningProdDetails(d).subscribe((data: any) => {
    //   this.planningData = data.data;
    // },
    // (error) => {
    //   this.validationModal.showMessage(error, 'error');
    // }
    // );
  }


  /*To download the table in excel*/
  download() {
    const filList = this.userRows.map(item => {
      delete item.isClicked;
      return item;
    });
    const headers = ['id', 'username', 'email', 'is_current_user', 'name', 'is_admin', 'is_safety_group', 'is_manager', 'is_active'];
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filList, { header : headers});

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'Users.xlsx');
  }

}
