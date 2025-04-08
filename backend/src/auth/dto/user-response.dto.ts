import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @Expose()
  @ApiProperty({ description: 'User ID', example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ description: 'Username', example: 'johndoe' })
  username: string;

  @Expose()
  @ApiProperty({
    description: 'Email address',
    example: 'john.doe@example.com',
  })
  email: string;

  @Expose()
  @ApiProperty({
    description: 'Account creation date',
    example: '2025-04-08T12:00:00.000Z',
  })
  created_at: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
