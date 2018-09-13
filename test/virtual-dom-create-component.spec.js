describe('Virtual DOM', () => {

  const {
    Renderer,
    VirtualDOM,
    Template,
  } = opr.Toolkit;

  const container = document.createElement('container');

  class SomeRoot extends opr.Toolkit.Root {
    render() {
      return null;
    }
  }

  const root = VirtualDOM.createRoot(SomeRoot);

  const render = (ComponentClass, props = {}) => {
    const description = Template.describe([
      ComponentClass,
      props,
    ]);
    return VirtualDOM.createFromDescription(description);
  };

  describe('=> render component', () => {

    it('creates a leaf with a single element', () => {

      // given
      class LeafComponent extends opr.Toolkit.Component {
        render() {
          return [
            'a',
            {
              href: this.props.url,
            },
            this.props.label,
          ];
        }
      };

      const label = 'Example';
      const url = 'http://www.example.com';
      const component = render(LeafComponent, {url, label});

      // then
      assert(component.isComponent());
      assert.equal(component.childElement, component.child);

      assert(component.child.isElement());
      assert.equal(component.child.parentNode, component);

      assert.equal(component.child.description.name, 'a');
      assert.equal(component.child.description.text, label);
      assert.equal(component.child.description.attrs.href, url);
    });

    it('creates a leaf with nested elements', () => {

      // given
      class NestedElements extends opr.Toolkit.Component {
        render() {
          return [
            'div',
            [
              'span',
              {
                onClick: this.props.onClick,
              },
              [
                'a',
                {
                  href: this.props.url,
                },
                this.props.label,
              ],
            ],
          ];
        }
      }

      loader.define('NestedElements', NestedElements);

      const label = 'Example';
      const url = 'http://www.example.com';
      const onClick = () => {};
      const component = render(NestedElements, {
        url,
        label,
        onClick,
      });

      // then
      const divElement = component.child;
      const spanElement = divElement.children[0];
      const linkElement = spanElement.children[0];

      assert(component.isComponent());
      assert.equal(component.childElement, divElement);

      assert(divElement.isElement());
      assert.equal(divElement.parentNode, component);

      assert.equal(divElement.description.name, 'div');
      assert(divElement.children);
      assert.equal(divElement.children.length, 1);

      assert(spanElement.isElement());
      assert.equal(spanElement.parentNode, divElement);
      assert.equal(spanElement.parentElement, divElement);

      assert.equal(spanElement.description.name, 'span');
      assert.equal(spanElement.description.listeners.onClick, onClick);
      assert(spanElement.children);
      assert.equal(spanElement.children.length, 1);

      assert(linkElement.isElement());
      assert.equal(linkElement.parentNode, spanElement);
      assert.equal(linkElement.parentElement, spanElement);

      assert.equal(linkElement.description.name, 'a');
      assert(linkElement.description.attrs.href, url);
      assert(linkElement.description.text, label);
    });

    it('creates a branch with nested components', () => {

      // given
      class Application extends opr.Toolkit.Component {
        render() {
          return [
            Parent,
            [
              'p',
              {
                class: 'passed-from-application',
              },
            ],
          ];
        }
      }

      class Parent extends opr.Toolkit.Component {
        render() {
          return [
            Child,
            [
              'div',
              {
                class: 'passed-from-parent',
              },
              ...this.children,
            ],
          ];
        }
      }

      class Child extends opr.Toolkit.Component {
        render() {
          return [
            'span',
            {
              id: 'child',
            },
            ...this.children,
          ];
        }
      }

      const component = render(Application);

      // then
      assert(component.isComponent());
      assert.equal(component.constructor, Application);

      const parent = component.child;
      assert(parent.isComponent());
      assert.equal(parent.constructor, Parent);

      const child = parent.child;
      assert(child.isComponent());
      assert.equal(child.constructor, Child);

      const spanElement = child.child;
      assert(spanElement.isElement());

      const divElement = spanElement.children[0];
      assert(divElement.isElement());

      const paragraphElement = divElement.children[0];
      assert(paragraphElement.isElement());

      assert.equal(component.childElement, spanElement);
      assert.equal(parent.childElement, spanElement);
      assert.equal(child.childElement, spanElement);

      assert.equal(parent.parentNode, component);
      assert.equal(child.parentNode, parent);
      assert.equal(spanElement.parentNode, child);
      assert.equal(divElement.parentNode, spanElement);
      assert.equal(paragraphElement.parentNode, divElement);
    });

  });
});
