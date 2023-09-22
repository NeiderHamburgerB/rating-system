import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { IStudent } from 'src/interfaces/IStudent.interface';
import { compareSync } from 'bcryptjs';
import { StudentsService } from 'src/modules/student/student.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private studentsService: StudentsService,
    private jwtService: JwtService,
  ) {}

  async validate(email: string, pass: string) {
    const user = await this.studentsService.findOne({ email });
    if (!user) throw new NotFoundException('User not found');

    if (!compareSync(pass, user.password))
      throw new NotAcceptableException('User or password incorrect');

    let { password, ...rest } = user;

    return rest;
  }

  async login(user: IStudent) {

    const { id } = user;

    const payload = { sub: id };

    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
 
  }
}
