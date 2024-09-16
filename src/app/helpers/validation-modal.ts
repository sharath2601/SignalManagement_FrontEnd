import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ValidationModal {
    showMessage(msg: string, i: SweetAlertIcon) {
        Swal.fire({
            text: msg,
            showConfirmButton: false,
            timer: 5000,
            icon: i
        });
    }
}
