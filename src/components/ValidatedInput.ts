// Импорты не используются в шаблоне, но могут понадобиться для расширения функциональности
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ValidationService, ValidationResult } from '../services/Validation.js';

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
