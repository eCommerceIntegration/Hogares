import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITrabajo } from '../trabajo.model';

@Component({
  selector: 'jhi-trabajo-detail',
  templateUrl: './trabajo-detail.component.html',
})
export class TrabajoDetailComponent implements OnInit {
  trabajo: ITrabajo | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ trabajo }) => {
      this.trabajo = trabajo;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
