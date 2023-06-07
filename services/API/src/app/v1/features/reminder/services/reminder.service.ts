import { Injectable, Scope } from "@nestjs/common";
import { compact } from "lodash";
import { ReminderProps } from "~/v1/core/models/reminder";
import { AfricaIsTalkingService } from "~/v1/core/services/africaIsTalking";

@Injectable({ scope: Scope.REQUEST })
export class ReminderService {
	// private _application?: CustomObservable<Application | null>;
	// private dynamoService: NestDynamoService // private applicationPermissionService: ApplicationPermissionService, // private authenticationService: AuthenticationService // private uploadService: ApplicationUploadService
	constructor(private africaIsTalking: AfricaIsTalkingService) {}

	public async createReminder(props: ReminderProps) {
		const { name, medicine, phoneNumber, careGiver } = props;
		const to = compact([phoneNumber, careGiver]);
		const message = `Hi ${
			name || "there"
		}. Remember to take you ${medicine} dose in 5 minutes.`;
		await this.africaIsTalking.sendSMS({ to, message });
	}
}
