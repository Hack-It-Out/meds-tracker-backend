import { fromIni } from "@aws-sdk/credential-providers";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Duration } from "luxon";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { V1Module } from "./v1";

@Module({
	imports: [
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
	providers: [AppService],
})
export class AppModule {}
