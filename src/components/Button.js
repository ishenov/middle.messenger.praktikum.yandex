export default `<button id="{{id}}" class="button {{#if class}}{{class}}{{/if}}" 
{{#if disabled}}
  disabled
{{/if}}>{{text}}</button>`;