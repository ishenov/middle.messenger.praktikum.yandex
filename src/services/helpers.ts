import Handlebars from 'handlebars';

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  const isToday = date.getFullYear() === now.getFullYear() &&
                  date.getMonth() === now.getMonth() &&
                  date.getDate() === now.getDate();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    return date.toLocaleDateString();
  }
}

function resourceUrl(path: string) {
  if (!path) {
    return '';
  }
  return `https://ya-praktikum.tech/api/v2/resources${path}`;
}

export function registerHelpers() {
  Handlebars.registerHelper('eq', function (a, b) {
    return a === b;
  });

  Handlebars.registerHelper('formatTime', formatTime);
  Handlebars.registerHelper('resourceUrl', resourceUrl);
}
