import { applyDecorators, UseGuards } from "@nestjs/common";
import { JwtGuard } from "../../config/passport/guards/jwt.guard";
import { ApiBearerAuth } from "@nestjs/swagger";

export function Auth(){
    return applyDecorators(
        UseGuards(JwtGuard),
        ApiBearerAuth()
    )
}