import Component from './Component';
import { render } from '../utils/renderDOM';

interface RouteProps {
  rootQuery: string;
}

type ComponentFactory = () => Component;

export class Route {
  private _pathname: string;
  private _blockFactory: ComponentFactory | typeof Component;
  private _block: Component | null;
  private _props: RouteProps;

  constructor(pathname: string, view: ComponentFactory | typeof Component, props: RouteProps) {
    this._pathname = pathname;
    this._blockFactory = view;
    this._block = null;
    this._props = props;
  }

  navigate(pathname: string): void {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render();
    }
  }

  leave(): void {
    if (this._block) {
      this._block.hide();
    }
  }

  match(pathname: string): boolean {
    return pathname === this._pathname;
  }

  render(): void {
    if (!this._block) {
      // @ts-ignore
      if (this._blockFactory.prototype instanceof Component) {
        // It's a class
        // @ts-ignore
        this._block = new this._blockFactory();
      } else {
        // It's a factory function
        this._block = (this._blockFactory as ComponentFactory)();
      }
      render(this._props.rootQuery, this._block);
      return;
    }

    this._block.show();
  }
}
