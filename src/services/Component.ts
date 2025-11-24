import { EventBus } from './EventBus.js';

interface ComponentMeta<Props extends Record<string, unknown> = Record<string, unknown>> {
  tagName: string;
  props: Props;
}
export type TEvent = (e:Event)=>void;
type Events = {
  [key: string | symbol]:TEvent;
};
type Parent = Component | undefined;

export type Props = {
  events?: Events,
  parent?: Parent,
  [key: string | symbol]: any,
};

export default abstract class Component {
  static EVENTS = {
    INIT: "init",
    FLOW_CDM: "flow:component-did-mount",
    FLOW_CDU: "flow:component-did-update",
    FLOW_RENDER: "flow:render"
  } as const;

  private _element: HTMLElement | null = null;
  private _meta: ComponentMeta<Props> | null = null;
  protected props: Props;
  protected eventBus: () => EventBus;
  private _eventListeners: Array<{ element: HTMLElement; event: string; handler: EventListener }> = [];

  constructor(tagName: string = "div", props: Props = {} as Props) {
    const eventBus = new EventBus();
    this._meta = {
      tagName,
      props
    };

    this.props = this._makePropsProxy(props);
    this.eventBus = () => eventBus;

    this._registerEvents(eventBus);
    eventBus.emit(Component.EVENTS.INIT);
  }

  private _registerEvents(eventBus: EventBus): void {
    eventBus.on(Component.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Component.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Component.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Component.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  private _addEvents() {
    const {events = {}} = this.props;

    // @ts-ignore
    Object.keys(events).forEach(eventName => {
      // @ts-ignore
      this._element?.addEventListener(eventName, events[eventName]);
    });
  }

  private _createResources(): void {
    if (!this._meta) return;
    const { tagName } = this._meta;
    this._element = this._createDocumentElement(tagName);
  }

  init(): void {
    this._createResources();
    this.eventBus().emit(Component.EVENTS.FLOW_RENDER);
  }

  private _componentDidMount(): void {
    this.componentDidMount();
  }

  componentDidMount(): void {}

  dispatchComponentDidMount(): void {
    this.eventBus().emit(Component.EVENTS.FLOW_CDM);
  }

  private _componentDidUpdate(oldProps: Props, newProps: Props): void {
    const response = this.componentDidUpdate(oldProps, newProps);
    if (!response) {
      return;
    }
    this._render();
  }


  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(_oldProps: Props, _newProps: Props): boolean {
    return true;
  }

  setProps = (nextProps: Partial<Props>): void => {
    if (Object.keys(nextProps).length === 0) {
      return;
    }

    Object.assign(this.props, nextProps);
  };

  get element(): HTMLElement | null {
    return this._element;
  }

  private _render(): void {
    const block = this.render();
    if (this._element && block) {
      this._element.innerHTML = block;
    }

    this._addEvents();
  }

  render(): string {
    return '';
  }

  getContent(): HTMLElement | null {
    return this.element;
  }

  private _makePropsProxy(props: Props): Props {
    const self = this;

    return new Proxy(props, {
      get(target: Props, prop: string): unknown {
        const value = target[prop as keyof Props];
        return typeof value === "function" ? value.bind(target) : value;
      },
      set(target: Props, prop: string, value: unknown): boolean {
        (target as Record<string, unknown>)[prop] = value;

        self.eventBus().emit(Component.EVENTS.FLOW_CDU, {...target}, target);
        return true;
      },
      deleteProperty(): never {
        throw new Error("Нет доступа");
      }
    });
  }

  private _createDocumentElement(tagName: string): HTMLElement {
    return document.createElement(tagName);
  }

  show(): void {
    const content = this.getContent();
    if (content) {
      content.style.display = "block";
    }
  }

  hide(): void {
    const content = this.getContent();
    if (content) {
      content.style.display = "none";
    }
  }

  // Методы для управления DOM событиями
  protected addEventListener(element: HTMLElement, event: string, handler: EventListener): void {
    element.addEventListener(event, handler);
    this._eventListeners.push({ element, event, handler });
  }

  protected removeEventListener(element: HTMLElement, event: string, handler: EventListener): void {
    element.removeEventListener(event, handler);
    this._eventListeners = this._eventListeners.filter(
      listener => !(listener.element === element && listener.event === event && listener.handler === handler)
    );
  }

  protected removeAllEventListeners(): void {
    this._eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this._eventListeners = [];
  }

  // Метод для делегирования событий
  protected delegateEventListener(selector: string, event: string, handler: EventListener): void {
    if (!this._element) return;

    const delegatedHandler = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.matches(selector)) {
        handler(e);
      }
    };

    this.addEventListener(this._element, event, delegatedHandler);
  }

  // Переопределяем для очистки событий при уничтожении компонента
  destroy(): void {
    this.removeAllEventListeners();
  }
}
