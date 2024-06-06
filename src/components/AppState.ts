import { Model } from './base/Model';
import {
	FormErrors,
	IAppState,
	ICard,
	IContactsForm,
	IOrder,
	IOrderForm,
} from '../types';

export class AppState extends Model<IAppState> {
	basket: ICard[] = [];
	catalog: ICard[] = [];
	order: IOrder = {
		email: '',
		phone: '',
		address: '',
		payment: '',
		total: 0,
		items: [],
	};
	preview: string | null;
	formErrors: FormErrors = {};

	clearBasket() {
		this.basket = [];
	}

	getTotal() {
		return this.order.items.reduce(
			(a, c) => a + this.catalog.find((it) => it.id === c).price,
			0
		);
	}

	addCardToBasket(item: ICard) {
		this.basket.push(item);
		this.updateBasket();
	}

	deleteCardFromBasket(item: ICard) {
		this.basket.splice(this.basket.indexOf(item), 1);
		this.updateBasket();
	}

	updateBasket() {
		this.emitChanges('basket:changed', this.basket);
		this.emitChanges('counter:changed', this.basket);
	}

	setPreview(item: ICard) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	setCatalog(items: ICard[]) {
		this.catalog = items;
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setOrderField(field: keyof IOrderForm | keyof IContactsForm, value: string) {
		this.order[field] = value;

		if (this.validateOrder() && this.validateContacts()) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		const address = /^[а-я\s.]+?\d+/i;
		if (!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}
		if (!this.order.address || !address.test(this.order.address)) {
			errors.address = 'Необходимо указать адрес';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContacts() {
		const errors: typeof this.formErrors = {};
		const phone = /^[\d\+][\d\(\)\ -]{4,14}\d$/;
		const email = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
		if (!this.order.email || !email.test(this.order.email)) {
			errors.email = 'Необходимо указать адрес электронной почты';
		}
		if (!this.order.phone || !phone.test(this.order.phone)) {
			errors.phone = 'Необходимо указать телефон';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
