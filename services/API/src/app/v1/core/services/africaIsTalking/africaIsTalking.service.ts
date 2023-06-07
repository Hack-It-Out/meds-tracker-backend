import { Injectable, Scope } from "@nestjs/common";
import AfricaIsTalking from "africastalking";
import { inspect } from "util";

@Injectable({ scope: Scope.REQUEST })
export class AfricaIsTalkingService {
	private AfricaIsTalkingClient;
	constructor() {
		this.AfricaIsTalkingClient = AfricaIsTalking({
			apiKey: process.env.AIT_API_KEY ?? "",
			username: process.env.AIT_USERNAME ?? "",
		});
	}

	public async sendSMS(props: { to: string[]; message: string }) {
		const response = await this.AfricaIsTalkingClient.SMS.send(props);
		if (response) {
			console.log(
				inspect(response, {
					showHidden: false,
					depth: null,
					colors: true,
				})
			);
			return response;
		}
	}
}
