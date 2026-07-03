import type { Meta, StoryObj } from '@storybook/angular';
import { Company } from './company';

const meta: Meta<Company> = {
  title: 'Profile/Company',
  component: Company,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<Company>;

// --- Empty State ---
export const EmptyState: Story = {
  render: (args) => ({
    component: Company,
    props: {
      ...args,
      showForm: false,
    },
  }),
};

// --- Add Company (Form Open) ---
export const AddMode: Story = {
  render: (args) => ({
    component: Company,
    props: {
      ...args,
    },
  }),
  play: async ({ canvasElement }) => {
    const addBtn = canvasElement.querySelector<HTMLButtonElement>(
      '#add-btn'
    );
    if (addBtn) addBtn.click();

    //fill data in input fields
    const name = canvasElement.querySelector<HTMLInputElement>('#name');
    if (name) {
      name.value = 'Intelliapplyd';
      name.dispatchEvent(new Event('input'));
    }
    const type = canvasElement.querySelector<HTMLInputElement>('#type');
    if (type) {
      type.value = 'IT';
      type.dispatchEvent(new Event('input'));
    }
    const gst = canvasElement.querySelector<HTMLInputElement>('#gst');
    if (gst) {
      gst.value = 'GIN7585452';
      gst.dispatchEvent(new Event('input'));
    }
    const phone = canvasElement.querySelector<HTMLInputElement>('#phone');
    if (phone) {
      phone.value = '7754678990';
      phone.dispatchEvent(new Event('input'));
    }
    const url = canvasElement.querySelector<HTMLInputElement>('#url');
    if (url) {
      url.value = 'www.intelliapplyd.com';
      url.dispatchEvent(new Event('input'));
    }
  },
};

// --- Save Mode (after Save) ---
export const SaveMode: Story = {
  render: (args) => ({
    component: Company,
    props: {
      ...args,
      showForm: true,
      isEditMode: false,
    },
  }),
  play: async ({ canvasElement }) => {
    const addBtn = canvasElement.querySelector<HTMLButtonElement>('#add-btn');
    if (addBtn) addBtn.click();

    //fill data in input box
    const name = canvasElement.querySelector<HTMLInputElement>('#name');
    if (name) {
      name.value = 'Intelliapplyd';
      name.dispatchEvent(new Event('input'));
    }
    const type = canvasElement.querySelector<HTMLInputElement>('#type');
    if (type) {
      type.value = 'IT';
      type.dispatchEvent(new Event('input'));
    }
    const gst = canvasElement.querySelector<HTMLInputElement>('#gst');
    if (gst) {
      gst.value = 'GIN7585459';
      gst.dispatchEvent(new Event('input'));
    }
    const phone = canvasElement.querySelector<HTMLInputElement>('#phone');
    if (phone) {
      phone.value = '7754678990';
      phone.dispatchEvent(new Event('input'));
    }
    const url = canvasElement.querySelector<HTMLInputElement>('#url');
    if (url) {
      url.value = 'www.intelliapplyd.com';
      url.dispatchEvent(new Event('input'));
    }
    const saveButton = canvasElement.querySelector<HTMLButtonElement>('#save-btn');
    if (saveButton) saveButton.click();
  },
};

// --- Edit Company (Form Open) ---
export const EditMode: Story = {
  render: (args) => ({
    component: Company,
    props: {
      ...args,
    },
  }),
  play: async ({ canvasElement }) => {
    const editBtn = canvasElement.querySelector<HTMLButtonElement>(
      '#edit-btn'
    );
    if (editBtn) editBtn.click();
     //fill data in input box
    const name = canvasElement.querySelector<HTMLInputElement>('#name');
    if (name) {
      name.value = 'Intelliapplyd';
      name.dispatchEvent(new Event('input'));
    }
    const type = canvasElement.querySelector<HTMLInputElement>('#type');
    if (type) {
      type.value = 'IT';
      type.dispatchEvent(new Event('input'));
    }
    const gst = canvasElement.querySelector<HTMLInputElement>('#gst');
    if (gst) {
      gst.value = 'GIN7585459';
      gst.dispatchEvent(new Event('input'));
    }
    const phone = canvasElement.querySelector<HTMLInputElement>('#phone');
    if (phone) {
      phone.value = '7754678990';
      phone.dispatchEvent(new Event('input'));
    }
    const url = canvasElement.querySelector<HTMLInputElement>('#url');
    if (url) {
      url.value = 'www.intelliapplyd.com';
      url.dispatchEvent(new Event('input'));
    }
  },
};

// --- Valid Data ---
export const ValidData: Story = {
  render: (args) => ({
    component: Company,
    props: {
      ...args,
    },
  }),
  play: async ({ canvasElement }) => {
    // Open form
    const addBtn = canvasElement.querySelector<HTMLButtonElement>(
      '#add-btn'
    );
    if (addBtn) addBtn.click();

    // Fill fields with valid data
    const name = canvasElement.querySelector<HTMLInputElement>(
      '#name'
    );
    if (name) {
      name.value = 'OpenAI Pvt Ltd';
      name.dispatchEvent(new Event('input'));
    }

    const type = canvasElement.querySelector<HTMLInputElement>(
      '#type'
    );
    if (type) {
      type.value = 'Technology';
      type.dispatchEvent(new Event('input'));
    }

    const gst = canvasElement.querySelector<HTMLInputElement>(
      '#gst'
    );
    if (gst) {
      gst.value = '22AAAAA0000A1Z5'; // valid GST
      gst.dispatchEvent(new Event('input'));
    }

    const phone = canvasElement.querySelector<HTMLInputElement>(
      '#phone'
    );
    if (phone) {
      phone.value = '9876543210';
      phone.dispatchEvent(new Event('input'));
    }

    const website = canvasElement.querySelector<HTMLInputElement>(
      '#url'
    );
    if (website) {
      website.value = 'https://openai.com';
      website.dispatchEvent(new Event('input'));
    }

    // Save
    const saveBtn = canvasElement.querySelector<HTMLButtonElement>(
      '.btn-group button[nzType="primary"]'
    );
    if (saveBtn) saveBtn.click();
  },
};

// --- Invalid Data ---
export const InvalidData: Story = {
  render: (args) => ({
    component: Company,
    props: {
      ...args,
    },
  }),
  play: async ({ canvasElement }) => {
    // Open form
    const addBtn = canvasElement.querySelector<HTMLButtonElement>(
      '#add-btn'
    );
    if (addBtn) addBtn.click();

    // Fill with invalid data
    const name = canvasElement.querySelector<HTMLInputElement>(
      '#name'
    );
    if (name) {
      name.value = '';
      name.dispatchEvent(new Event('input'));
      name.dispatchEvent(new Event('blur'));
    }

    const type = canvasElement.querySelector<HTMLInputElement>(
      '#type'
    );
    if (type) {
      type.value = '';
      type.dispatchEvent(new Event('input'));
      type.dispatchEvent(new Event('blur'));
    }

    const gst = canvasElement.querySelector<HTMLInputElement>(
      '#gst'
    );
    if (gst) {
      gst.value = ''; // invalid GST
      gst.dispatchEvent(new Event('input'));
      gst.dispatchEvent(new Event('blur'));
    }

    const phone = canvasElement.querySelector<HTMLInputElement>(
      '#phone'
    );
    if (phone) {
      phone.value = ''; // too short
      phone.dispatchEvent(new Event('input'));
      phone.dispatchEvent(new Event('blur'));
    }

    const website = canvasElement.querySelector<HTMLInputElement>(
      '#url'
    );
    if (website) {
      website.value = '';
      website.dispatchEvent(new Event('input'));
      website.dispatchEvent(new Event('blur'));
    }

    // Save to trigger validation messages
    const saveBtn = canvasElement.querySelector<HTMLButtonElement>(
      '#save-btn'
    );
    if (saveBtn) saveBtn.click();
  },
};

