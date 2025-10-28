export default `<button id="{{id}}" class="button {{class}}"
{{#if click}}onclick="{{click}}"{{else}}{{/if}}
{{#if type}}type="{{type}}"{{else}}type="button"{{/if}}
{{#if disabled}}
  disabled
{{/if}}>{{text}}</button>`;
