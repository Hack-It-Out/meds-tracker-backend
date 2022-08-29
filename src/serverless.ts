// organize-imports-ignore
import { config } from "dotenv";
config(); // { path: join(__dirname, '../.env')});

// AWS Lambda support

import { ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
	APIGatewayProxyHandlerV2,
	APIGatewayProxyEventV2,
	APIGatewayProxyResultV2,
} from "aws-lambda";
import serverless from "@vendia/serverless-express";
import cookieParser from "cookie-parser";
import { AppModule } from "./app/app.module";
import { cors } from "./cors";
// import * as payload from "./payload.json";
import { cloneDeep } from "lodash";

let server: APIGatewayProxyHandlerV2;

async function bootstrap(): Promise<APIGatewayProxyHandlerV2> {
	console.log("Bootstrap");
	const app = await NestFactory.create(AppModule, {
		cors:
			process.env.LOCATION == "LOCAL"
				? {
						origin: cors.origins.local,
						methods: cors.methods.local,
						allowedHeaders: cors.allowedHeaders.local,
						credentials: cors.credentials.local,
				  }
				: {
						origin: cors.origins.prod,
						methods: cors.methods.prod,
						allowedHeaders: cors.allowedHeaders.prod,
						credentials: cors.credentials.prod,
				  },
		abortOnError: false,
		logger:
			process.env.ENVIRONMENT == "PRODUCTION"
				? ["error", "warn"]
				: ["log", "debug", "error", "verbose", "warn"], // : ['error', 'warn']
	});
	// console.log("Pre Init");
	app.use(cookieParser());
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			skipMissingProperties: true,
		})
	);
	app.enableVersioning({ type: VersioningType.URI });
	await app.init();
	// console.log("Post Init");

	const expressApp = app.getHttpAdapter().getInstance();
	return serverless({
		app: expressApp,
	});
}

function removeStageFromRequest(
	event: APIGatewayProxyEventV2
): APIGatewayProxyEventV2 {
	if (process.env.LOCATION == "CLOUD") {
		const clonedEvent = cloneDeep(event);
		console.log(clonedEvent);
		const rawPathSplit = clonedEvent.rawPath.split("/");
		if (rawPathSplit[1] == clonedEvent.requestContext.stage) {
			rawPathSplit.shift();
			rawPathSplit.shift();
			// console.log(`/${rawPathSplit.join("/")}`);
			clonedEvent.rawPath = `/${rawPathSplit.join("/")}`;
			clonedEvent.requestContext.http.path = `/${rawPathSplit.join("/")}`;
			console.log(clonedEvent);
			return clonedEvent;
		}
	}
	return event;
}

// export const handler: APIGatewayProxyHandlerV2<never> = async (
export const handler: APIGatewayProxyHandlerV2<never> = async (
	event,
	context,
	callback
): Promise<APIGatewayProxyResultV2<never>> => {
	server ??= await bootstrap();

	const removeStage = true;
	event = removeStage ? removeStageFromRequest(event) : event;

	return (await server(event, context, callback)) ?? "void";
};

// export const testHandler: APIGatewayProxyHandlerV2<never> = async (
// 	event,
// 	context
// ) => {
// 	const result = await handler(payload, context, () => {
// 		return undefined;
// 	});
// 	console.log(result);
// 	return result ?? "void";
// };
