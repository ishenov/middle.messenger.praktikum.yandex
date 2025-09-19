/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventBus } from './EventBus.js';

interface ComponentMeta {
  tagName: string;
  props: Record<string, any>;
}

export default class Component {
  static EVENTS = {
    INIT: "init",
    FLOW_CDM: "flow:component-did-mount",
    FLOW_CDU: "flow:component-did-update",
    FLOW_RENDER: "flow:render"
  } as const;

  private _element: HTMLElement | null = null;
  private _meta: ComponentMeta | null = null;
  protected props: Record<string, any>;
  protected eventBus: () => EventBus;
  private _eventListeners: Array<{ element: HTMLElement; event: string; handler: EventListener }> = [];

  constructor(tagName: string = "div", props: Record<string, any> = {}) {
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

  private _componentDidUpdate(oldProps: Record<string, any>, newProps: Record<string, any>): void {
    const response = this.componentDidUpdate(oldProps, newProps);
    if (!response) {
      return;
    }
    this._render();
  }

   
  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(_oldProps: Record<string, any>, _newProps: Record<string, any>): boolean {
    return true;
  }

  setProps = (nextProps: Record<string, any>): void => {
    if (!nextProps) {
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
  }

  render(): string {
    return '';
  }

  getContent(): HTMLElement | null {
    return this.element;
  }

  private _makePropsProxy(props: Record<string, any>): Record<string, any> {
    const self = this;

    return new Proxy(props, {
      get(target: Record<string, any>, prop: string) {
        const value = target[prop];
        return typeof value === "function" ? value.bind(target) : value;
      },
      set(target: Record<string, any>, prop: string, value: any): boolean {
        target[prop] = value;
        
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
