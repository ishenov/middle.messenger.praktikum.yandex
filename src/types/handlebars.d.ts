/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

declare module '*.hbs?raw' {
  const content: string;
  export default content;
}

declare module 'handlebars' {
  export interface HandlebarsTemplateDelegate<T = any> {
     
    (context?: T, options?: any): string;
  }

  export function compile<T = any>(template: string): HandlebarsTemplateDelegate<T>;
   
  export function registerPartial(name: string, partial: string): void;
}
