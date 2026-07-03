import type { Preview } from '@storybook/angular'
import { setCompodocJson } from "@storybook/addon-docs/angular";
import docJson from "../documentation.json";
setCompodocJson(docJson);

// Add these two imports
import { provideZonelessChangeDetection } from '@angular/core';
import { applicationConfig } from '@storybook/angular';



const preview: Preview = {
   decorators: [
    applicationConfig({
      providers: [
        provideZonelessChangeDetection()
      ]
    })
  ],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;