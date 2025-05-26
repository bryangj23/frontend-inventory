import { MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormsModule,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ProductService } from '../../services/product/product.service';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { UserService } from '../../services/user/user.service';
import { UserResponseDto } from '../../models/api-user/user';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProductRequestDto, ProductResponseDto } from '../../models/api-inventory/product';
import { DropdownItem, DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../services/message/alert.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, ButtonModule, ToastModule, RouterModule, CardModule, InputTextModule, InputNumberModule, DropdownModule,
  CommonModule ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit {
  formProduct!: FormGroup;
  formDeleteProduct!: FormGroup;
  operation: string = '';
  userList: UserResponseDto[] = [];
  product?: ProductResponseDto;

  isSaveInProgress: boolean = false;
  isDeleteInProgress: boolean = false;

  constructor(private fb: FormBuilder,
    private productService: ProductService,
    private userService: UserService,
    private activateRoute: ActivatedRoute,
    private alertService: AlertService,
    private router: Router,

  ) {
    this.initializeFormsProduct();
    this.getUsers();
  }

  ngOnInit(): void {

    let id = this.activateRoute.snapshot.paramMap.get('id');
    const deleteRoute = this.router.url.includes('delete');

    if(id !== 'new' && deleteRoute == false){
      this.operation = 'edit';
      this.getProductById(+id!);
      return;
    }

    if(deleteRoute){
      this.operation = 'delete';
      this.getProductById(+id!);
      return;
    }

    this.operation = 'new';

    console.log(this.operation)
  }

  initializeFormsProduct() {
    this.formProduct = this.fb.group({
      id: [null],
      name: ['',
         [
          Validators.required,
          Validators.maxLength(25),
          Validators.pattern(/^[a-zA-Z ]+$/)]
        ],
      quantity: [1, [
        Validators.required,
        Validators.pattern(/^[0-9]+$/),
        Validators.min(1)
      ]],
      userId: [null, Validators.required],
      description: ['', [
          Validators.maxLength(255),
          Validators.pattern(/^[a-zA-Z ]+$/)
      ]],
    });

    this.formDeleteProduct = this.fb.group({
      id: [null],
      userId: [null, Validators.required]
    });
  }

  getUsers(){
    this.userService.getUsers().subscribe({
      next:(foundUsers) => {
        this.userList = foundUsers;
      }
    });
  }

  getProductById(id: number){
    this.productService.getProductById(id).subscribe({
      next:(foundProduct) => {
        this.product = foundProduct;
        this.formProduct.patchValue(foundProduct);
      },
      error: () => {
        this.router.navigateByUrl('/');
      }
    });
  }

  createProduct(){

    if(this.formProduct.invalid){
      this.alertService.showErrorMessage({
        title: 'Error',
        message: 'Revise los campos he intente nuevamente'
      });
      return;
    }

    const pyload: ProductRequestDto = this.formProduct.value;
    pyload.description = pyload.description?.trim() == '' ? null : pyload.description;

    this.isSaveInProgress = true;
    this.productService.createProduct(pyload).subscribe({
      next:() => {
          this.alertService.showSuccessMessage({
            title: 'Guardado',
            message: 'Producto guardado correctamente'
          });
          setTimeout(() =>{
            this.isSaveInProgress = false;
            this.router.navigateByUrl('/');
          }, 1000)
      },
      error: () => {
        this.isSaveInProgress = false;
      }
    });
  }

  updateProduct(){

    if(this.formProduct.invalid){
      this.alertService.showErrorMessage({
        title: 'Error',
        message: 'Revise los campos he intente nuevamente'
      });
      return;
    }

    const pyload: ProductRequestDto = this.formProduct.value;
    pyload.description = pyload.description?.trim() == '' ? null : pyload.description;

    this.isSaveInProgress = true;
    this.productService.updateProduct(this.product?.id ?? 0, pyload).subscribe({
      next:() => {
          this.alertService.showSuccessMessage({
            title: 'Guardado',
            message: 'Producto actualizado correctamente'
          });

          setTimeout(() =>{
            this.isSaveInProgress = false;
            this.router.navigateByUrl('/');
          }, 1000)
      },
      error: () => {
        this.isSaveInProgress = false;
      }
    });
  }

  deleteProduct(){
    if(this.formDeleteProduct.invalid){
      this.alertService.showErrorMessage({
        title: 'Error',
        message: 'Revise los campos he intente nuevamente'
      });
      return;
    }

    const userId: number = this.formDeleteProduct?.get('userId')?.value ?? 0;
    this.isDeleteInProgress = true;

    this.productService.deleteProduct(this.product?.id ?? 0, userId).subscribe({
      next:() => {
          this.alertService.showSuccessMessage({
            title: 'Eliminado',
            message: 'Producto eliminado correctamente'
          });
          setTimeout(() =>{
            this.isDeleteInProgress = false;
            this.router.navigateByUrl('/');
          }, 1000)
      },
      error: () => {
        this.isDeleteInProgress = false;
      }
    });
  }

}
