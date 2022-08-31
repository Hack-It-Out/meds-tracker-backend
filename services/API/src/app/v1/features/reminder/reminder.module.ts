import { forwardRef, Module } from "@nestjs/common";
import { AfricaIsTalkingModule } from "~/v1/core/modules/africaIsTalking";
import { ReminderController } from "./reminder.controller";
import { ReminderService } from "./services/reminder.service";

@Module({
	imports: [AfricaIsTalkingModule],
	controllers: [ReminderController],
	providers: [ReminderService],
	exports: [ReminderService],
})
export class ReminderModule {}
