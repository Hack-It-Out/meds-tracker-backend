import type { PreSignUpTriggerHandler } from "aws-lambda";

export const handler: PreSignUpTriggerHandler = async (
	event,
	context,
	callback
) => {
	console.log("Received EVENT", JSON.stringify(event, null, 2));
	event.response.autoConfirmUser = true;
	event.response.autoVerifyPhone = true;
	return event;
};
