import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRequestDto, UserResponseDto, UserUpdateRequestDto } from '../../models/api-user/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/business-support/user/v1/users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<UserResponseDto[]> {
    return this.http.get<UserResponseDto[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<UserResponseDto> {
    return this.http.get<UserResponseDto>(`${this.apiUrl}/${id}`);
  }

  createUser(request: UserRequestDto): Observable<UserResponseDto> {
    return this.http.post<UserResponseDto>(`${this.apiUrl}`, request);
  }

  updateUser(request: UserUpdateRequestDto): Observable<UserResponseDto> {
    return this.http.post<UserResponseDto>(`${this.apiUrl}`, request);
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
