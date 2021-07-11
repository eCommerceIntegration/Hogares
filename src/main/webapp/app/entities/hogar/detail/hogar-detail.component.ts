import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IHogar } from '../hogar.model';

@Component({
  selector: 'jhi-hogar-detail',
  templateUrl: './hogar-detail.component.html',
})
export class HogarDetailComponent implements OnInit {
  hogar: IHogar | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ hogar }) => {
      this.hogar = hogar;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
