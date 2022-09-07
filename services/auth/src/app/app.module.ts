import { fromIni } from "@aws-sdk/credential-providers";
import {
	ErrorFilterProvider,
	GylfieModule,
	LoggerInterceptorProvider,
	// DynamoInterceptorProvider,
	ResponseInterceptorProvider,
} from "@gylfie/backend";
import { IndexType } from "@gylfie/common";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Duration } from "luxon";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { V1Module } from "./v1";

@Module({
	imports: [
		GylfieModule.forRoot({
			service: "auth",
			account: "Gylfie",
			developer: "Gitau",
			cognito: {
				controller: true,
				serviceProps: {
					clientID: (() => {
						switch (process.env.LOCATION) {
							case "LOCAL": {
								return process.env.COGNITO_APP_CLIENT_ID_LOCAL;
							}
							case "CLOUD": {
								return process.env.COGNITO_APP_CLIENT_ID;
							}
							default:
								return undefined;
						}
					})(),
					userPoolID: (() => {
						switch (process.env.LOCATION) {
							case "LOCAL": {
								return process.env
									.COGNITO_APP_USERPOOL_ID_LOCAL;
							}
							case "CLOUD": {
								return process.env.COGNITO_APP_USERPOOL_ID;
							}
							default:
								return undefined;
						}
					})(),
				},
			},
			// s3: {
			// 	controller: true,
			// 	serviceProps: {
			// 		buckets: [
			// 			{
			// 				access: "public-read-write",
			// 				name: "meds-tracker-temp",
			// 			},
			// 		],
			// 		credentials:
			// 			process.env.LOCATION == "LOCAL"
			// 				? fromIni({ profile: process.env.AWS_PROFILE })
			// 				: undefined,
			// 	},
			// },
			// dynamo: {
			// 	controller: true,
			// 	serviceProps: {
			// 		// port: 5001,
			// 		credentials:
			// 			process.env.LOCATION == "LOCAL"
			// 				? fromIni({ profile: process.env.AWS_PROFILE })
			// 				: undefined,
			// 		tables: [
			// 			{
			// 				name: process.env.DYNAMO_TABLE_NAME ?? "",
			// 				primaryKey: { partitionKey: "PK", sortKey: "SK" },
			// 				indexes: {
			// 					GSI1: {
			// 						type: IndexType.GSI,
			// 						partitionKey: "GSI1PK",
			// 						sortKey: "SK",
			// 					},
			// 					GSI2: {
			// 						type: IndexType.GSI,
			// 						partitionKey: "GSI2PK",
			// 						sortKey: "GSI2SK",
			// 					},
			// 					GSI3: {
			// 						type: IndexType.GSI,
			// 						partitionKey: "GSI3PK",
			// 						sortKey: "GSI3SK",
			// 					},
			// 					GSI4: {
			// 						type: IndexType.GSI,
			// 						partitionKey: "GSI4PK",
			// 						sortKey: "GSI4SK",
			// 					},
			// 					GSI5: {
			// 						type: IndexType.GSI,
			// 						partitionKey: "GSI5PK",
			// 						sortKey: "GSI4SK",
			// 					},
			// 					GSI6: {
			// 						type: IndexType.GSI,
			// 						partitionKey: "GSI6PK",
			// 						sortKey: "GSI6SK",
			// 					},
			// 				},
			// 			},
			// 		],
			// 		cache: {
			// 			duration: Duration.fromObject({ seconds: 10 }).as(
			// 				"milliseconds"
			// 			),
			// 		},
			// 	},
			// },
			logger: {
				controller: true,
				serviceProps: { console: true },
			},
			isGlobal: true,
			environment: process.env.ENVIRONMENT,
		}),
		ConfigModule.forRoot({
			isGlobal: true,
			load: [
				// process.env.TEST_ENVIRONMENT == "LOCAL"
			],
			envFilePath: [
				// process.env.LOCATION == "LOCAL"
				// 	? join(process.cwd(), ".env")
				// 	: "./.env",
			],
		}),

		V1Module,
	],
	controllers: [AppController],
	providers: [
		// {
		// 	provide: APP_GUARD,
		// 	useClass: JwtGuard,
		// },
		ErrorFilterProvider,
		// DynamoInterceptorProvider,
		// LoggerInterceptorProvider,
		ResponseInterceptorProvider,
		AppService,
	],
})
export class AppModule {}
