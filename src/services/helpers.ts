import Handlebars from 'handlebars';

export function registerHelpers() {
  Handlebars.registerHelper('eq', function (a, b) {
    console.log(a, b)
    return a === b;
  });
}
