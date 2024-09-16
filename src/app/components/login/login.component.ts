import { MessageService } from './../../services/message-service';
import { PasswordVerification } from './../../models/password-verification.model';
import { Component, OnInit, Output, EventEmitter, Input, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  @Output() isLogged = new EventEmitter();
  status = false;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private passwordVerify: PasswordVerification,
    private messageService: MessageService,
    private authenticationService: AuthenticationService) {
      if (this.authenticationService.currentUserValue) {
        this.router.navigate(['/dashboard-cont']);
      }
    }

  get f() { return this.loginForm.controls; }


  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      isChecked: ['']

      // Validators.minLength(8), Validators.maxLength(16)
    });

    // get return url from route parameters or default to '/'
    this.returnUrl =  '/';
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    const statusCheck = this.f.isChecked.value ? 'Yes' : 'No';

    this.loading = true;
    this.authenticationService.login(this.f.userName.value, this.f.password.value, statusCheck)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.comment) {
            this.loading = false;
            this.error = data.comment + ' other sessions';
          } else {
            this.loading = false;
            this.status = true;
            this.isLogged.emit(status);
            this.router.navigate(['/dashboard-cont']);
            this.router.navigate(['/dashboard-cont']);
          }
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }

  navigateToPasswordReset(toShow: boolean, nav: any) {
    this.passwordVerify.showPasswordLayout = toShow;
    this.router.navigate([nav]);
  }

  changeState() {
    /**statement to check automatically on click of text next to the checkbox */
    this.f.isChecked.setValue(!this.f.isChecked.value);
  }

}
