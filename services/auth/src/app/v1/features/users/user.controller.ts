import { Body, Controller, Post } from "@nestjs/common";
import { CreateUser, User, UserOTP, UserSignIn } from "~/v1/core/models/user";
import { UserService } from "./services/user.service";

// http://localhost:3000/v1/users/

// @Authentication(AuthenticationType.JWT)
@Controller({ version: "1", path: "users" })
export class UserController {
	constructor(
		// private configService: ConfigService,
		private userService: UserService // private authenticationService: AuthenticationService
	) {}

	@Post(["/", "/signup"])
	async createUser(@Body() body: CreateUser) {
		return this.userService.createUser(body);
	}

	@Post("/signin")
	async signIn(@Body() body: UserSignIn) {
		return this.userService.authenticateUser(body);
	}

	@Post("/otp")
	async otp(@Body() body: UserOTP) {
		return this.userService.providePasscode(body);
	}
}
