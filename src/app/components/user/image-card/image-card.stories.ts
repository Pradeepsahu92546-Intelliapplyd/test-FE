// import type { Meta, StoryObj } from '@storybook/angular';
// import { ImageCard } from './image-card';
// import { NzMessageService } from 'ng-zorro-antd/message';

// const meta: Meta<ImageCard> = {
//   title: 'Account/ImageCard',
//   component: ImageCard,
//   tags: ['autodocs'],
//   // ✅ needed for toast messages

// };

// export default meta;
// type Story = StoryObj<ImageCard>;

// // --- Case 1: Render properly (default) ---
// export const DefaultRender: Story = {
//   args: {
//     user: {
//       profileImg:
//         'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80',
//     },
//     notifications: [10, 20, 30],
//     isUploading: false,
//   },
// };

// // --- Case 2: Image not uploaded (default image shown) ---
// export const NoImageUploaded: Story = {
//   args: {
//     user: {
//       profileImg:
//         'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80', // default avatar
//     },
//     notifications: [10,20,30],
//     isUploading: false,
//   },
// };

// // --- Case 3: Image uploaded (show new image + success alert) ---
// export const ImageUploaded: Story = {
//   args: {
//     user: {
//       profileImg:
//         'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=300&h=300&fit=crop', // uploaded profile
//     },
//     notifications: [10,20,30],
//     isUploading: false,
//   },
//   play: async ({ canvasElement }) => {
//     // Simulate toast alert
//     const messageService = new NzMessageService();
//     messageService.success('Profile image updated successfully!');
//   },
// };

// // --- Case 4: No Notifications ---
// export const NoNotifications: Story = {
//   args: {
//     user: {
//       profileImg:
//         'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80',
//     },
//     notifications: [],
//     isUploading: false,
//   },
// };

// // --- Case 5: With Notifications ---
// export const WithNotifications: Story = {
//   args: {
//     user: {
//       profileImg:
//         'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80',
//     },
//     notifications: [10,20,30],
//     isUploading: false,
//   },
// };
