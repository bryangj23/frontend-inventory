import { RoleResponseDto } from "./role/role";

export interface UserResponseDto {
  id: number;
  userNumber: string;
  email: string;
  name: string;
  secondName?: string;
  lastNames: string;
  mothersSurname?: string;
  active: boolean;
  role: RoleResponseDto;
  createdAt: Date;
  updatedAt?: Date;
}

export interface UserRequestDto {
  userNumber: string;
  email: string;
  name: string;
  secondName?: string;
  lastNames: string;
  mothersSurname?: string;
  roleId: number;
}

export interface UserUpdateRequestDto {
  email: string;
  name: string;
  secondName?: string;
  lastNames: string;
  mothersSurname?: string;
  roleId: number;
}
