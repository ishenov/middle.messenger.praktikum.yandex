import Component, { Props } from './Component';
import { render } from '../utils/renderDOM';

interface RouteProps {
  rootQuery: string;
}

type ComponentFactory<P extends Props> = () => Component<P>;
type ConcreteComponentConstructor<P extends Props> = new (props: P) => Component<P>;

// User-defined type guard to check if a value is a concrete component constructor
function isComponentConstructor<P extends Props>(view: ComponentFactory<P> | ConcreteComponentConstructor<P>): view is ConcreteComponentConstructor<P> {
  // Check if it's a function (constructor) and its prototype inherits from Component
  return typeof view === 'function' && view.prototype instanceof Component;
}

export class Route<P extends Props> {
  private _pathname: string;
  private _blockFactory: ComponentFactory<P> | ConcreteComponentConstructor<P>;
  private _block: Component<P> | null;
  private _props: RouteProps;

  constructor(pathname: string, view: ComponentFactory<P> | ConcreteComponentConstructor<P>, props: RouteProps) {
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
      if (isComponentConstructor(this._blockFactory)) {
        // It's a concrete class constructor, safe to instantiate
        this._block = new this._blockFactory({} as P);
      } else {
        // It's a factory function
        this._block = this._blockFactory();
      }
    }
    // Always re-render the block into the root query to ensure DOM is updated with latest HTML
    render(this._props.rootQuery, this._block as Component<P>);
    this._block?.show();
  }
}
