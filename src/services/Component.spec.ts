// @ts-nocheck
import { expect } from 'chai';
import sinon from 'sinon';
import Component, { Props } from './Component';

class TestComponent extends Component {
  constructor(props: Props) {
    super('div', props);
  }

  render(): string {
    return `<span class="test-content">${this.props.text || ''}</span>`;
  }

  componentDidMount() {}
}

describe('Component', () => {
  it('should initialize with the correct tag', () => {
    const component = new TestComponent({ text: 'Hello' });
    const element = component.getContent();
    expect(element?.tagName).to.equal('DIV');
  });

  it('should render content correctly on initialization', () => {
    const component = new TestComponent({ text: 'Initial' });
    const element = component.getContent();
    const content = element?.querySelector('.test-content');
    expect(content?.textContent).to.equal('Initial');
  });

  it('should update props and re-render when setProps is called', () => {
    const component = new TestComponent({ text: 'Initial' });

    component.setProps({ text: 'Updated' });

    const element = component.getContent();
    const content = element?.querySelector('.test-content');

    expect(component.props.text).to.equal('Updated');
    expect(content?.textContent).to.equal('Updated');
  });

  it('should attach events to the element', () => {
    const onClickSpy = sinon.spy();
    const component = new TestComponent({
      events: {
        click: onClickSpy,
      },
    });

    const element = component.getContent();

    element?.click();

    expect(onClickSpy.calledOnce).to.be.true;
  });

  it('should change display style on show() and hide()', () => {
    const component = new TestComponent({});
    const element = component.getContent();

    component.hide();
    expect(element?.style.display).to.equal('none');

    component.show();
    expect(element?.style.display).to.equal('block');
  });

  it('should call componentDidMount when dispatchComponentDidMount is called', () => {
    const componentDidMountSpy = sinon.spy(TestComponent.prototype, 'componentDidMount');
    const component = new TestComponent({});

    component.dispatchComponentDidMount();

    expect(componentDidMountSpy.calledOnce).to.be.true;

    componentDidMountSpy.restore();
  });
});
