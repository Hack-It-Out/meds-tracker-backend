// import { RegularItem } from "@gylfie/common";
// import { UserRoles } from "../user";
import {
	cloneDeep,
	compact,
	isArray,
	join,
	map,
	mergeWith,
	reduce,
} from "lodash";
import { DateTime } from "luxon";

export class CustomObservable<TType = any> {
	private cache?: { value: TType; set: number };
	private value: {
		value?: TType | (() => TType | Promise<TType>);
		set: number;
	};
	constructor(initialValue?: TType | (() => TType | Promise<TType>)) {
		this.value = { value: initialValue, set: Date.now() };
	}

	next(value: TType | (() => TType | Promise<TType>)) {
		this.value = { value, set: Date.now() };
		return this;
	}

	async getValue(): Promise<TType | undefined> {
		if (this.cache && this.cache.set > this.value.set) {
			return this.cache.value;
		}
		if (this.value.value instanceof Function) {
			return (this.cache = {
				value: await this.value.value(),
				set: Date.now(),
			}).value;
		}
		return this.value.value;
	}
}

export class CustomObject<TType = any> {
	private _object?: Partial<TType>;
	private _getter?: () => TType | Promise<TType>;

	constructor(props?: {
		initial?: Partial<TType>;
		getter?: () => TType | Promise<TType>;
	}) {
		this._object = props?.initial;
		this._getter = props?.getter;
	}

	async get<TReturn = any>(key: keyof TType): Promise<TReturn> {
		let value = this._object?.[key];
		if (!value && this._getter) {
			this._object = await this._getter();
			value = this._object?.[key];
		}
		if (value) {
			return value as unknown as TReturn;
		}
		throw new Error(`Unable to get key: ${key.toString()} from object`);
	}
}

export type RemoveFunctions<TProps> = {
	[P in keyof TProps as TProps[P] extends Function
		? never
		: P]: TProps[P] extends Object
		? TProps[P] extends Array<any>
			? RemoveFunctions<TProps[P][]>[]
			: RemoveFunctions<TProps[P]>
		: TProps[P];
};

// export function pluralRole(userRole: string): string {
// 	if (UserRoles[userRole.toUpperCase() as UserRoles]) {
// 		console.log(userRole.toUpperCase());
// 		return userRole.toUpperCase();
// 	}
// 	// currently only support single letter plurals i.e. (s)
// 	if (userRole.endsWith("s")) {
// 		console.log(userRole.substring(0, userRole.length - 1));
// 		return userRole.substring(0, userRole.length - 1);
// 	}
// 	throw new Error("Plural not supported");
// }

export function isGRNProps(props: any): props is GRNProps {
	return props.type == "CODE";
}

export interface CodeGRNProps {
	applicationCode?: string;
	code: string;
	owner?: string;
}
export interface IDGRNProps {
	applicationId: string;
	id: string;
	owner?: string;
}

export type GRNProps<TCode = unknown, TID = unknown> =
	| ({ type: "CODE" } & CodeGRNProps & TCode)
	| ({ type: "ID" } & IDGRNProps & TID);

// No O
const available = "ABCDEFGHIJKLMNPQRSTUVWXYZ0123456789".split("");

export abstract class BaseModel {
	deleted?: boolean;
	visible?: boolean;
	updatedOn?: string = DateTime.utc().toISO();
	version?: number;
	currentVersion?: number;
	createdOn?: string;
	// ExternalID format {prefix}1234567
	// 7 digits should give us about 9 million valid numbers
	// We'll see if this will be the same for other services

	// Improved: Accounts for missing zeros and is relatively faster than the other
	generateExternalID(prefix: string, length?: number) {
		length ??= 7;

		const array = new Array<number>(length);

		for (let i = 0; i < length; i++) {
			array[i] = Math.floor(Math.random() * 10);
		}

		return `${prefix}${array.join("")}`;
	}

	generateSimpleID(props?: {
		prefix?: string;
		length?: number;
		includeDate?: boolean;
	}) {
		const length = props?.length ?? 7;
		const prefix = "";

		const date =
			props?.includeDate == false
				? ""
				: DateTime.utc().toFormat("yyMMdd");

		const randomString = map(new Array(length), () => {
			return available[Math.floor(Math.random() * available.length)];
		}).join("");

		return join(compact([prefix, date, randomString]), "-");

		// return `${prefix}-${date}${randomString}`;
	}

	// abstract update(value: any, options?: { publish?: boolean }): this;
	update(value: any): this {
		if (typeof this.version != "undefined") {
			value.version = (this.currentVersion ?? this.version) + 1;
			value.currentVersion = 0;
		}
		const cloned = cloneDeep(this);
		return mergeWith(
			cloned,
			value,
			{ updatedOn: DateTime.utc().toISO() },
			(objVal, srcVal) => {
				if (isArray(objVal)) {
					return srcVal;
				}
			}
		);
	}
}
