import { Routes } from '@angular/router';
import { ProductListComponent } from './products/product-list.component';
import { ProductDetailComponent } from './products/product-detail.component';
import { LoginComponent } from './login.component';
import { ProductFormComponent } from './products/product-form.component';
import { CategoryListComponent } from './categories/category-list.component';
import { CategoryFormComponent } from './categories/category-form.component';
import { BrandListComponent } from './brands/brand-list.component';
import { BrandFormComponent } from './brands/brand-form.component';
import { CartComponent } from './cart/cart.component';

export const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'product/new', component: ProductFormComponent },
  { path: 'product/:id/edit', component: ProductFormComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'categories', component: CategoryListComponent },
  { path: 'categories/new', component: CategoryFormComponent },
  { path: 'categories/:id/edit', component: CategoryFormComponent },
  { path: 'brands', component: BrandListComponent },
  { path: 'brands/new', component: BrandFormComponent },
  { path: 'brands/:id/edit', component: BrandFormComponent },
  { path: 'cart', component: CartComponent },
  { path: 'login', component: LoginComponent }
];
