export type EventName = string | RegExp;
export type Subscriber = Function;
export type EmitterEvent = {
	eventName: string;
	data: unknown;
};

export interface IEvents {
	on<T extends object>(event: EventName, callback: (data: T) => void): void;
	emit<T extends object>(event: string, data?: T): void;
	trigger<T extends object>(
		event: string,
		context?: Partial<T>
	): (data: T) => void;
}
export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
	baseUrl: string;
	get(uri: string): Promise<object>;
	post(uri: string, data: object, method?: ApiPostMethods): Promise<object>;
}

export interface ILarekAPI {
	getProductsList: () => Promise<ICard[]>;
	getProduct: (id: string) => Promise<ICard>;
	orderProducts: (order: IOrder) => Promise<IOrderResult>;
}

export interface IAppState {
	catalog: ICard[];
	basket: string[];
	preview: string | null;
	order: IOrder | null;
	loading: boolean;
}

export interface IActions {
	onClick: (event: MouseEvent) => void;
}

export interface IModalData {
	content: HTMLElement;
}

export interface IPage {
	counter: number;
	catalog: HTMLElement[];
}

export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	index: string;
	button: string;
}

export type CatalogChangeEvent = {
	catalog: ICard[];
};

export interface IBasket {
	items: HTMLElement[];
	total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IFormState {
	valid: boolean;
	errors: string[];
}

export interface IOrderForm {
	payment: string;
	address: string;
}

export interface IContactsForm {
	email: string;
	phone: string;
}

export interface IOrder extends IOrderForm, IContactsForm {
	total: number;
	items: string[];
}

export interface IOrderResult {
	total: number;
	id: string;
}

export interface ISuccess {
	total: number;
}

export interface ISuccessActions {
	onClick: () => void;
}
