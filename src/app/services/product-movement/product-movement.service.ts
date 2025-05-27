import { ProductMovementRequestDto } from './../../models/api-inventory/product-movement/product-movement';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductMovementResponseDto } from '../../models/api-inventory/product-movement/product-movement';

@Injectable({
  providedIn: 'root'
})
export class ProductMovementService {

  private apiUrl = 'http://localhost:8081/business-support/inventory/v1/products';

    constructor(private http: HttpClient) { }

    getProductMovements(productId: number, filters: string): Observable<ProductMovementResponseDto[]> {
      return this.http.get<ProductMovementResponseDto[]>(`${this.apiUrl}/${productId}/product-movements`, {
        params: { filters: filters }
      });
    }

    getProductMovementById(productId: number, id: number): Observable<ProductMovementResponseDto> {
      return this.http.get<ProductMovementResponseDto>(`${this.apiUrl}/${productId}/product-movements/${id}`);
    }

    createProductMovement(productId: number, request: ProductMovementRequestDto): Observable<ProductMovementResponseDto> {
      return this.http.post<ProductMovementResponseDto>(`${this.apiUrl}/${productId}/product-movements`, request);
    }

    updateProductMovement(productId: number, id: number, request: ProductMovementRequestDto): Observable<ProductMovementResponseDto> {
      return this.http.put<ProductMovementResponseDto>(`${this.apiUrl}/${productId}/product-movements/${id}`, request);
    }

    deleteProductMovement(productId: number, id: number, userId: number) {
      return this.http.delete(`${this.apiUrl}/${productId}/product-movements/${id}/users/${userId}`);
    }

  }
