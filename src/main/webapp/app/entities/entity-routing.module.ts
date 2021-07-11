import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'hogar',
        data: { pageTitle: 'hogaresApp.hogar.home.title' },
        loadChildren: () => import('./hogar/hogar.module').then(m => m.HogarModule),
      },
      {
        path: 'empleado',
        data: { pageTitle: 'hogaresApp.empleado.home.title' },
        loadChildren: () => import('./empleado/empleado.module').then(m => m.EmpleadoModule),
      },
      {
        path: 'location',
        data: { pageTitle: 'hogaresApp.location.home.title' },
        loadChildren: () => import('./location/location.module').then(m => m.LocationModule),
      },
      {
        path: 'solicitante',
        data: { pageTitle: 'hogaresApp.solicitante.home.title' },
        loadChildren: () => import('./solicitante/solicitante.module').then(m => m.SolicitanteModule),
      },
      {
        path: 'trabajo',
        data: { pageTitle: 'hogaresApp.trabajo.home.title' },
        loadChildren: () => import('./trabajo/trabajo.module').then(m => m.TrabajoModule),
      },
      {
        path: 'task',
        data: { pageTitle: 'hogaresApp.task.home.title' },
        loadChildren: () => import('./task/task.module').then(m => m.TaskModule),
      },
      {
        path: 'region',
        data: { pageTitle: 'hogaresApp.region.home.title' },
        loadChildren: () => import('./region/region.module').then(m => m.RegionModule),
      },
      {
        path: 'pais',
        data: { pageTitle: 'hogaresApp.pais.home.title' },
        loadChildren: () => import('./pais/pais.module').then(m => m.PaisModule),
      },
      {
        path: 'servicio',
        data: { pageTitle: 'hogaresApp.servicio.home.title' },
        loadChildren: () => import('./servicio/servicio.module').then(m => m.ServicioModule),
      },
      {
        path: 'accion',
        data: { pageTitle: 'hogaresApp.accion.home.title' },
        loadChildren: () => import('./accion/accion.module').then(m => m.AccionModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
