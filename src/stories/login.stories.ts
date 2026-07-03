import { Meta, StoryObj, moduleMetadata, applicationConfig } from '@storybook/angular';
import { Login } from '../app/components/auth/login/login';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { of, throwError } from 'rxjs';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Loader } from '../app/shared/components/modal/loader/loader';
import { InputDialog } from '../app/shared/components/modal/dialog/input-dialog/input-dialog';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { Auth } from '../app/services/auth/auth';
import { NzModalModule } from 'ng-zorro-antd/modal';

// Mock services
class MockAuthService {
  login(email: string, password: string) {
    return of({}); // Default to success
  }
}

class MockNotificationService {
  success(title: string, message: string) {
    console.log('Success notification:', title, message);
  }
  error(title: string, message: string) {
    console.log('Error notification:', title, message);
  }
}

class MockRouter {
  navigateByUrl(url: string) {}
}

const meta: Meta<Login> = {
  title: 'Auth/Login',
  component: Login,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        NzFormModule,
        NzInputModule,
        NzCheckboxModule,
        NzButtonModule,
        NzTypographyModule,
        NzIconModule,
        NzModalModule,
        Loader,
        InputDialog
      ],
      providers: [
        FormBuilder,
        { provide: Auth, useClass: MockAuthService },
        { provide: NzNotificationService, useClass: MockNotificationService },
        { provide: Router, useClass: MockRouter },
        
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
      url: 'https://www.figma.com/design/your-login-component-design'
    }
  }
};

export default meta;
type Story = StoryObj<Login>;

// Default state - empty form
export const Default: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'hhttps://www.figma.com/design/ptGNDPmiaBGgwx0ECtGD3g/WebApp_Design?node-id=589-16169&t=0Zl3kv5JbtOXpqNQ-1'
    }
  }
};

// Valid form state
export const ValidForm: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ptGNDPmiaBGgwx0ECtGD3g/WebApp_Design?node-id=1177-6169&t=0Zl3kv5JbtOXpqNQ-1'
    }
  },
  play: async ({ canvasElement }) => {
    // Fill form with valid data
    const emailInput = canvasElement.querySelector('[formControlName="email"]') as HTMLInputElement;
    const passwordInput = canvasElement.querySelector('[formControlName="password"]') as HTMLInputElement;
    
    emailInput.value = 'user@example.com';
    emailInput.dispatchEvent(new Event('input'));
    
    passwordInput.value = 'password123';
    passwordInput.dispatchEvent(new Event('input'));
  }
};

// Invalid form state - all fields with errors
export const InvalidForm: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ptGNDPmiaBGgwx0ECtGD3g/WebApp_Design?node-id=1178-6347&t=0Zl3kv5JbtOXpqNQ-1'
    }
  },
  play: async ({ canvasElement }) => {
    // Simulate user interaction with invalid data
    const emailInput = canvasElement.querySelector('[formControlName="email"]') as HTMLInputElement;
    const passwordInput = canvasElement.querySelector('[formControlName="password"]') as HTMLInputElement;
    const agreeCheckbox = canvasElement.querySelector('[formControlName="agree"]') as HTMLInputElement;
    const submitButton = canvasElement.querySelector('button[nzType="primary"]') as HTMLButtonElement;
    
    // Set invalid values
    emailInput.value = 'invalid-email';
    emailInput.dispatchEvent(new Event('input'));
    emailInput.dispatchEvent(new Event('blur'));
    
    passwordInput.value = 'short';
    passwordInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('blur'));
    
    agreeCheckbox.checked = false;
    agreeCheckbox.dispatchEvent(new Event('change'));
    
    // Submit the form
    submitButton.click();
  }
};

// Email error state
export const EmailError: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ptGNDPmiaBGgwx0ECtGD3g/WebApp_Design?node-id=1178-6466&t=0Zl3kv5JbtOXpqNQ-1'
    }
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('[formControlName="email"]') as HTMLInputElement;
    input.value = 'invalid-email';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    
    const submitButton = canvasElement.querySelector('button[nzType="primary"]') as HTMLButtonElement;
    submitButton.click();
  }
};

// Password error state
export const PasswordError: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ptGNDPmiaBGgwx0ECtGD3g/WebApp_Design?node-id=1179-6648&t=0Zl3kv5JbtOXpqNQ-1'
    }
  },
  play: async ({ canvasElement }) => {
    const emailInput = canvasElement.querySelector('[formControlName="email"]') as HTMLInputElement;
    const passwordInput = canvasElement.querySelector('[formControlName="password"]') as HTMLInputElement;
    
    emailInput.value = 'user@example.com';
    emailInput.dispatchEvent(new Event('input'));
    
    passwordInput.value = '';
    passwordInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('blur'));
    
    const submitButton = canvasElement.querySelector('button[nzType="primary"]') as HTMLButtonElement;
    submitButton.click();
  }
};

// Terms not accepted error state
export const TermsNotAccepted: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/your-login-component-design/terms-not-accepted'
    }
  },
  play: async ({ canvasElement }) => {
    const emailInput = canvasElement.querySelector('[formControlName="email"]') as HTMLInputElement;
    const passwordInput = canvasElement.querySelector('[formControlName="password"]') as HTMLInputElement;
    const agreeCheckbox = canvasElement.querySelector('[formControlName="agree"]') as HTMLInputElement;
    
    emailInput.value = 'user@example.com';
    emailInput.dispatchEvent(new Event('input'));
    
    passwordInput.value = 'password123';
    passwordInput.dispatchEvent(new Event('input'));
    
    agreeCheckbox.checked = false;
    agreeCheckbox.dispatchEvent(new Event('change'));
    agreeCheckbox.dispatchEvent(new Event('blur'));
    
    const submitButton = canvasElement.querySelector('button[nzType="primary"]') as HTMLButtonElement;
    submitButton.click();
  }
};

// Loading state during submission
export const LoadingState: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/your-login-component-design/loading-state'
    }
  },
  render: () => ({
    template: `<app-login></app-login>`,
    applicationConfig: {
      providers: [
        {
          provide: Auth,
          useValue: {
            login: () => {
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
    const emailInput = canvasElement.querySelector('[formControlName="email"]') as HTMLInputElement;
    const passwordInput = canvasElement.querySelector('[formControlName="password"]') as HTMLInputElement;
    const submitButton = canvasElement.querySelector('button[nzType="primary"]') as HTMLButtonElement;
    
    emailInput.value = 'user@example.com';
    emailInput.dispatchEvent(new Event('input'));
    
    passwordInput.value = 'password123';
    passwordInput.dispatchEvent(new Event('input'));
    
    // Submit the form
    submitButton.click();
  }
};

// Successful login
export const SuccessfulLogin: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/your-login-component-design/success-state'
    }
  },
  render: () => ({
    template: `<app-login></app-login>`,
    applicationConfig: {
      providers: [
        {
          provide: Auth,
          useValue: {
            login: () => of({}) // Mock successful login
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
    const emailInput = canvasElement.querySelector('[formControlName="email"]') as HTMLInputElement;
    const passwordInput = canvasElement.querySelector('[formControlName="password"]') as HTMLInputElement;
    const submitButton = canvasElement.querySelector('button[nzType="primary"]') as HTMLButtonElement;
    
    emailInput.value = 'user@example.com';
    emailInput.dispatchEvent(new Event('input'));
    
    passwordInput.value = 'password123';
    passwordInput.dispatchEvent(new Event('input'));
    
    // Submit the form
    submitButton.click();
  }
};

// Login failure - invalid credentials
export const LoginFailed: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/your-login-component-design/error-state'
    }
  },
  render: () => ({
    template: `<app-login></app-login>`,
    applicationConfig: {
      providers: [
        {
          provide: Auth,
          useValue: {
            login: () => throwError(() => ({
              message: 'Invalid email or password'
            })) // Mock failed login
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
    // Fill form with valid data (but will fail)
    const emailInput = canvasElement.querySelector('[formControlName="email"]') as HTMLInputElement;
    const passwordInput = canvasElement.querySelector('[formControlName="password"]') as HTMLInputElement;
    const submitButton = canvasElement.querySelector('button[nzType="primary"]') as HTMLButtonElement;
    
    emailInput.value = 'wrong@example.com';
    emailInput.dispatchEvent(new Event('input'));
    
    passwordInput.value = 'wrongpassword';
    passwordInput.dispatchEvent(new Event('input'));
    
    // Submit the form
    submitButton.click();
  }
};

// Password visibility toggle
export const PasswordVisibility: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/your-login-component-design/password-visibility'
    }
  },
  play: async ({ canvasElement }) => {
    const passwordEyeIcon = canvasElement.querySelector('span.cursor-pointer') as HTMLSpanElement;
    
    // Toggle password visibility
    passwordEyeIcon.click();
  }
};

// Forgot password dialog
export const ForgotPasswordDialog: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ptGNDPmiaBGgwx0ECtGD3g/WebApp_Design?node-id=900-5860&t=0Zl3kv5JbtOXpqNQ-1'
    }
  },
  play: async ({ canvasElement }) => {
    const forgotPasswordLink = canvasElement.querySelector('[data-testid="forgot-password-link"]') as HTMLAnchorElement;
    
    // Open forgot password dialog
    forgotPasswordLink.click();
  }
};

// Forgot password success notification
export const ForgotPasswordSuccess: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ptGNDPmiaBGgwx0ECtGD3g/WebApp_Design?node-id=1179-6777&t=0Zl3kv5JbtOXpqNQ-1'
    }
  },
  render: () => ({
  template: `<app-login></app-login>`,
  applicationConfig: {
    providers: [
      {
        provide: NzNotificationService,
        useValue: {
          success: (title: string, message: string) => {
            console.log(`Notification: ${title} - ${message}`);
          }
        }
      }
    ]
  }
}),
  play: async ({ canvasElement }) => {
    // Simulate the forgot password success flow
    const component = canvasElement.querySelector('app-login') as any;
    if (component && component.handelOnEmail) {
      component.handelOnEmail('test@example.com');
    }
  }
};





