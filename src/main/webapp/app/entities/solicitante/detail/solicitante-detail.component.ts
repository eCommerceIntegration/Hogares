import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISolicitante } from '../solicitante.model';

@Component({
  selector: 'jhi-solicitante-detail',
  templateUrl: './solicitante-detail.component.html',
})
export class SolicitanteDetailComponent implements OnInit {
  solicitante: ISolicitante | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ solicitante }) => {
      this.solicitante = solicitante;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
