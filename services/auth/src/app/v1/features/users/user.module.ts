import { forwardRef, Module } from "@nestjs/common";
import { AfricaIsTalkingModule } from "~/v1/core/modules/africaIsTalking";
import { UserController } from "./user.controller";
import { UserService } from "./services/user.service";

@Module({
	imports: [AfricaIsTalkingModule],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
