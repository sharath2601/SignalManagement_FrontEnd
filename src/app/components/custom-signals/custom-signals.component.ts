import { CustomModalComponent } from './../custom-modal/custom-modal.component';
import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from 'src/app/services/http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-custom-signals',
  templateUrl: './custom-signals.component.html',
  styleUrls: ['./custom-signals.component.css']
})
export class CustomSignalsComponent implements OnInit {

  signalsData: any = [];
  @Input()howMany: any;
  @Input() reportId: any;
  @Input() sectionId: any;
  enteredComment: any;
  lastComment;
  allSectionPcomments: any;


  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private httpService: HttpService
  ) { }

  ngOnInit(): void {
   this.getAllComments(this.sectionId, this.reportId);
   this.getLatestComment();
  }

  saveComment(c: any) {
    // this.httpService.SaveComment(this.reportId, c, this.sectionId).subscribe((data: any) => {
    //   Swal.fire({
    //     text: data.comment,
    //     icon: 'success',
    //     confirmButtonText: 'Ok'
    //   });
    //   this.closeModal();
    // },
    // (error) => {
    //   Swal.fire({
    //     text: error,
    //     icon: 'error',
    //     confirmButtonText: 'Ok'
    //   });
    // }
    // );
  }

  getLatestComment() {
    // this.httpService.GetLatestComments(this.reportId).subscribe((data: any) => {
    //   console.log('lat-comments: ', data.comments);
    //   this.lastComment = data.comments;
    // },
    // (error) => {
    //   Swal.fire({
    //     text: error,
    //     icon: 'error',
    //     confirmButtonText: 'Ok'
    //   });
    // }
    // );
  }

  getAllComments(sId: any, rId: any) {
    // this.httpService.GetComments(sId, rId).subscribe((data: any) => {
    //   console.log('all-comments: ', data);
    //   this.allSectionPcomments = data.comments;
    // },
    // (error) => {
    //   Swal.fire({
    //     text: error,
    //     icon: 'error',
    //     confirmButtonText: 'Ok'
    //   })
    // }
    // );
  }

  displaySpecifiedSignals() {
  }

  closeModal() {
    this.activeModal.close();
  }
}
