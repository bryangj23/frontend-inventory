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
import { DropdownModule } from 'primeng/dropdown';
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
  formProduct: FormGroup;
  formDeleteProduct: FormGroup;
  operation: 'new' | 'edit' | 'delete' = 'new';
  userList: UserResponseDto[] = [];
  product?: ProductResponseDto;

  isSaveInProgress = false;
  isDeleteInProgress = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private router: Router
  ) {
    this.formProduct = this.createFormProduct();
    this.formDeleteProduct = this.createFormDeleteProduct();
  }

  ngOnInit(): void {
    this.setupOperation();
    this.loadUsers();
  }

  private setupOperation(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    const isDelete = this.router.url.includes('delete');

    if (id && id !== 'new') {
      this.operation = isDelete ? 'delete' : 'edit';
      this.loadProduct(+id);
    } else {
      this.operation = 'new';
    }
  }

  private createFormProduct(): FormGroup {
    return this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.maxLength(25), Validators.pattern(/^[a-zA-Z ]+$/)]],
      quantity: [1, [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.min(1)]],
      userId: [null, Validators.required],
      description: ['', [Validators.maxLength(255), Validators.pattern(/^[a-zA-Z ]+$/)]],
    });
  }

  private createFormDeleteProduct(): FormGroup {
    return this.fb.group({
      id: [null],
      userId: [null, Validators.required],
    });
  }

  private loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => (this.userList = users),
      error: () => this.alertService.showErrorMessage({ title: 'Error', message: 'Error al cargar los usuarios' }),
    });
  }

  private loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.formProduct.patchValue(product);
        this.formDeleteProduct.patchValue({ id: product.id });
      },
      error: () => this.router.navigateByUrl('/'),
    });
  }

  onSubmit(): void {
    if (this.operation === 'edit') {
      this.updateProduct();
    } else if (this.operation === 'new') {
      this.createProduct();
    }
  }

  private createProduct(): void {
    if (this.formProduct.invalid) {
      this.showValidationError();
      return;
    }

    const payload: ProductRequestDto = this.prepareProductPayload();

    this.isSaveInProgress = true;
    this.productService.createProduct(payload).subscribe({
      next: () => this.handleSuccess('Producto guardado correctamente'),
      error: () => (this.isSaveInProgress = false),
    });
  }

  private updateProduct(): void {
    if (this.formProduct.invalid || !this.product?.id) {
      this.showValidationError();
      return;
    }

    const payload: ProductRequestDto = this.prepareProductPayload();

    this.isSaveInProgress = true;
    this.productService.updateProduct(this.product.id, payload).subscribe({
      next: () => this.handleSuccess('Producto actualizado correctamente'),
      error: () => (this.isSaveInProgress = false),
    });
  }

  public deleteProduct(): void {
    if (this.formDeleteProduct.invalid || !this.product?.id) {
      this.showValidationError();
      return;
    }

    const userId: number = this.formDeleteProduct.get('userId')?.value;

    this.isDeleteInProgress = true;
    this.productService.deleteProduct(this.product.id, userId).subscribe({
      next: () => this.handleSuccess('Producto eliminado correctamente', true),
      error: () => (this.isDeleteInProgress = false),
    });
  }

  private prepareProductPayload(): ProductRequestDto {
    const payload: ProductRequestDto = this.formProduct.value;
    payload.description = payload.description?.trim() || null;
    return payload;
  }

  private showValidationError(): void {
    this.alertService.showErrorMessage({
      title: 'Error',
      message: 'Revise los campos e intente nuevamente',
    });
  }

  private handleSuccess(message: string, isDelete: boolean = false): void {
    this.alertService.showSuccessMessage({
      title: isDelete ? 'Eliminado' : 'Guardado',
      message,
    });


    this.isSaveInProgress = false;
    this.isDeleteInProgress = false;
    this.router.navigateByUrl('/');
  }
}
