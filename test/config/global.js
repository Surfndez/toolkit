const isBrowser = typeof window === 'object';

const $global = isBrowser ? window : global;

$global.createFromTemplate = (template, parent) =>
    opr.Toolkit.VirtualDOM.createFromDescription(
        opr.Toolkit.Template.describe(template), parent);

$global.createRootInstance = RootClass => {
  const {
    Template,
    VirtualDOM,
  } = opr.Toolkit;
  const description = Template.describe([RootClass]);
  const container = document.createElement('section');
  return VirtualDOM.createRoot(description, null, false, container);
};

$global.createWebComponent = async WebComponent => {
  const instance = createRootInstance(WebComponent);
  const container = document.createElement('main');
  await instance.init(container);
  return instance;
};

$global.createRoot = (template = null, container) => {
  const {
    Template,
    VirtualDOM,
  } = opr.Toolkit;
  class Root extends opr.Toolkit.Root {
    render() {
      return template;
    }
  }
  const root = createRootInstance(Root);
  root.container = document.createElement('main');
  const node = VirtualDOM.createFromDescription(Template.describe(template));
  if (node) {
    root.insertChild(node);
  }
  return root;
};

$global.createComponent = (template = null) => {
  class Component extends opr.Toolkit.Component {
    render() {
      return template;
    }
  }
  return createFromTemplate([Component]);
};
