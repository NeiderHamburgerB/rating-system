import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { LocalGuard } from 'src/config/passport/guards/local.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { User } from 'src/common/decorators/user.decorators';
import { IStudent } from 'src/interfaces/IStudent.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('login')
  @ApiOperation({
    summary: 'Login Endpoint',
    description: 'Endpoint to authenticate and log in a user.',
  })
  login(@User() user: IStudent, @Body() data: LoginDto) {
    try {
      return this.authService.login(user);
    } catch (err) {
      return {
        statusCode: 500,
        message: err,
      };
    }
  }

}
