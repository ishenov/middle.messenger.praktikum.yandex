export interface ValidationRule {
  pattern: RegExp;
  message: string;
  required?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export interface FieldValidation {
  [key: string]: ValidationRule;
}

export class ValidationService {
  private static validationRules: FieldValidation = {
    first_name: {
      pattern: /^[А-ЯЁA-Z][а-яёa-z-]*$/,
      message: 'Первая буква должна быть заглавной, только буквы и дефис',
      required: true
    },
    second_name: {
      pattern: /^[А-ЯЁA-Z][а-яёa-z-]*$/,
      message: 'Первая буква должна быть заглавной, только буквы и дефис',
      required: true
    },
    login: {
      pattern: /^[a-zA-Z][a-zA-Z0-9_-]{2,19}$/,
      message: 'От 3 до 20 символов, латиница, может содержать цифры, дефис и подчеркивание',
      required: true
    },
    email: {
      pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z]+\.[a-zA-Z]+$/,
      message: 'Введите корректный email',
      required: true
    },
    password: {
      pattern: /^(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,40}$/,
      message: 'От 8 до 40 символов, обязательно заглавная буква и цифра',
      required: true
    },
    phone: {
      pattern: /^\+?[0-9]{10,15}$/,
      message: 'От 10 до 15 цифр, может начинаться с +',
      required: true
    },
    message: {
      pattern: /^.+$/,
      message: 'Сообщение не может быть пустым',
      required: true
    }
  };

  static validateField(fieldName: string, value: string): ValidationResult {
    const rule = this.validationRules[fieldName];
    
    if (!rule) {
      return { isValid: true, message: '' };
    }

    // Проверка на обязательность
    if (rule.required && (!value || value.trim() === '')) {
      return { isValid: false, message: 'Это поле обязательно для заполнения' };
    }

    // Если поле не обязательное и пустое, считаем валидным
    if (!rule.required && (!value || value.trim() === '')) {
      return { isValid: true, message: '' };
    }

    // Проверка по регулярному выражению
    if (!rule.pattern.test(value)) {
      return { isValid: false, message: rule.message };
    }

    return { isValid: true, message: '' };
  }

  static validateForm(formData: Record<string, string>): Record<string, ValidationResult> {
    const results: Record<string, ValidationResult> = {};
    
    Object.keys(formData).forEach(fieldName => {
      results[fieldName] = this.validateField(fieldName, formData[fieldName]);
    });

    return results;
  }

  static isFormValid(validationResults: Record<string, ValidationResult>): boolean {
    return Object.values(validationResults).every(result => result.isValid);
  }
}
