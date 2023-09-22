import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { StudentsService } from 'src/modules/student/student.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService extends PassportStrategy(Strategy) {
  constructor(
    private config: ConfigService,
    private studentService: StudentsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: any }) {
    const { sub: id } = payload;
    return this.studentService.findOne({id});
  }
}
