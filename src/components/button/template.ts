export default `<button id="{{id}}" class="button {{class}}"
{{#if type}}type="{{type}}"{{else}}type="button"{{/if}}
{{#if disabled}}
  disabled
{{/if}}>{{text}}</button>`;
