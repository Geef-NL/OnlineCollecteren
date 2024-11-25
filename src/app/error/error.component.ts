import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  public error;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.error = this.route.snapshot.params.error ?? this.route.snapshot.data.error;
  }

}
