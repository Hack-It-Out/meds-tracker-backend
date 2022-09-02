import { Injectable } from "@nestjs/common";

@Injectable()
export class V1Service {
	getHello(): string {
		return "Welcome to Meds Tracker V1";
	}
}
