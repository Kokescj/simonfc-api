import { ArrayMinSize, ArrayUnique, IsArray, IsEnum, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../common';

export class UpdateUserDto {
  @ApiProperty({ required: false, example: 'Jorge' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @ApiProperty({ required: false, example: 'Arancibia' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName?: string;

  @ApiProperty({
    required: false,
    enum: UserRole,
    isArray: true,
    description: 'Roles del usuario. Reemplaza la lista completa.',
    example: [UserRole.ADMIN, UserRole.USUARIO],
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsEnum(UserRole, { each: true })
  roles?: UserRole[];

  @ApiProperty({
    required: false,
    enum: ['activo', 'suspendido'],
    description: 'Estado de la cuenta. "eliminado" se setea vía DELETE.',
  })
  @IsOptional()
  @IsIn(['activo', 'suspendido'])
  status?: 'activo' | 'suspendido';
}
