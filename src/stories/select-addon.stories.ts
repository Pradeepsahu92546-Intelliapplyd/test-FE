import { Meta, StoryObj, moduleMetadata, applicationConfig } from '@storybook/angular';
import { SelectAddon} from '../app/components/subscriptions/select-addon/select-addon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { userEvent, within } from '@storybook/testing-library';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const meta: Meta<SelectAddon> = {
  title: 'Subscription/SelectAddon',
  component: SelectAddon,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        NzStepsModule,
        NzButtonModule,
        NzIconModule,
        NzSelectModule,
        NzSwitchModule,
        NzDividerModule,
        NzTableModule
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
      url: 'https://www.figma.com/design/your-select-addon-design'
    }
  }
};

export default meta;
type Story = StoryObj<SelectAddon>;

// Default state - no addons selected, monthly billing
export const Default: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/your-select-addon-design/default-state'
    }
  }
};

// Annual billing with no addons
export const AnnualBilling: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/your-select-addon-design/annual-billing'
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Switch to annual billing
    const annualButton = canvas.getByRole('button', { name: /annual/i });
    await userEvent.click(annualButton);
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
};

// With addons selected
export const WithAddons: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/your-select-addon-design/with-addons'
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Add first addon
    const addButtons = canvas.getAllByRole('button', { name: /plus/i });
    await userEvent.click(addButtons[0]);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Change quantity of first addon
    const select = canvas.getAllByRole('combobox')[0];
    await userEvent.click(select);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const option = canvas.getByText('2');
    await userEvent.click(option);
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
};

// Multiple addons with different quantities
export const MultipleAddons: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/your-select-addon-design/multiple-addons'
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Add both addons
    const addButtons = canvas.getAllByRole('button', { name: /plus/i });
    
    // Add first addon
    await userEvent.click(addButtons[0]);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Set quantity to 3 for first addon
    const firstSelect = canvas.getAllByRole('combobox')[0];
    await userEvent.click(firstSelect);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const option3 = canvas.getByText('3');
    await userEvent.click(option3);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Add second addon
    await userEvent.click(addButtons[1]);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Set quantity to 2 for second addon
    const secondSelect = canvas.getAllByRole('combobox')[1];
    await userEvent.click(secondSelect);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const option2 = canvas.getByText('2');
    await userEvent.click(option2);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
};

// Organization selected and auto-renew disabled
export const CustomSettings: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/your-select-addon-design/custom-settings'
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Select organization
    const orgSelect = canvas.getByRole('combobox', { name: /select organization/i });
    await userEvent.click(orgSelect);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const orgOption = canvas.getByText('Acme Corp');
    await userEvent.click(orgOption);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Disable auto-renew
    const switchElement = canvas.getByRole('switch');
    await userEvent.click(switchElement);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
};

// Addon removal scenario
export const AddonRemoval: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/your-select-addon-design/addon-removal'
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Add both addons first
    const addButtons = canvas.getAllByRole('button', { name: /plus/i });
    
    await userEvent.click(addButtons[0]);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    await userEvent.click(addButtons[1]);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Remove first addon
    const deleteButtons = canvas.getAllByRole('button', { name: /delete/i });
    await userEvent.click(deleteButtons[0]);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
};

// Maximum quantities scenario
export const MaximumQuantities: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/your-select-addon-design/maximum-quantities'
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Add first addon and set to maximum quantity
    const addButtons = canvas.getAllByRole('button', { name: /plus/i });
    await userEvent.click(addButtons[0]);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const select = canvas.getAllByRole('combobox')[0];
    await userEvent.click(select);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const maxOption = canvas.getByText('10');
    await userEvent.click(maxOption);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Switch to annual billing to see savings
    const annualButton = canvas.getByRole('button', { name: /annual/i });
    await userEvent.click(annualButton);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
};

// Complete workflow - ready for checkout
export const ReadyForCheckout: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/your-select-addon-design/ready-for-checkout'
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Select organization
    const orgSelect = canvas.getByRole('combobox', { name: /select organization/i });
    await userEvent.click(orgSelect);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const orgOption = canvas.getByText('Globex');
    await userEvent.click(orgOption);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Enable auto-renew (ensure it's on)
    const switchElement = canvas.getByRole('switch');
    const isChecked = switchElement.getAttribute('aria-checked') === 'true';
    if (!isChecked) {
      await userEvent.click(switchElement);
    }
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Switch to annual billing
    const annualButton = canvas.getByRole('button', { name: /annual/i });
    await userEvent.click(annualButton);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Add both addons with quantities
    const addButtons = canvas.getAllByRole('button', { name: /plus/i });
    
    await userEvent.click(addButtons[0]);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const firstSelect = canvas.getAllByRole('combobox')[0];
    await userEvent.click(firstSelect);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const option3 = canvas.getByText('3');
    await userEvent.click(option3);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    await userEvent.click(addButtons[1]);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const secondSelect = canvas.getAllByRole('combobox')[1];
    await userEvent.click(secondSelect);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const option2 = canvas.getByText('2');
    await userEvent.click(option2);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // The component is now ready for checkout
    console.log('Component configured for checkout scenario');
  }
};