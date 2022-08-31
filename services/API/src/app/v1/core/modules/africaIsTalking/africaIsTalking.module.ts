import { forwardRef, Module } from "@nestjs/common";
import { AfricaIsTalkingService } from "~/v1/core/services/africaIsTalking";

@Module({
	imports: [],
	controllers: [],
	providers: [AfricaIsTalkingService],
	exports: [AfricaIsTalkingService],
})
export class AfricaIsTalkingModule {}
