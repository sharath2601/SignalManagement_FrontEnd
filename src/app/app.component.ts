import { ValidationModal } from 'src/app/helpers/validation-modal';
import { Component, DoCheck, HostListener } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import * as $ from 'jquery';
import { ConnectionService } from 'ng-connection-service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
// tslint:disable-next-line: max-line-length
export class AppComponent implements DoCheck {

  title = 'MaiSignal';
  show = true;
  isLoggedInStatus = false;
  status: string;
  isConnected = true;


  constructor(private authenticationService: AuthenticationService,
    private connectionService: ConnectionService,
    private validationModal: ValidationModal) {
  }

  ngDoCheck() {
    if (this.authenticationService.currentUserValue) {
      this.isLoggedInStatus = true;
    } else {
      this.isLoggedInStatus = false;
    }

    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (!this.isConnected) {
        this.validationModal.showMessage('DisConnected!, Please check your internet Connection', 'warning');
      } else {
        this.validationModal.showMessage('Back Online', 'success');
      }
    });
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }

}
