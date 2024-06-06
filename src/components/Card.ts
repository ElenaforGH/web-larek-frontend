import { IActions, ICard } from '../types';
import { Component } from './base/Сomponent';

export class Card extends Component<ICard> {
	protected _description?: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _category?: HTMLElement;
	protected _index?: HTMLElement;
	protected _button?: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: IActions
	) {
		super(container);
		this._title = container.querySelector(`.${blockName}__title`);
		this._image = container.querySelector(`.${blockName}__image`);
		this._price = container.querySelector(`.${blockName}__price`);
		this._description = container.querySelector(`.${blockName}__text`);
		this._category = container.querySelector(`.${blockName}__category`);
		this._index = container.querySelector('.basket__item-index');
		this._button = container.querySelector(`.${blockName}__button`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string | string[]) {
		if (Array.isArray(value)) {
			this._description.replaceWith(
				...value.map((str) => {
					const descTemplate = this._description.cloneNode() as HTMLElement;
					this.setText(descTemplate, str);
					return descTemplate;
				})
			);
		} else {
			this.setText(this._description, value);
		}
	}

	set category(value: string) {
		this.toggleClass(this._category, 'card__category_other', false);
		switch (value) {
			case 'софт-скил':
				this.toggleClass(this._category, 'card__category_soft', true);
				this._category.textContent = 'софт-скил';
				break;
			case 'другое':
				this.toggleClass(this._category, 'card__category_other', true);
				this._category.textContent = 'другое';
				break;
			case 'хард-скил':
				this.toggleClass(this._category, 'card__category_hard', true);
				this._category.textContent = 'хард-скил';
				break;
			case 'дополнительное':
				this.toggleClass(this._category, 'card__category_additional', true);
				this._category.textContent = 'дополнительное';
				break;
			case 'кнопка':
				this.toggleClass(this._category, 'card__category_button', true);
				this._category.textContent = 'кнопка';
				break;
		}
	}

	set price(value: number | null) {
		if (typeof value === 'number') {
			this._price.textContent = `${value.toString()} синапсов`;
		} else {
			this._price.textContent = 'Бесценно';
			this.setDisabled(this._button, true);
		}
	}

	set index(value: string) {
		this._index.textContent = value;
	}

	changeButtonText(value: boolean) {
		value
			? (this._button.textContent = 'В корзину')
			: (this._button.textContent = 'Удалить из корзины');
	}
}
