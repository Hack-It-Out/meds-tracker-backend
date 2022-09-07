import { randomInt } from "crypto";
import type { CreateAuthChallengeTriggerHandler } from "aws-lambda";
import { config } from "dotenv";
config();
import { AfricaIsTalkingService } from "./africaIsTalking.service";

export const handler: CreateAuthChallengeTriggerHandler = async (
	event,
	context,
	callback
) => {
	console.log("RECEIVED event: ", JSON.stringify(event, null, 2));
	const africaIsTalkingService = new AfricaIsTalkingService();
	let passCode;
	var phoneNumber = event.request.userAttributes.phone_number;

	// The first CUSTOM_CHALLENGE request for authentication from
	// iOS AWSMobileClient actually comes in as an "SRP_A" challenge (a bug in the AWS SDK for iOS?)
	// web (Angular) comes in with an empty event.request.session
	if (
		(event.request.session &&
			event.request.session.length &&
			event.request.session.slice(-1)[0].challengeName == "SRP_A") ||
		event.request.session.length == 0
	) {
		passCode = randomInt(0, 1000000).toString().padStart(6, "0");
		// passCode = crypto_secure_random_digit.randomDigits(6).join("");

		await africaIsTalkingService.sendSMS({
			to: [phoneNumber],
			message: `[MedsTracker] Your OTP code: ${passCode}`,
		});
	} else {
		const previousChallenge = event.request.session[0];
		passCode =
			previousChallenge?.challengeMetadata?.match(/CODE-(\d*)/)?.[1];
	}
	event.response.publicChallengeParameters = {
		phone: event.request.userAttributes.phone_number,
	};
	if (!passCode) {
		throw Error("Invalid Passcode");
	}
	event.response.privateChallengeParameters = { passCode };
	event.response.challengeMetadata = `CODE-${passCode}`;

	console.log("RETURNED event: ", JSON.stringify(event, null, 2));

	return event;
	// event;
};
