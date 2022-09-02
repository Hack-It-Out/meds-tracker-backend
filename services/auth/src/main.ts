// organize-imports-ignore
import { config } from "dotenv";
config(); // { path: join(__dirname, '../.env')});

import cookieParser from "cookie-parser";
import serverless from "@vendia/serverless-express";
import {
	// APIGatewayProxyCallbackV2,
	APIGatewayProxyEventV2,
	APIGatewayProxyHandlerV2,
	APIGatewayProxyResultV2,
} from "aws-lambda";
// import { APIGatewayEntryV2, Entry } from "@gylfie/core";
import {
	BadRequestException,
	ValidationPipe,
	ValidationPipeOptions,
	VersioningType,
} from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
// console.log(process.cwd());
// import event from "lambda/examples/api-gateway-v2-event.json";
// import * as payload from "./payload.json";
import { AppModule } from "./app/app.module";
import { cors } from "./cors";
import { inspect } from "util";

export const defaultValidationPipeProps: ValidationPipeOptions = {
	whitelist: true,
	skipMissingProperties: true,
	// validationError: { target: true, value: true },

	// disableErrorMessages: false,
	exceptionFactory: (errors) => {
		// console.log(errors);
		for (const error of errors) {
			console.log(
				inspect(error, {
					showHidden: false,
					depth: null,
					colors: true,
				})
			);
		}
		return new BadRequestException(errors);
	},
};

// Local Use
async function local() {
	console.log("Local");
	const app = await NestFactory.create(AppModule, {
		abortOnError: false,
		cors: {
			origin: cors.origins.local,
			methods: cors.methods.local,
			allowedHeaders: cors.allowedHeaders.local,
			credentials: cors.credentials.local,
		},
		// logger: ["log", "debug", "error", "verbose", "warn"], // : ['error', 'warn']
	}); // , new ExpressAdapter());
	app.use(cookieParser());
	app.useGlobalPipes(new ValidationPipe(defaultValidationPipeProps));
	app.enableVersioning({ type: VersioningType.URI });
	await app.listen(3000, () => {
		console.log("Listening on 3000");
	});
}
local();
