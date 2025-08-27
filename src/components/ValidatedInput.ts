export default `<div class="input-wrapper">
  <input 
    id="{{id}}" 
    type="{{type}}" 
    placeholder="{{placeholder}}" 
    value="{{value}}" 
    class="input {{class}}"
    data-field="{{fieldName}}"
  >
  <div class="input-error" style="display: none;"></div>
</div>`;
