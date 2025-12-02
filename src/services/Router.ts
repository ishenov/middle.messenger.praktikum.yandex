import { Route } from './Route';
import Component, { Props } from './Component';

type ComponentFactory<P extends Props> = () => Component<P>;
type ConcreteComponentConstructor<P extends Props> = new (props: P) => Component<P>;

export class Router {
  private static __instance: Router;

  private routes: Route<any>[] = [];
  private history: History = window.history;
  private _currentRoute: Route<any> | null = null;
  private _rootQuery: string;

  constructor(rootQuery: string) {
    if (Router.__instance) {
      return Router.__instance;
    }

    this.routes = [];
    this.history = window.history;
    this._currentRoute = null;
    this._rootQuery = rootQuery;

    Router.__instance = this;
  }

  use<P extends Props>(pathname: string, block: ComponentFactory<P> | ConcreteComponentConstructor<P>): this {
    const route = new Route(pathname, block, { rootQuery: this._rootQuery });
    this.routes.push(route);
    return this;
  }

  start(): void {
    window.onpopstate = (() => {
      this._onRoute(window.location.pathname);
    }).bind(this);

    this._onRoute(window.location.pathname);
  }

  private _onRoute(pathname: string): void {
    const route = this.getRoute(pathname);
    if (!route) {
      return;
    }

    if (this._currentRoute && this._currentRoute !== route) {
      this._currentRoute.leave();
    }

    this._currentRoute = route;
    route.render();
  }

  go(pathname: string): void {
    this.history.pushState({}, '', pathname);
    this._onRoute(pathname);
  }

  back(): void {
    this.history.back();
  }

  forward(): void {
    this.history.forward();
  }

  getRoute(pathname: string): Route<any> | undefined {
    return this.routes.find(route => route.match(pathname));
  }
}

export default Router;
