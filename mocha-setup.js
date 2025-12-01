import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><body><div id="app"></div></body>', {
  url: 'http://localhost',
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLElement = dom.window.HTMLElement;
global.PopStateEvent = dom.window.PopStateEvent; // Add PopStateEvent to global

global.requestAnimationFrame = (callback) => {
  return setTimeout(callback, 0);
};

global.cancelAnimationFrame = (id) => {
  clearTimeout(id);
};
