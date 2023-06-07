import { IsDefined, IsPhoneNumber, IsString } from "class-validator";
import { BaseModel } from "../base";

export interface ReminderProps {
	phoneNumber: string;
	medicine: string;
	name: string;
	careGiver?: string;
}

export class Reminder extends BaseModel {
	@IsDefined()
	@IsPhoneNumber("KE")
	phoneNumber!: string;

	@IsDefined()
	@IsString()
	medicine!: string;

	@IsDefined()
	@IsString()
	name!: string;

	@IsPhoneNumber("KE")
	careGiver?: string;

	constructor(props?: ReminderProps) {
		super();
		Object.assign(this, props);
	}
}
