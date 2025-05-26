export interface ProductResponseDto {
  id: number;
  name: string;
  quantity: number;
  registeredByUserId: number;
  modifiedByUserId: number | null;
  description: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductRequestDto {
  name: string;
  quantity: number;
  userId: number;
  description: string | null;
}

