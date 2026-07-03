import { Meta, StoryObj, moduleMetadata, applicationConfig } from '@storybook/angular';
import { Register } from '../app/components/auth/register/register';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { of, throwError } from 'rxjs';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Loader } from '../app/shared/components/modal/loader/loader';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../app/services/auth/auth';

// Mock services
class MockAuthService {
  register(data: any) {
    return of({}); // Default to success
  }
}

class MockNotificationService {
  success(title: string, message: string) {}
  error(title: string, message: string) {}
}

class MockRouter {
  navigateByUrl(url: string) {}
}

const meta: Meta<Register> = {
  title: 'Auth/Register',
  component: Register,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        NzFormModule,
        NzInputModule,
        NzSelectModule,
        NzButtonModule,
        NzCheckboxModule,
        NzIconModule,
        NzSpinModule,
        Loader
      ],
      providers: [
        FormBuilder,
        { provide: Auth, useClass: MockAuthService },
        { provide: NzNotificationService, useClass: MockNotificationService },
        { provide: Router, useClass: MockRouter }
      ]
    }),
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserAnimationsModule)
      ]
    })
  ],
  parameters: {
     layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/your-register-component-design'
    }
  }
};

export default meta;
type Story = StoryObj<Register>;

// Default state - empty form
export const Default: Story = {
  parameters: {
     docs: {
      description: {
        story: 'Default state of the registration form with empty fields.'
      }
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ptGNDPmiaBGgwx0ECtGD3g/WebApp_Design?node-id=1094-3184&t=0Zl3kv5JbtOXpqNQ-1'
    }
  }
};

// Valid form state
export const ValidForm: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Form with all valid inputs filled out correctly.'
      }
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ptGNDPmiaBGgwx0ECtGD3g/WebApp_Design?node-id=1094-3184&t=0Zl3kv5JbtOXpqNQ-1'
    }
  },
  render: () => ({
    template: `<app-register></app-register>`,
    applicationConfig: {
      providers: [
        {
          provide: Auth,
          useValue: {
            register: () => of({}) // Mock successful registration
          }
        }
      ]
    }
  })
};

// Invalid form state - all fields with errors
export const InvalidForm: Story = {
  parameters: {
     docs: {
      description: {
        story: 'Form showing validation errors for all fields with invalid inputs.'
      }
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ptGNDPmiaBGgwx0ECtGD3g/WebApp_Design?node-id=1143-3975&t=0Zl3kv5JbtOXpqNQ-1'
    }
  },
  play: async ({ canvasElement }) => {
    // Simulate user interaction with invalid data
    const firstNameInput = canvasElement.querySelector('[formControlName="firstName"]') as HTMLInputElement;
    const emailInput = canvasElement.querySelector('[formControlName="email"]') as HTMLInputElement;
    const phoneInput = canvasElement.querySelector('[formControlName="phone"]') as HTMLInputElement;
    const passwordInput = canvasElement.querySelector('[formControlName="password"]') as HTMLInputElement;
    const confirmPasswordInput = canvasElement.querySelector('[formControlName="confirmPassword"]') as HTMLInputElement;
    const agreeCheckbox = canvasElement.querySelector('[formControlName="agree"]') as HTMLInputElement;
    const submitButton = canvasElement.querySelector('button[nzType="primary"]') as HTMLButtonElement;
    
    // Set invalid values
    firstNameInput.value = '';
    firstNameInput.dispatchEvent(new Event('input'));
    firstNameInput.dispatchEvent(new Event('blur'));
    
    emailInput.value = 'invalid-email';
    emailInput.dispatchEvent(new Event('input'));
    emailInput.dispatchEvent(new Event('blur'));
    
    phoneInput.value = '123';
    phoneInput.dispatchEvent(new Event('input'));
    phoneInput.dispatchEvent(new Event('blur'));
    
    passwordInput.value = 'short';
    passwordInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('blur'));
    
    confirmPasswordInput.value = 'different';
    confirmPasswordInput.dispatchEvent(new Event('input'));
    confirmPasswordInput.dispatchEvent(new Event('blur'));
    
    agreeCheckbox.checked = false;
    agreeCheckbox.dispatchEvent(new Event('change'));
    
    // Submit the form
    submitButton.click();
  }
};

// Field-specific error states
export const FirstNameError: Story = {
  parameters: {
    docs: {
      description: {
        story: 'First name input field with validation error for required field.'
      }
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ptGNDPmiaBGgwx0ECtGD3g/WebApp_Design?node-id=1149-4269&t=0Zl3kv5JbtOXpqNQ-1'
    }
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('[formControlName="firstName"]') as HTMLInputElement;
    input.value = '';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
  }
};

export const EmailError: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ptGNDPmiaBGgwx0ECtGD3g/WebApp_Design?node-id=1149-4428&t=0Zl3kv5JbtOXpqNQ-1'
    }
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('[formControlName="email"]') as HTMLInputElement;
    input.value = 'invalid-email';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
  }
};

export const PhoneError: Story = {
  name: 'Phone Error - Invalid Pattern',
  parameters: {
    docs: {
      description: {
        story: 'Phone number input field with validation error for invalid pattern.'
      }
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ptGNDPmiaBGgwx0ECtGD3g/WebApp_Design?node-id=1149-4636&t=0Zl3kv5JbtOXpqNQ-1'
    }
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('[formControlName="phone"]') as HTMLInputElement;
    input.value = '1234567890'; // Invalid Indian phone number
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
  }
};

export const PasswordMismatch: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/your-register-component-design/password-mismatch'
    }
  },
  play: async ({ canvasElement }) => {
    const passwordInput = canvasElement.querySelector('[formControlName="password"]') as HTMLInputElement;
    const confirmInput = canvasElement.querySelector('[formControlName="confirmPassword"]') as HTMLInputElement;
    
    passwordInput.value = 'password123';
    passwordInput.dispatchEvent(new Event('input'));
    
    confirmInput.value = 'differentPassword';
    confirmInput.dispatchEvent(new Event('input'));
    confirmInput.dispatchEvent(new Event('blur'));
  }
};

export const TermsNotAccepted: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Terms and conditions checkbox with validation error state.'
      }
    },
    design: {
      type: 'figma',
      url: ''
    }
  },
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector('[formControlName="agree"]') as HTMLInputElement;
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change'));
    checkbox.dispatchEvent(new Event('blur'));
  }
};

// Loading state during submission
export const LoadingState: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Form in loading state during submission with spinner overlay.'
      }
    },
    design: {
      type: 'figma',
      url: ''
    }
  },
  render: () => ({
    template: `<app-register></app-register>`,
    applicationConfig: {
      providers: [
        {
          provide: Auth,
          useValue: {
            register: () => {
              // Return an observable that never completes to show loading state
              return new Promise(() => {});
            }
          }
        }
      ]
    }
  }),
  play: async ({ canvasElement }) => {
    // Fill form with valid data
    const firstNameInput = canvasElement.querySelector('[formControlName="firstName"]') as HTMLInputElement;
    const lastNameInput = canvasElement.querySelector('[formControlName="lastName"]') as HTMLInputElement;
    const emailInput = canvasElement.querySelector('[formControlName="email"]') as HTMLInputElement;
    const phoneInput = canvasElement.querySelector('[formControlName="phone"]') as HTMLInputElement;
    const passwordInput = canvasElement.querySelector('[formControlName="password"]') as HTMLInputElement;
    const confirmPasswordInput = canvasElement.querySelector('[formControlName="confirmPassword"]') as HTMLInputElement;
    const submitButton = canvasElement.querySelector('button[nzType="primary"]') as HTMLButtonElement;
    
    firstNameInput.value = 'John';
    firstNameInput.dispatchEvent(new Event('input'));
    
    lastNameInput.value = 'Doe';
    lastNameInput.dispatchEvent(new Event('input'));
    
    emailInput.value = 'john.doe@example.com';
    emailInput.dispatchEvent(new Event('input'));
    
    phoneInput.value = '9876543210';
    phoneInput.dispatchEvent(new Event('input'));
    
    passwordInput.value = 'password123';
    passwordInput.dispatchEvent(new Event('input'));
    
    confirmPasswordInput.value = 'password123';
    confirmPasswordInput.dispatchEvent(new Event('input'));
    
    // Submit the form
    submitButton.click();
  }
};

// Successful registration
export const SuccessfulRegistration: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Form after successful registration showing success notification.'
      }
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ptGNDPmiaBGgwx0ECtGD3g/WebApp_Design?node-id=1155-5349&t=0Zl3kv5JbtOXpqNQ-1'
    }
  },
  render: () => ({
    template: `<app-register></app-register>`,
    applicationConfig: {
      providers: [
        {
          provide: Auth,
          useValue: {
            register: () => of({}) // Mock successful registration
          }
        },
        {
          provide: NzNotificationService,
          useValue: {
            success: (title: string, message: string) => {
              console.log('Success notification:', title, message);
            }
          }
        }
      ]
    }
  }),
  play: async ({ canvasElement }) => {
    // Fill form with valid data
    const firstNameInput = canvasElement.querySelector('[formControlName="firstName"]') as HTMLInputElement;
    const lastNameInput = canvasElement.querySelector('[formControlName="lastName"]') as HTMLInputElement;
    const emailInput = canvasElement.querySelector('[formControlName="email"]') as HTMLInputElement;
    const phoneInput = canvasElement.querySelector('[formControlName="phone"]') as HTMLInputElement;
    const passwordInput = canvasElement.querySelector('[formControlName="password"]') as HTMLInputElement;
    const confirmPasswordInput = canvasElement.querySelector('[formControlName="confirmPassword"]') as HTMLInputElement;
    const submitButton = canvasElement.querySelector('button[nzType="primary"]') as HTMLButtonElement;
    
    firstNameInput.value = 'John';
    firstNameInput.dispatchEvent(new Event('input'));
    
    lastNameInput.value = 'Doe';
    lastNameInput.dispatchEvent(new Event('input'));
    
    emailInput.value = 'john.doe@example.com';
    emailInput.dispatchEvent(new Event('input'));
    
    phoneInput.value = '9876543210';
    phoneInput.dispatchEvent(new Event('input'));
    
    passwordInput.value = 'password123';
    passwordInput.dispatchEvent(new Event('input'));
    
    confirmPasswordInput.value = 'password123';
    confirmPasswordInput.dispatchEvent(new Event('input'));
    
    // Submit the form
    submitButton.click();
  }
};

// Registration failure
export const RegistrationFailed: Story = {
  parameters: {
     docs: {
      description: {
        story: 'Form showing error notification after failed registration attempt.'
      }
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ptGNDPmiaBGgwx0ECtGD3g/WebApp_Design?node-id=1155-6088&t=0Zl3kv5JbtOXpqNQ-1'
    }
  },
  render: () => ({
    template: `<app-register></app-register>`,
    applicationConfig: {
      providers: [
        {
          provide: Auth,
          useValue: {
            register: () => throwError(() => ({
              message: 'Email already exists'
            })) // Mock failed registration
          }
        },
        {
          provide: NzNotificationService,
          useValue: {
            error: (title: string, message: string) => {
              console.log('Error notification:', title, message);
            }
          }
        }
      ]
    }
  }),
  play: async ({ canvasElement }) => {
    // Fill form with valid data
    const firstNameInput = canvasElement.querySelector('[formControlName="firstName"]') as HTMLInputElement;
    const lastNameInput = canvasElement.querySelector('[formControlName="lastName"]') as HTMLInputElement;
    const emailInput = canvasElement.querySelector('[formControlName="email"]') as HTMLInputElement;
    const phoneInput = canvasElement.querySelector('[formControlName="phone"]') as HTMLInputElement;
    const passwordInput = canvasElement.querySelector('[formControlName="password"]') as HTMLInputElement;
    const confirmPasswordInput = canvasElement.querySelector('[formControlName="confirmPassword"]') as HTMLInputElement;
    const submitButton = canvasElement.querySelector('button[nzType="primary"]') as HTMLButtonElement;
    
    firstNameInput.value = 'John';
    firstNameInput.dispatchEvent(new Event('input'));
    
    lastNameInput.value = 'Doe';
    lastNameInput.dispatchEvent(new Event('input'));
    
    emailInput.value = 'existing.user@example.com';
    emailInput.dispatchEvent(new Event('input'));
    
    phoneInput.value = '9876543210';
    phoneInput.dispatchEvent(new Event('input'));
    
    passwordInput.value = 'password123';
    passwordInput.dispatchEvent(new Event('input'));
    
    confirmPasswordInput.value = 'password123';
    confirmPasswordInput.dispatchEvent(new Event('input'));
    
    // Submit the form
    submitButton.click();
  }
};

// Password visibility toggle
export const PasswordVisibility: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Password fields with visibility toggle feature.'
      }
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ptGNDPmiaBGgwx0ECtGD3g/WebApp_Design?node-id=1159-6122&t=0Zl3kv5JbtOXpqNQ-1'
    }
  },
  play: async ({ canvasElement }) => {
    const passwordEyeIcon = canvasElement.querySelectorAll('span.cursor-pointer')[0] as HTMLSpanElement;
    const confirmEyeIcon = canvasElement.querySelectorAll('span.cursor-pointer')[1] as HTMLSpanElement;
    
    // Toggle password visibility
    passwordEyeIcon.click();
    
    // Toggle confirm password visibility
    confirmEyeIcon.click();
  }
};



