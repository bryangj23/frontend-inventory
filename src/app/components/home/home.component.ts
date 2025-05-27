import { ButtonModule } from 'primeng/button';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductResponseDto } from '../../models/api-inventory/product';
import { ProductService } from '../../services/product/product.service';
import { Router, RouterModule } from '@angular/router';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { SharedModule } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { UserResponseDto } from '../../models/api-user/user';
import { UserService } from '../../services/user/user.service';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule, RouterModule,
    DropdownModule,
    InputTextModule,
    FormsModule,
    CommonModule,
    DialogModule,
    SharedModule,
    ButtonModule,
    TabViewModule,
    TableModule,
    CardModule,
    TooltipModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  products: ProductResponseDto[] = [];
  userList: UserResponseDto[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private readonly productService: ProductService,
    private readonly userService: UserService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadProducts(): void {
    this.productService
      .getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => (this.products = data),
        error: (err) => console.error('Error fetching products', err),
      });
  }

  private loadUsers(): void {
    this.userService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => (this.userList = users),
        error: (err) => console.error('Error fetching users', err),
      });
  }

  getUserLabel(userId: number): string {
    return this.userList.find((user) => user.id === userId)?.email ?? '--';
  }

  redirectToEdit(product: ProductResponseDto): void {
    this.router.navigate([`product-form/${product.id}`]);
  }

  redirectToDelete(product: ProductResponseDto): void {
    this.router.navigate([`product-form/${product.id}/delete`]);
  }

  redirectToMovements(product: ProductResponseDto): void {
    this.router.navigate([`product-movement/${product.id}`]);
  }
}
