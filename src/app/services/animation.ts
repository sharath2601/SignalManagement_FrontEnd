import { trigger, transition, style, query, animateChild, group, animate } from '@angular/animations';

export const slideInAnimation = trigger('routeAnimations', [
  transition('Dashboard <=> Trends', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ]),
    query(':enter', [
      style({ left: '-100%'})
    ]),
    query(':leave', animateChild()),
    group([
      query(':leave', [
        animate('1000ms ease-out', style({ left: '100%'}))
      ]),
      query(':enter', [
        animate('1000ms ease-out', style({ left: '0%'}))
      ])
    ]),
    query(':enter', animateChild()),
  ])
]);

export const slideInAnimation1 = trigger('routeAnimations', [
  transition('Trends <=> PEcombo', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ]),
    query(':enter', [
      style({ left: '-100%'})
    ]),
    query(':leave', animateChild()),
    group([
      query(':leave', [
        animate('1000ms ease-out', style({ left: '100%'}))
      ]),
      query(':enter', [
        animate('1000ms ease-out', style({ left: '0%'}))
      ])
    ]),
    query(':enter', animateChild()),
  ])
]);

export const slideInAnimation2 = trigger('routeAnimations', [
  transition('Dashboard <=> PEcombo', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ]),
    query(':enter', [
      style({ left: '-100%'})
    ]),
    query(':leave', animateChild()),
    group([
      query(':leave', [
        animate('1000ms ease-out', style({ left: '100%'}))
      ]),
      query(':enter', [
        animate('1000ms ease-out', style({ left: '0%'}))
      ])
    ]),
    query(':enter', animateChild()),
  ])
]);


