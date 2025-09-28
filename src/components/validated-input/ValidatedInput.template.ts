export default `<div class="input-wrapper">
  <input 
    id="{{id}}" 
    type="{{type}}" 
    placeholder="{{placeholder}}" 
    value="{{value}}" 
    class="input {{class}}"
    data-field="{{fieldName}}"
    {{#if required}}required{{/if}}
    {{#if disabled}}disabled{{/if}}
  >
  <div class="input-error" style="display: none;">{{errorMessage}}</div>
</div>`;
