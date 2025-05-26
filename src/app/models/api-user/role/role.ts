export interface RoleResponseDto {
  id: number;
  code: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt?: Date;
}
