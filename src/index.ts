import './scss/styles.scss';
import { LarekAPI } from './components/LarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppState } from './components/AppState';
import { Page } from './components/Page';
import { Card } from './components/Card';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { CatalogChangeEvent, ICard, IContactsForm, IOrderForm } from './types';
import { Order } from './components/Order';
import { Success } from './components/common/Success';
import { Contacts } from './components/Contacts';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const appData = new AppState({}, events);
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
});

events.on('contacts:open', () => {
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('contacts:submit', () => {
	api
		.orderProducts(appData.order)
		.then((data) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			success.total = data.total;
			modal.render({
				content: success.render({}),
			});
			appData.clearBasket();
			basket.clearBasket();
			page.counter = 0;
			order.clearPayment();
		})

		.catch((err) => {
			console.error(err);
		});
});

events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { payment, address } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

events.on('formErrors:change', (errors: Partial<IContactsForm>) => {
	const { phone, email } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

events.on(
	'order.payment:change',
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on(
	'order.address:change',
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on(
	'contacts.email:change',
	(data: { field: keyof IContactsForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);
events.on(
	'contacts.phone:change',
	(data: { field: keyof IContactsForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on('order:open', () => {
	modal.render({
		content: order.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

events.on('basket:changed', () => {
	let index = 1;
	basket.items = appData.basket.map((item) => {
		const card = new Card('card', cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('product:delete', item),
		});
		return card.render({
			title: item.title,
			price: item.price,
			index: (index++).toString(),
		});
	});
	appData.order.items = appData.basket.map((item) => item.id);
	appData.order.total = appData.getTotal();
	basket.total = appData.order.total;
});

events.on('card:select', (item: ICard) => {
	appData.setPreview(item);
});

events.on('preview:changed', (item: ICard) => {
	const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			!appData.basket.includes(item)
				? events.emit('product:add', item)
				: events.emit('product:delete', item);
			modal.close();
		},
	});
	appData.basket.includes(item)
		? card.changeButtonText(false)
		: card.changeButtonText(true);
	return modal.render({
		content: card.render({
			description: item.description,
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		}),
	});
});

events.on('counter:changed', () => {
	page.counter = appData.basket.length;
});

events.on('product:add', (item: ICard) => {
	appData.addCardToBasket(item);
});

events.on('product:delete', (item: ICard) => {
	appData.deleteCardFromBasket(item);
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

api
	.getProductsList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
