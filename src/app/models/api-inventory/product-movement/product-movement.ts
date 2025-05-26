import { MovementTypes } from "../../../shared/movement-types.enum";

export interface ProductMovementRequestDto {
  movementType: MovementTypes;
  quantity: number;
  userId: number;
  description: string | null;
}

export interface ProductMovementResponseDto {
  id: number;
  productId: number;
  movementType: MovementTypes;
  quantity: number;
  userId: number;
  description?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
