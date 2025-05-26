import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ProductMovementComponent } from './components/product-movement/product-movement.component';
import { ProductMovementFormComponent } from './components/product-movement/product-movement-form/product-movement-form.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Pagina de inicio'
  },
  {
    path: 'product-form/:id',
    component: ProductFormComponent,
    title: 'Formulario de productos'
  },
  {
    path: 'product-form/:id/delete',
    component: ProductFormComponent,
    title: 'Formulario de productos'
  },
  {
    path: 'product-movement/:productId',
    component: ProductMovementComponent,
    title: 'Productos movimientos'
  },
  {
    path: 'product-movement-form/:productId/movement/:productMovementId',
    component: ProductMovementFormComponent,
    title: 'Formulario de movimientos'
  },
  {
    path: 'product-movement-form/:productId/movement/:productMovementId/delete',
    component: ProductMovementFormComponent,
    title: 'Formulario de movimientos'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }

];
