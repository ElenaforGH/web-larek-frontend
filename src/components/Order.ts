import { Form } from './common/Form';
import { IEvents, IOrderForm } from '../types';

export class Order extends Form<IOrderForm> {
	protected _buttonCard: HTMLButtonElement;
	protected _buttonCash: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._buttonCard = container.querySelector('[name="card"]');
		this._buttonCash = container.querySelector('[name="cash"]');

		this._buttonCard.addEventListener('click', () => {
			this._buttonCard.classList.add('button__alt-active');
			this._buttonCash.classList.remove('button__alt-active');
			this.onInputChange('payment', 'card');
		});

		this._buttonCash.addEventListener('click', () => {
			this._buttonCash.classList.add('button__alt-active');
			this._buttonCard.classList.remove('button__alt-active');
			this.onInputChange('payment', 'cash');
		});

		this._submit.addEventListener('click', (event) => {
			event.preventDefault();
			events.emit('contacts:open');
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	clearPayment() {
		this._buttonCash.classList.remove('button__alt-active');
		this._buttonCard.classList.remove('button__alt-active');
		this.onInputChange('payment', '');
	}

}
