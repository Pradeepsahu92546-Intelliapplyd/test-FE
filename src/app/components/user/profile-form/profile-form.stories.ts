import type { Meta, StoryObj } from '@storybook/angular';
import { ProfileForm } from './profile-form';

const meta: Meta<ProfileForm> = {
  title: 'Profile/ProfileForm',
  component: ProfileForm,
   tags: ['autodocs'],
 
};

export default meta;
type Story = StoryObj<ProfileForm>;

// --- Edit Mode ---
export const EditMode: Story = {
  render: (args) => ({
    component: ProfileForm,
    props: {
      ...args,
    },
  }),
  play: async ({ canvasElement }) => {
    const button: HTMLButtonElement | null = canvasElement.querySelector('.edit-btn');
    if (button) button.click(); // simulate user clicking "Edit"
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ptGNDPmiaBGgwx0ECtGD3g/WebApp_Design?node-id=1061-4339&t=HqOLxpg6pjxmq5UR-1',
    },
  },
  
};

// --- Save Mode (after editing & saving) ---
export const SaveMode: Story = {
  render: (args) => ({
    component: ProfileForm,
    props: {
      ...args,
    },
  }),
  play: async ({ canvasElement }) => {
    // Enter edit mode
    const editBtn: HTMLButtonElement | null = canvasElement.querySelector('.edit-btn');
    if (editBtn) editBtn.click();

    // Simulate save click
    setTimeout(() => {
      const saveBtn: HTMLButtonElement | null = canvasElement.querySelector('.save-btn');
      if (saveBtn) saveBtn.click();
    }, 300);
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ptGNDPmiaBGgwx0ECtGD3g/WebApp_Design?node-id=1047-4652&t=HqOLxpg6pjxmq5UR-1',
    },
  },

};

// --- Valid Data ---
export const ValidData: Story = {
  render: (args) => ({
    component: ProfileForm,
    props: {
      ...args,
    },
  }),
  play: async ({ canvasElement }) => {
    const editBtn = canvasElement.querySelector('.edit-btn') as HTMLButtonElement;
    if (editBtn) editBtn.click();

    // Fill fields with valid values
    const firstName = canvasElement.querySelector<HTMLInputElement>('#firstName');
    if (firstName) {
      firstName.value = 'Pratyush';
      firstName.dispatchEvent(new Event('input'));
    }

    const lastName = canvasElement.querySelector<HTMLInputElement>('#lastName');
    if (lastName) {
      lastName.value = 'Mohanty';
      lastName.dispatchEvent(new Event('input'));
    }

    const phone = canvasElement.querySelector<HTMLInputElement>('#phone');
    if (phone) {
      phone.value = '9876543210';
      phone.dispatchEvent(new Event('input'));
    }
  },
};

// --- Invalid Data (shows errors) ---
export const InvalidData: Story = {
  render: (args) => ({
    component: ProfileForm,
    props: {
      ...args,
    },
  }),
  play: async ({ canvasElement }) => {
    const editBtn = canvasElement.querySelector('.edit-btn') as HTMLButtonElement;
    if (editBtn) editBtn.click();

    // Fill with invalid data
    const firstName = canvasElement.querySelector<HTMLInputElement>('#firstName');
    if (firstName) {
      firstName.value = 'A'; // too short
      firstName.dispatchEvent(new Event('input'));
      firstName.dispatchEvent(new Event('blur'));
    }
    const lastName = canvasElement.querySelector<HTMLInputElement>('#lastName');
    if (lastName) {
      lastName.value = 'M'; // too short
      lastName.dispatchEvent(new Event('input'));
      lastName.dispatchEvent(new Event('blur'));
    }

    const phone = canvasElement.querySelector<HTMLInputElement>('#phone');
    if (phone) {
      phone.value = '12'; // invalid length
      phone.dispatchEvent(new Event('input'));
      phone.dispatchEvent(new Event('blur'));
    }
    const dob = canvasElement.querySelector<HTMLInputElement>('#dob');
    if (dob) {
      dob.value = ''; // too short
      dob.dispatchEvent(new Event('input'));
      dob.dispatchEvent(new Event('blur'));
    }

    const accountType = canvasElement.querySelector('#accountType .ant-select-selector') as HTMLElement;

    const userType = canvasElement.querySelector('#userType .ant-select-selector') as HTMLElement;



    // Trigger save to show validation messages
    const saveBtn = canvasElement.querySelector('.save-btn') as HTMLButtonElement;
    if (saveBtn) saveBtn.click();
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ptGNDPmiaBGgwx0ECtGD3g/WebApp_Design?node-id=1075-4702&t=HqOLxpg6pjxmq5UR-1',
    },
  },
};
