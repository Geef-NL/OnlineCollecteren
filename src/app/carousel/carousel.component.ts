import {Component, Input, OnInit} from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {

  @Input()
  images = [];

  constructor() {
  }

  ngOnInit(): void {
    $('.carousel').carousel({
      interval: 10000,
      ride: 'carousel'
    });
  }

}
