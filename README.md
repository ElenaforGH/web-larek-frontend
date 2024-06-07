https://github.com/ElenaforGH/web-larek-frontend.git
# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
### Интерфейсы и типы:
```
type EventName = string | RegExp;
```
```
type Subscriber = Function;
```
```
type EmitterEvent = {
    eventName: string;
    data: unknown;
};
```
```
export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(
        event: string,
        context?: Partial<T>
    ): (data: T) => void;
}
```
```
export type ApiListResponse<Type> = {
  total: number;
  items: Type[];
};
```
```
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
```
```
export interface IApi {
  baseUrl: string;
  get(uri: string): Promise<object>;
  post(uri: string, data: object, method?: ApiPostMethods): Promise<object>;
}
```
```
export interface ILarekAPI {
  getProductsList: () => Promise<ICard[]>;
  getProduct: (id: string) => Promise<ICard>;
  orderProducts: (order: IOrder) => Promise<IOrderResult>;
}
```
```
export interface IAppState {
  catalog: ICard[];
  basket: string[];
  preview: string | null;
  order: IOrder | null;
  loading: boolean;
}
```
```
export interface IActions {
  onClick: (event: MouseEvent) => void;
}
```
```
export interface IModalData {
  content: HTMLElement;
}
```
```
export interface IPage {
  counter: number;
  catalog: HTMLElement[];
}
```
```
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
```
```
export type CatalogChangeEvent = {
  catalog: ICard[];
};
```
```
export interface IBasket {
  items: HTMLElement[];
  total: number;
}
```
```
export type FormErrors = Partial<Record<keyof IOrder, string>>;
```

```
export interface IFormState {
  valid: boolean;
  errors: string[];
}
```

```
export interface IOrderForm {
  payment: string;
  address: string;
}
```
```
export interface IContactsForm {
  email: string;
  phone: string;
}
```
```
export interface IOrder extends IOrderForm, IContactsForm {
  total: number;
  items: string[];
}
```
```
export interface IOrderResult {
  total: number;
  id: string;
}
```
```
export interface ISuccess {
  total: number;
}
```
```
export interface ISuccessActions {
  onClick: () => void;
}
```

### Базовый код

1. #### Класс Api

Класс Api содержит в себе базовую логику отправки запросов. 

**Поля класса:**

`readonly baseUrl: string;`

`protected options: RequestInit;`

**Конструктор:**

```
    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }
```

**Методы:**

`protected handleResponse(response: Response): Promise<object>`  - метод-обработчик ответа с сервера. Если запрос успешен, возвращает результат запроса в формате JSON, если нет — возвращает ошибку;

`get(uri: string)` — метод для получения данных с сервера при помощи GET-запроса к серверу;

`post(uri: string, data: object, method: ApiPostMethods = 'POST')` — метод для отправки данных на сервер при помощи метода POST.
  

2. #### Класс EventEmitter

Класс EventEmitter позволяет подписываться на события и уведомлять подписчиков о наступлении события. 

**Поля класса:**

`_events: Map<EventName, Set<Subscriber>>;`

 **Конструктор:**
 
```
constructor() {
        this._events = new Map<EventName, Set<Subscriber>>();
    }
```
**Методы:**

`on<T extends object>(eventName: EventName, callback: (event: T) => void)` – метод для подписки на событие;

`off(eventName: EventName, callback: Subscriber)` – метод для отписки от события;

`emit<T extends object>(eventName: string, data?: T)` – метод для уведомления подписчиков о наступлении события;

`onAll(callback: (event: EmitterEvent) => void)` — метод для подписки на все события;

`offAll()` - метод для отписки от всех событий;

`trigger<T extends object>(eventName: string, context?: Partial<T>)` - метод, генерирующий заданное событие с заданными аргументами. 

3. #### Класс Component
Абстрактный класс Component является родителем всех компонентов слоя представления.

**Конструктор:**
```
   protected constructor(protected readonly container: HTMLElement) {
    }
```
**Методы:**

`toggleClass(element: HTMLElement, className: string, force?: boolean)` — для переключения класса;

`protected setText(element: HTMLElement, value: unknown)` — для установки текстового содержимого;

`setDisabled(element: HTMLElement, state: boolean)` — для изменения статуса блокировки;

`protected setHidden(element: HTMLElement)` — для скрытия элемента;

`protected setVisible(element: HTMLElement)` — для отображения элемента;

`protected setImage(element: HTMLImageElement, src: string, alt?: string)` — устанавливает изображение с альтернативным текстом;

`render(data?: Partial<T>): HTMLElement`  - возвращает корневой DOM-элемент.

4. #### Класс Model

Базовый абстрактный класс, предназначенный для создания моделей данных.

**Конструктор:**
```
    constructor(data: Partial<T>, protected events: IEvents) {
        Object.assign(this, data);
    }
```
**Методы:**

`emitChanges(event: string, payload?: object)` — уведомляет подписчиков об изменении модели.

### Слой данных

1. #### Класс AppState

Класс AppState отвечает за хранение данных приложения и содержит методы для работы с этими данными.

**Поля класса:**

`basket: ICard[] = [];`

`catalog: ICard[] = [];`

`order: IOrder;`

`preview: string | null;`

`formErrors: FormErrors = {}.`

**Методы:**

`clearBasket()`  - для очищения корзины;

`getTotal()`  - для получения общей стоимости товаров;

`addCardToBasket(item: ICard)` - для добавления товара в корзину;

`deleteCardFromBasket(item: ICard)` - для удаления товара из корзины; 

`updateBasket()` - для обновления корзины и изменения показателя счетчика;

`setPreview(item: ICard)` - устанавливает превью товара;

`setCatalog(items: ICard[])` - устанавливает каталог товаров;

`setOrderField(field: keyof IOrderForm | keyof IContactsForm, value: string)` - устанавливает значение для поля заказа;

`validateOrder() и  validateContacts()` - для проверки данных заказа на валидность.

2. #### Класс LarekAPI

Класс LarekAPI предоставляет методы, реализующие взаимодействие с бэкендом сервиса.

**Поля класса:**

`readonly cdn: string;`

**Конструктор:**
```
    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

```
**Методы класса:**

`getProduct(id: string): Promise<ICard> - для получения данных с сервера о конкретном товаре по его идентификатору;`

`getProductsList(): Promise<ICard[]> - для получения списка товаров с сервера;`

`orderProducts(order: IOrder): Promise<IOrderResult> - для отправки на сервер информации о заказе.`


### Классы представления

1. #### Класс Card

Класс Card отвечает за отображение карточки товара. В конструктор класса передается DOM элемент темплейта, что позволяет формировать карточки разных вариантов верстки. 

**Поля класса:**

`protected _description?: HTMLElement;`

`protected _image?: HTMLImageElement;`

`protected _title: HTMLElement;`

`protected _price: HTMLElement;`

`protected _category?: HTMLElement;`

`protected _index?: HTMLElement;`

`protected _button?: HTMLButtonElement.`

**Конструктор:**
```
    constructor (protected blockName: string, container: HTMLElement, actions?: IActions) {
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
```
**Методы:**

`set id(value: string)` — устанавливает идентификатор карточки;

`set title(value: string)` — устанавливает название карточки;

`set image(value: string)` — устанавливает изображение в карточке;

`set description(value: string | string[])` - устанавливает описание в карточке;

`set category(value: string)`  - устанавливает категорию в карточке;

`set price(value: number | null)` — устанавливает цену в карточке;

`set index(value: string)` — устанавливает индекс карточки в корзине;

`changeButtonText(value: boolean)` — изменяет текстовое содержимое кнопки.

2. #### Класс Basket

Класс Basket предназначен для отображения данных корзины.

**Поля класса:**

`protected _list: HTMLElement;`

`protected _total: HTMLElement;`

`protected _button: HTMLElement;`

**Конструктор:**
```
    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }
    }
 ```
**Методы:**

`set items(items: HTMLElement[])` - устанавливает список товаров в корзине. В зависимости от длины списка товаров меняется состояние кнопки «Оформить» и отображение сообщения «Корзина пуста»;

`set total(total: number)` — устанавливает общую стоимость товаров в корзине;

`clearBasket()` - очищает корзину и обнуляет счетчик.

3. #### Класс Form

Класс Form предназначен для взаимодействия с формами приложения. 

**Поля класса:**

`protected _submit: HTMLButtonElement;`

`protected _errors: HTMLElement;`

**Конструктор:**
```
    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }
```
**Методы:**

`protected onInputChange(field: keyof T, value: string)` — вызывает событие изменения поля ввода формы;

`set valid(value: boolean)`  - устанавливает состояние кнопки формы в зависимости от  валидности данных;

`set errors(value: string)` — устанавливает текст ошибок формы;

`render(state: Partial<T> & IFormState)` – отрисовывает форму;

4. #### Класс Modal

Класс Modal предназначен для реализации модальных окон.

**Поля класса:**

`protected _closeButton: HTMLButtonElement;`

`protected _content: HTMLElement;`

**Конструктор:**
```
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }
```
**Методы:**

`set content(value: HTMLElement)` - устанавливает содержимое модального окна;

`open()` - для открытия модального окна;

`close()` - для закрытия модального окна;

`render(data: IModalData): HTMLElement` — отрисовывает модальное окно;

 5. #### Класс Success

Класс Success предназначен для реализации модального окна об успешном оформлении заказа.

**Поля класса:**

`protected _close: HTMLElement;`

`protected _description: HTMLElement;`

**Конструктор:**
```
    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        this._close = ensureElement<HTMLElement>('.order-success__close', this.container);
        this._description = ensureElement<HTMLElement>('.order-success__description', this.container);

        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }
```
**Методы:**

`set total(value: number)` — устанавливает общую итоговую стоимость товаров в заказе;

6. #### Класс Page

Класс Page предназначен для отображения главной страницы приложения. 

**Поля класса:**

`protected _counter: HTMLElement;`

`protected _catalog: HTMLElement;`

`protected _wrapper: HTMLElement;`

`protected _basket: HTMLElement;`

**Конструктор:**
```
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._counter = ensureElement<HTMLElement>('.header__basket-counter');
        this._catalog = ensureElement<HTMLElement>('.gallery');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._basket = ensureElement<HTMLElement>('.header__basket');

        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }
```
**Методы:**

`set counter(value: number)` — устанавливает значение счетчика корзины;

`set catalog(items: HTMLElement[])` - устанавливает каталог товаров;

`set locked(value: boolean)` — устанавливает состояние блокировки страницы.

7. #### Класс Order

Класс Order предназначен для отображения формы заказа со способом оплаты и адресом доставки.

**Поля класса:**

`protected _buttonCard: HTMLButtonElement;`

`protected _buttonCash: HTMLButtonElement;`

**Конструктор:**
```
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
  ``` 
**Методы:**

`set address(value: string)` — устанавливает адрес доставки;

`clearPayment()` - сбрасывает способ оплаты заказа.

8. #### Класс Contacts

Класс Contacts предназначен для отображения формы заказа с контактными данными (электронная почта, телефон).

**Конструктор:**
```
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        if (this._submit) {
          this._submit.addEventListener('click', (event) => {
            event.preventDefault();
              events.emit('contacts:submit');
          });
      }
  }
  ```
**Методы:**

`set phone(value: string) — устанавливает номер телефона;`

`set email(value: string) — устанавливает электронную почту.`

### Список всех событий, которые могут генерироваться в системе:

`'items:changed'` — изменение каталога товаров;

`'contacts:submit'` - отправка данных заказа;

`'formErrors:change'` - изменилось состояние валидации формы;

`'order.payment:change'` — изменение оплаты в форме заказа;

`'order.address:change'` — изменение адреса в форме заказа;

`'contacts.email:change'` — изменение электронной почты в форме заказа;

`'contacts.phone:change'` — изменение телефона в форме заказа;

`'order:open'` — открыть форму заказа с выбором способа оплаты и адресом доставки;

`'contacts:open'` — открыть форму заказа с контактными данными (телефон, электронная почта);

`'basket:open'` — открыть корзину;

`'basket:changed'` — изменение корзины;

`'card:select'` — выбран товар;

`'preview:changed'` — изменение превью карточки;

`'counter:changed'` — изменение показателя счетчика корзины;

`'product:add'` — добавление товара в корзину;

`'product:delete'` — удаление товара из корзины;

`'modal:open'` — открытие модального окна;

`'modal:close'` — закрытие модального окна.




