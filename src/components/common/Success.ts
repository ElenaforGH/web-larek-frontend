import { ISuccess, ISuccessActions } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Сomponent';

export class Success extends Component<ISuccess> {
	protected _close: HTMLElement;
	protected _description: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);
		this._description = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	set total(value: number) {
		this.setText(this._description, `Списано ${value.toString()} синапсов`);
	}
}
