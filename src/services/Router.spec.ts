// @ts-nocheck
import { expect } from 'chai';
import sinon from 'sinon';
import { Router } from './Router';
import Component from './Component';

class MockComponent extends Component {
  constructor() {
    super('div');
  }

  render() {
    return `<div id="mock-component">Mock Component</div>`;
  }
}

describe('Router', () => {
  let router: Router;

  beforeEach(() => {
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = '';
    }

    (Router as any).__instance = null;
    router = new Router('#app');

    window.history.replaceState({}, '', '/');
  });

  it('should be a singleton', () => {
    const router2 = new Router('#app');
    expect(router).to.equal(router2);
  });

  it('should add routes', () => {
    router.use('/', MockComponent);
    router.use('/about', MockComponent);
    expect(router.routes.length).to.equal(2);
  });

  it('should go to a route', (done) => {
    router.use('/', MockComponent);
    router.start();
    router.go('/');

    setTimeout(() => {
      const mockComponent = document.getElementById('mock-component');
      expect(mockComponent).to.not.be.null;
      expect(mockComponent?.textContent).to.equal('Mock Component');
      done();
    }, 0);
  });

  it('should return the correct route', () => {
    router.use('/test', MockComponent);
    const route = router.getRoute('/test');
    expect(route).to.not.be.undefined;
    expect(route._pathname).to.equal('/test');
  });

  it('should call history.back on back()', () => {
    const backSpy = sinon.spy(window.history, 'back');
    router.back();
    expect(backSpy.calledOnce).to.be.true;
    backSpy.restore();
  });

  it('should call history.forward on forward()', () => {
    const forwardSpy = sinon.spy(window.history, 'forward');
    router.forward();
    expect(forwardSpy.calledOnce).to.be.true;
    forwardSpy.restore();
  });
});
