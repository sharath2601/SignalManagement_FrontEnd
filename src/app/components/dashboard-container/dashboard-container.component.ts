import { slideInAnimation1, slideInAnimation2 } from './../../services/animation';
import { Router, ActivatedRoute, RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { slideInAnimation } from 'src/app/services/animation';

@Component({
  selector: 'app-dashboard-container',
  templateUrl: './dashboard-container.component.html',
  styles: [],
  animations: [
    slideInAnimation,
    slideInAnimation1,
    slideInAnimation2
  ]
})
export class DashboardContainerComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  showDashboard() {
    this.router.navigate(['dashboard'], {relativeTo: this.route});
  }

  showTrends() {
    this.router.navigate(['trends'], {relativeTo: this.route});
  }

  showProductEvent() {
    this.router.navigate(['product-event'], {relativeTo: this.route});
  }

}
