import { randomInt } from "crypto";
import {
	InitiateAuthCommand,
	AuthFlowType,
	RespondToAuthChallengeCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { Injectable, Scope } from "@nestjs/common";
import { compact } from "lodash";
import { CreateUser, UserProps } from "~/v1/core/models/user";
import { AfricaIsTalkingService } from "~/v1/core/services/africaIsTalking";

@Injectable({ scope: Scope.REQUEST })
export class UserService {
	// private _application?: CustomObservable<Application | null>;
	// private dynamoService: NestDynamoService // private applicationPermissionService: ApplicationPermissionService, // private authenticationService: AuthenticationService // private uploadService: ApplicationUploadService
	constructor(private africaIsTalking: AfricaIsTalkingService) {}

	public async createUser(props: UserProps) {
		const user = new CreateUser(props);
		const passCode = randomInt(0, 1000000).toString().padStart(6, "0");

		// await this.cognitoService.createUser({
		// 	user: {
		// 		username: user.phoneNumber,
		// 		password: passCode,
		// 		phone_number: user.phoneNumber,
		// 		name: user.name,
		// 	},
		// });

		return user;
	}

	public async authenticateUser(props: { phoneNumber: string }) {
		const { phoneNumber } = props;
		const AuthParameters = {
			USERNAME: phoneNumber,
		};
		// const response = await this.cognitoService.cognitoIdentityProvider.send(
		// 	new InitiateAuthCommand({
		// 		AuthFlow: AuthFlowType.CUSTOM_AUTH,
		// 		ClientId: this.cognitoService.clientID,
		// 		AuthParameters,
		// 	})
		// );
		// console.log(response);
		// return { session: response.Session };
	}

	public async providePasscode(props: {
		phoneNumber: string;
		passCode: string;
		session: string;
	}) {
		const { phoneNumber, passCode, session } = props;
		// const response = await this.cognitoService.cognitoIdentityProvider.send(
		// 	new RespondToAuthChallengeCommand({
		// 		ChallengeName: "CUSTOM_CHALLENGE",
		// 		ClientId: this.cognitoService.clientID,
		// 		Session: session,
		// 		ChallengeResponses: {
		// 			USERNAME: phoneNumber,
		// 			ANSWER: passCode,
		// 		},
		// 	})
		// );
		// console.log(response);
		// if (response.Session) {
		// 	return { session: response.Session };
		// }
		// return {
		// 	accessToken: response.AuthenticationResult?.AccessToken,
		// 	idToken: response.AuthenticationResult?.IdToken,
		// 	refreshToken: response.AuthenticationResult?.RefreshToken,
		// };
	}
}
