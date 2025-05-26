import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { UserResponseDto } from '../../../models/api-user/user';
import { ProductService } from '../../../services/product/product.service';
import { UserService } from '../../../services/user/user.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AlertService } from '../../../services/message/alert.service';
import { MovementTypes } from '../../../shared/movement-types.enum';
import { ProductMovementService } from '../../../services/product-movement/product-movement.service';
import {
  ProductMovementRequestDto,
  ProductMovementResponseDto,
} from '../../../models/api-inventory/product-movement/product-movement';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProductResponseDto } from '../../../models/api-inventory/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-movement-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    ToastModule,
    RouterModule,
    CardModule,
    InputTextModule,
    InputNumberModule,
    CommonModule,
    DropdownModule
  ],
  templateUrl: './product-movement-form.component.html',
  styleUrl: './product-movement-form.component.scss',
})
export class ProductMovementFormComponent implements OnInit {
  formProductMovement!: FormGroup;
  formDeleteProductMovement!: FormGroup;
  operation: string = '';
  userList: UserResponseDto[] = [];

  isSaveInProgress: boolean = false;
  isDeleteInProgress: boolean = false;

  product?: ProductResponseDto;
  productMovement?: ProductMovementResponseDto;

  movementTypeOptions: { label: string; value: MovementTypes }[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private productMovementService: ProductMovementService,
    private userService: UserService,
    private activateRoute: ActivatedRoute,
    private alertService: AlertService,
    private router: Router
  ) {
    this.movementTypeOptions = Object.keys(MovementTypes)
      .filter(key => isNaN(Number(key)))
      .map(key => {
        const value = MovementTypes[key as keyof typeof MovementTypes];
        return {
          label: this.formatLabel(value),
          value: value
        };
      });

    this.initializeFormsProduct();
    this.getUsers();
  }

  ngOnInit(): void {

    let productId = this.activateRoute.snapshot.paramMap.get('productId');
    let productMovementId =
      this.activateRoute.snapshot.paramMap.get('productMovementId');
    const deleteRoute = this.router.url.includes('delete');

    this.getProductById(+productId!);

    if (productMovementId !== 'new' && deleteRoute == false) {
      this.operation = 'edit';
      this.getProductMovementById(+productId!, +productMovementId!);
      return;
    }

    if (deleteRoute) {
      this.operation = 'delete';
      this.getProductMovementById(+productId!, +productMovementId!);
      return;
    }

    this.operation = 'new';
  }

  initializeFormsProduct() {
    this.formProductMovement = this.fb.group({
      id: [null],
      movementType: [
        null,
          [Validators.required]
      ],
      quantity: [
        null,
        [Validators.required, Validators.pattern(/^\d+$/), Validators.min(1)],
      ],
      userId: [null, [Validators.required]],
      description: [
        null,
        [Validators.maxLength(255), Validators.pattern(/^[a-zA-Z ]*$/)],
      ],
    });

    this.formDeleteProductMovement = this.fb.group({
      id: [null],
      userId: [null, [Validators.required]]
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

  getUsers() {
    this.userService.getUsers().subscribe({
      next: (foundUsers) => {
        this.userList = foundUsers;
      },
    });
  }

    getProductById(id: number){
    this.productService.getProductById(id).subscribe({
      next:(foundProduct) => {
        this.product = foundProduct;
      },
      error: () => {
        this.router.navigateByUrl('/');
      }
    });
  }

  validEnumValidator(allowedValues: string[]) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') return null;
      return allowedValues.includes(value) ? null : { invalidEnum: true };
    };
  }

  getProductMovementById(productId: number, id: number) {
    this.productMovementService
      .getProductMovementById(productId, id)
      .subscribe({
        next: (data) => {
          this.productMovement = data;
          this.formProductMovement.patchValue(data);
        },
        error: () => {
          this.router.navigateByUrl('/');
        },
      });
  }

  createProductMovement() {
    if (this.formProductMovement.invalid) {
      this.alertService.showErrorMessage({
        title: 'Error',
        message: 'Revise los campos he intente nuevamente',
      });
      return;
    }

    const pyload: ProductMovementRequestDto = this.formProductMovement.value;
    pyload.description = pyload.description?.trim() == '' ? null : pyload.description;
    pyload.movementType = this.formProductMovement.get('movementType')?.value?.value ?? "";

    this.isSaveInProgress = true;
    this.productMovementService
      .createProductMovement(this.product?.id ?? 0, pyload)
      .subscribe({
        next: () => {
          this.alertService.showSuccessMessage({
            title: 'Guardado',
            message: 'Movimiento guardado correctamente',
          });

          this.isSaveInProgress = false;
            this.router.navigateByUrl(`product-movement/${this.product?.id ?? 0}`);
        },
        error: () => {
          this.isSaveInProgress = false;
        },
      });
  }

  updateProductMovement() {
    if (this.formProductMovement.invalid) {
      this.alertService.showErrorMessage({
        title: 'Error',
        message: 'Revise los campos he intente nuevamente',
      });
      return;
    }

    const pyload: ProductMovementRequestDto = this.formProductMovement.value;
    pyload.description = pyload.description?.trim() == '' ? null : pyload.description;
    pyload.movementType = this.formProductMovement.get('movementType')?.value?.value ?? "";

    this.isSaveInProgress = true;
    this.productMovementService
      .updateProductMovement(
        this.product?.id ?? 0,
        this.productMovement?.id ?? 0,
        pyload
      )
      .subscribe({
        next: () => {
          this.alertService.showSuccessMessage({
            title: 'Guardado',
            message: 'Movimiento actualizado correctamente',
          });

          this.isSaveInProgress = false;
          this.router.navigateByUrl(`product-movement/${this.product?.id ?? 0}`);

        },
        error: () => {
          this.isSaveInProgress = false;
        },
      });
  }

  deleteProductMovement() {
    if (this.formDeleteProductMovement.invalid) {
      this.alertService.showErrorMessage({
        title: 'Error',
        message: 'Revise los campos he intente nuevamente',
      });
      return;
    }

    const userId: number =
      this.formDeleteProductMovement?.get('userId')?.value ?? 0;
    this.isDeleteInProgress = true;

    this.productMovementService
      .deleteProductMovement(
        this.product?.id ?? 0,
        this.productMovement?.id ?? 0,
        userId
      )
      .subscribe({
        next: () => {
          this.alertService.showSuccessMessage({
            title: 'Eliminado',
            message: 'Movimiento eliminado correctamente',
          });

          this.isDeleteInProgress = false;
          this.router.navigateByUrl(`product-movement/${this.product?.id ?? 0}`);
        },
        error: () => {
          this.isDeleteInProgress = false;
        },
      });
  }
}
