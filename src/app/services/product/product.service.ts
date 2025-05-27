import { ProductRequestDto } from '../../models/api-inventory/product';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductResponseDto } from '../../models/api-inventory/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:8081/business-support/inventory/v1/products';

  constructor(private http: HttpClient) { }

  getProducts(filters?: string): Observable<ProductResponseDto[]> {
    return this.http.get<ProductResponseDto[]>(this.apiUrl, {
        params: { filters: filters ?? '' }
      });
  }

  getProductById(id: number): Observable<ProductResponseDto> {
    return this.http.get<ProductResponseDto>(`${this.apiUrl}/${id}`);
  }

  createProduct(request: ProductRequestDto): Observable<ProductResponseDto> {
    return this.http.post<ProductResponseDto>(`${this.apiUrl}`, request);
  }

  updateProduct(id: number, request: ProductRequestDto): Observable<ProductResponseDto> {
    return this.http.put<ProductResponseDto>(`${this.apiUrl}/${id}`, request);
  }

  deleteProduct(id: number, userId: number) {
    return this.http.delete(`${this.apiUrl}/${id}/users/${userId}`);
  }

}
