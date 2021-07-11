import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IServicio } from '../servicio.model';

@Component({
  selector: 'jhi-servicio-detail',
  templateUrl: './servicio-detail.component.html',
})
export class ServicioDetailComponent implements OnInit {
  servicio: IServicio | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ servicio }) => {
      this.servicio = servicio;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
