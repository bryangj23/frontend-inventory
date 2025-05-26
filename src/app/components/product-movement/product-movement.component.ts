import { AlertService } from './../../services/message/alert.service';
import { Component } from '@angular/core';
import { ProductMovementResponseDto } from '../../models/api-inventory/product-movement/product-movement';
import { UserResponseDto } from '../../models/api-user/user';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { ProductMovementService } from '../../services/product-movement/product-movement.service';
import { MessageService, SharedModule } from 'primeng/api';
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
export class ProductMovementComponent {

  productMovements: ProductMovementResponseDto[] = [];
  userList: UserResponseDto[] = [];
  productFind?: ProductResponseDto;

  constructor(
    private productService: ProductService,
    private productMovementService: ProductMovementService,
    private router: Router,
    private userService: UserService,
    private activateRoute: ActivatedRoute,
    private alertService: AlertService){}

  ngOnInit() {

    let id = this.activateRoute.snapshot.paramMap.get('productId');

    this.getUsers();
    this.getProductById(+id!);
    this.getAllProductMovements(+id!);
  }

  getProductById(id: number){
    this.productService.getProductById(id).subscribe({
      next:(foundProduct) => {
        this.productFind = foundProduct;
      },
      error: () => {
        this.router.navigateByUrl('/');
      }
    });
  }


    formatLabel(type: MovementTypes): string {
      switch (type) {
        case MovementTypes.INPUT:
          return 'Entrada';
        case MovementTypes.OUTPUT:
          return 'Salida';
        default:
          return type;
      }
    }

    getAllProductMovements(productId: number){
      this.productMovementService.getProductMovements(productId).subscribe((data) => {
        this.productMovements = data;
        if(data.length == 0){
          this.alertService.showInfoMessage({message: 'No se encontraron movimientos para el producto'})
        }
      })
    }

    getUsers(){
      this.userService.getUsers().subscribe({
        next:(foundUsers) => {
          this.userList = foundUsers;
        }
      });
    }

    redirectEdit(productMovement: ProductMovementResponseDto) {
      this.router.navigate([`product-movement-form/${productMovement.productId}/movement/${productMovement.id}`,]);
    }

    redirectDelete(productMovement: ProductMovementResponseDto) {
      this.router.navigate([`product-movement-form/${productMovement.productId}/movement/${productMovement.id}/delete`,]);
    }

    getUserLabel(userId: number){
      return this.userList.find(user => user.id == userId)?.email ?? '- -';
    }

  }
