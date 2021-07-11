import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAccion } from '../accion.model';

@Component({
  selector: 'jhi-accion-detail',
  templateUrl: './accion-detail.component.html',
})
export class AccionDetailComponent implements OnInit {
  accion: IAccion | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ accion }) => {
      this.accion = accion;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
