import { IsNotEmpty, IsPositive } from 'class-validator';

export class PlayerBetDto {
  @IsPositive()
  @IsNotEmpty()
  bet: number;
}
