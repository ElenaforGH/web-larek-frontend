import { Form } from './common/Form';
import { IContactsForm, IEvents } from '../types';

export class Contacts extends Form<IContactsForm> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		if (this._submit) {
			this._submit.addEventListener('click', (event) => {
				event.preventDefault();
				events.emit('contacts:submit');
			});
		}
	}
	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}
