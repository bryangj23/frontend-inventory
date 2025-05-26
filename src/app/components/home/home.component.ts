import { ProductRequestDto } from './../../models/api-inventory/product';
import { ButtonModule } from 'primeng/button';
import { Component, OnInit } from '@angular/core';
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
export class HomeComponent implements OnInit {

  products: ProductResponseDto[] = [];
  product?: ProductResponseDto;
  productNew?: ProductRequestDto;

  userList: UserResponseDto[] = [];

  constructor(private productService: ProductService,
  private router: Router,
  private userService: UserService){}


  ngOnInit(): void {
    this.getAllProducts();
    this.getUsers();
  }

  getAllProducts(){
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
    })
  }

  getUsers(){
    this.userService.getUsers().subscribe({
      next:(foundUsers) => {
        this.userList = foundUsers;
      }
    });
  }

  redirectEdit(product: ProductResponseDto) {
    this.router.navigate([`product-form/${product.id}`,]);
  }

  redirectDelete(product: ProductResponseDto) {
    this.router.navigate([`product-form/${product.id}/delete`,]);
  }

  redirectMovements(product: ProductResponseDto) {
    this.router.navigate([`product-movement/${product.id}`,]);
  }

  getUserLabel(userId: number){
    return this.userList.find(user => user.id == userId)?.email ?? '- -';
  }

}
