declare module "africastalking" {
	function initialize(credentials: Credentials): AfricaIsTalkingClient;
	class AfricaIsTalkingClient {
		constructor(credentials: Credentials);
		SMS: SMSModule;
	}

	interface SMSModule {
		send(props: { to: string[]; message: string }): Promise<any>;
	}

	interface Credentials {
		apiKey: string;
		username: string;
	}

	export = initialize;
}
