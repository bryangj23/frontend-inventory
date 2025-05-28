import { AlertService } from './../../services/message/alert.service';
import { Component, OnInit } from '@angular/core';
import { ProductMovementResponseDto } from '../../models/api-inventory/product-movement/product-movement';
import { UserResponseDto } from '../../models/api-user/user';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { ProductMovementService } from '../../services/product-movement/product-movement.service';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { ProductResponseDto } from '../../models/api-inventory/product';
import { ProductService } from '../../services/product/product.service';
import { MovementTypes } from '../../shared/movement-types.enum';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-movement',
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
  templateUrl: './product-movement.component.html',
  styleUrl: './product-movement.component.scss'
})
export class ProductMovementComponent implements OnInit {

  FILTERS_ACTIVE = 'active==true';
  records: ProductMovementResponseDto[] = [];
  userOptions: UserResponseDto[] = [];
  currentProduct?: ProductResponseDto;

  filterRegisteredByUserId: number | null = null;

  constructor(
    private productSvc: ProductService,
    private movementSvc: ProductMovementService,
    private readonly userService: UserService,
    private router: Router,
    private userSvc: UserService,
    private route: ActivatedRoute,
    private alertSvc: AlertService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('productId');
    if (!id) {
      this.router.navigateByUrl('/');
      return;
    }

    const productId = +id;

    this.fetchUsers();
    this.fetchProductDetails(productId);
    this.fetchMovementsByProduct(productId);
  }

  private fetchProductDetails(productId: number): void {
    this.productSvc.getProductById(productId).subscribe({
      next: (data) => {
        this.currentProduct = data;
      },
      error: () => {
        this.router.navigateByUrl('/');
      }
    });
  }

  filterProducts(): void {
      const filters: string[] = [];

      if (this.filterRegisteredByUserId) {
        filters.push(`userId==${this.filterRegisteredByUserId}`);
      }

      filters.push(this.FILTERS_ACTIVE)

      this.fetchMovementsByProduct(this.currentProduct?.id ?? 0, filters.join(';'));
  }


  private fetchMovementsByProduct(productId: number, filters?: string): void {
    this.movementSvc.getProductMovements(productId, filters ?? this.FILTERS_ACTIVE).subscribe({
      next: (data) => {
        this.records = data.filter(item => item.active == true);
        if (data.length === 0) {
          this.alertSvc.showInfoMessage({
            message: 'No se encontraron movimientos para el producto'
          });
        }
      }
    });
  }

  clearFilters(): void {
    this.filterRegisteredByUserId = null;
    this.fetchMovementsByProduct(this.currentProduct?.id ?? 0);
  }

  private fetchUsers(): void {
    this.userSvc.getUsers().subscribe({
      next: (users) => {
        this.userOptions = users;
      }
    });
  }

  formatMovementLabel(type: MovementTypes): string {
    switch (type) {
      case MovementTypes.INPUT:
        return 'Entrada';
      case MovementTypes.OUTPUT:
        return 'Salida';
      default:
        return type;
    }
  }

  resolveUserEmail(userId: number): string {
    return this.userOptions.find(user => user.id === userId)?.email ?? '- -';
  }

  navigateToEdit(record: ProductMovementResponseDto): void {
    this.router.navigate([
      `product-movement-form/${record.productId}/movement/${record.id}`
    ]);
  }

  navigateToDelete(record: ProductMovementResponseDto): void {
    this.router.navigate([
      `product-movement-form/${record.productId}/movement/${record.id}/delete`
    ]);
  }
}
