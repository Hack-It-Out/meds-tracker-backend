import { Controller, Get } from "@nestjs/common";
import { V1Service } from "./v1.service";

@Controller({ version: "1" })
export class V1Controller {
	constructor(private readonly v1Service: V1Service) {}

	@Get()
	getHello(): string {
		return this.v1Service.getHello();
	}
}
