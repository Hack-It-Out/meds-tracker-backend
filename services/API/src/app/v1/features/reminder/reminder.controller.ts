import { Body, Controller, Post } from "@nestjs/common";
import { Reminder } from "~/v1/core/models/reminder";
import { ReminderService } from "./services/reminder.service";

// http://localhost:3000/v1/reminders/

// @Authentication(AuthenticationType.JWT)
@Controller({ version: "1", path: "reminders" })
export class ReminderController {
	constructor(
		// private configService: ConfigService,
		private reminderService: ReminderService // private authenticationService: AuthenticationService
	) {}

	@Post()
	async createReminder(@Body() body: Reminder) {
		return this.reminderService.createReminder(body);
	}
}
