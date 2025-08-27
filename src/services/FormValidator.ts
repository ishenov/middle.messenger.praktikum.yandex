import { ValidationService, ValidationResult } from './Validation.js';

export interface FormField {
  name: string;
  value: string;
  error: string;
}

export class FormValidator {
  private formElement: HTMLFormElement;
  private validationResults: Record<string, ValidationResult> = {};
  private onSubmitCallback?: (formData: Record<string, string>) => void;

  constructor(formElement: HTMLFormElement, onSubmitCallback?: (formData: Record<string, string>) => void) {
    this.formElement = formElement;
    this.onSubmitCallback = onSubmitCallback;
    this.initializeValidation();
  }

  private initializeValidation(): void {
    // Добавляем обработчики событий
    this.formElement.addEventListener('blur', this.handleBlur.bind(this), true);
    this.formElement.addEventListener('input', this.handleInput.bind(this), true);
    this.formElement.addEventListener('submit', this.handleSubmit.bind(this));
  }

  private handleBlur(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.tagName === 'INPUT') {
      const fieldName = target.dataset.field;
      if (fieldName) {
        this.validateField(fieldName, target.value);
        this.updateFieldDisplay(fieldName, target);
      }
    }
  }

  private handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.tagName === 'INPUT') {
      const fieldName = target.dataset.field;
      if (fieldName && this.validationResults[fieldName]) {
        // Если поле уже было валидировано и есть ошибка, проверяем снова
        const result = this.validationResults[fieldName];
        if (!result.isValid) {
          this.validateField(fieldName, target.value);
          this.updateFieldDisplay(fieldName, target);
        }
      }
    }
  }

  private handleSubmit(event: Event): void {
    event.preventDefault();
    
    const formData = this.getFormData();
    const validationResults = ValidationService.validateForm(formData);
    
    // Логируем только если форма валидна
    if (ValidationService.isFormValid(validationResults)) {
      console.log('=== ОТПРАВКА ФОРМЫ ===');
      console.log('ID формы:', this.formElement.id);
      console.log('Данные формы:', formData);
      console.log('=====================');
    }
    
    // Обновляем все поля
    Object.keys(validationResults).forEach(fieldName => {
      this.validationResults[fieldName] = validationResults[fieldName];
      this.updateFieldDisplay(fieldName);
    });

    // Если форма валидна, вызываем callback
    if (ValidationService.isFormValid(validationResults)) {
      if (this.onSubmitCallback) {
        this.onSubmitCallback(formData);
      }
      // Очищаем поля после успешной отправки (кроме профиля и смены пароля)
      this.clearFormIfNeeded();
    } else {
      // Показываем ошибки для всех невалидных полей
      this.showAllErrors();
    }
  }

  private validateField(fieldName: string, value: string): void {
    this.validationResults[fieldName] = ValidationService.validateField(fieldName, value);
  }

  private updateFieldDisplay(fieldName: string, inputElement?: HTMLInputElement): void {
    const input = inputElement || this.formElement.querySelector(`[data-field="${fieldName}"]`) as HTMLInputElement;
    if (!input) return;

    const result = this.validationResults[fieldName];
    const wrapper = input.closest('.input-wrapper');
    const errorElement = wrapper?.querySelector('.input-error') as HTMLElement;

    if (result && !result.isValid) {
      input.classList.add('input--error');
      if (errorElement) {
        errorElement.textContent = result.message;
        errorElement.style.display = 'block';
      }
    } else {
      input.classList.remove('input--error');
      if (errorElement) {
        errorElement.style.display = 'none';
      }
    }
  }

  private getFormData(): Record<string, string> {
    const formData: Record<string, string> = {};
    const inputs = this.formElement.querySelectorAll('input[data-field]') as NodeListOf<HTMLInputElement>;
    
    inputs.forEach(input => {
      const fieldName = input.dataset.field;
      if (fieldName) {
        formData[fieldName] = input.value;
      }
    });

    return formData;
  }

  private showAllErrors(): void {
    Object.keys(this.validationResults).forEach(fieldName => {
      this.updateFieldDisplay(fieldName);
    });
  }

  private clearFormIfNeeded(): void {
    const formId = this.formElement.id;
    // Очищаем только определенные формы
    if (formId === 'login-form' || formId === 'registration-form' || formId === 'test-form') {
      const inputs = this.formElement.querySelectorAll('input[data-field]') as NodeListOf<HTMLInputElement>;
      inputs.forEach(input => {
        input.value = '';
        // Убираем класс ошибки
        input.classList.remove('input--error');
        // Скрываем сообщение об ошибке
        const wrapper = input.closest('.input-wrapper');
        const errorElement = wrapper?.querySelector('.input-error') as HTMLElement;
        if (errorElement) {
          errorElement.style.display = 'none';
        }
      });
      // Очищаем результаты валидации
      this.validationResults = {};
    }
  }

  public destroy(): void {
    this.formElement.removeEventListener('blur', this.handleBlur.bind(this), true);
    this.formElement.removeEventListener('input', this.handleInput.bind(this), true);
    this.formElement.removeEventListener('submit', this.handleSubmit.bind(this));
  }
}
