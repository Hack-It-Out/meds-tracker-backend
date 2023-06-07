import { IsDefined, IsPhoneNumber, IsString, Length } from "class-validator";
import { BaseModel } from "../base";

enum Gender {
	MALE = "male",
	FEMALE = "female",
	OTHER = "other",
	RATHER_NOT_SAY = "rather_not_say",
}

export interface UserProps {
	name: string;
	phoneNumber: string;
	// dateOfBirth?: string | Date;
	// username?: string;
	// gender?: Gender | string;

	// createdBy?: string;
	// updatedBy?: string;
}

export class User extends BaseModel {
	// userId!: string;
	// code!: string;

	// @IsEmail()
	// email!: string;

	// version!: number;

	@IsString()
	name!: string;
	@IsPhoneNumber("KE")
	phoneNumber!: string;
	// @IsString()
	// familyName!: string;
	// @IsString()
	// username!: string;
	// @IsDateString()
	// dateOfBirth!: string;
	// @IsEnum(Gender)
	// gender!: Gender;

	// createdBy!: string;
	// updatedBy!: string;

	constructor(props?: UserProps) {
		super();
		Object.assign(this, props);
	}
}

export class CreateUser extends User {
	// @IsDefined()
	// declare email: string;
	@IsDefined()
	declare phoneNumber: string;
	@IsDefined()
	declare name: string;

	// @IsDefined()
	// declare givenName: string;
	// @IsDefined()
	// declare familyName: string;

	// @IsDefined()
	// declare dateOfBirth: string;

	// @Exclude()
	// @IsDefined()
	// password!: string;

	constructor(props?: UserProps) {
		super(props);
		// if (typeof props?.dateOfBirth == "string") {
		// 	this.dateOfBirth = DateTime.fromISO(props.dateOfBirth)
		// 		.toUTC()
		// 		.toISO();
		// }
		// if (typeof props?.dateOfBirth == "object") {
		// 	this.dateOfBirth = props?.dateOfBirth.toISOString();
		// }
		// this.updatedBy ??= this.createdBy;
		// this.code ??= this.generateSimpleID({
		// 	prefix: "USR",
		// 	includeDate: false,
		// });
		// this.createdOn = this.updatedOn;
		// this.version = 0;
	}
}

export class UserSignUp extends CreateUser {
	constructor(props?: UserProps) {
		super(props);
	}
}

export class UserSignIn extends User {
	@IsDefined()
	@IsPhoneNumber("KE")
	declare phoneNumber: string;
	// @IsDefined()
	// password!: string;
	constructor(props?: UserProps) {
		super(props);
	}
}
export class UserOTP extends User {
	@IsDefined()
	@IsPhoneNumber("KE")
	declare phoneNumber: string;
	@IsDefined()
	@IsString()
	declare session: string;
	@IsDefined()
	@IsString()
	@Length(6, 6)
	declare passCode: string;
	// @IsDefined()
	// password!: string;
	constructor(props?: UserProps) {
		super(props);
	}
}
