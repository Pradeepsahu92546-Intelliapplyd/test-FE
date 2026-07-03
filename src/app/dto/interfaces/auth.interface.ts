import { AccountType } from '../enums/account-type.enum';
import { UserType } from '../enums/user-type.enum';

// request interface
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userType: UserType;
  accountType: AccountType;
  password: string;
  password2: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  device: {
    deviceId: string;
    platform: string;
    deviceName: string;
    osVersion: string;
  };
  location: {
    ip: string;
    country: string;
    timezone: string;
    latitude: number;
    longitude: number;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface LoginResponse {
  accessToken: string; 
  userId: string;
  email: string;
  userName: string;
}

// reponse interface
export interface RegisterResponse {
  userId: string;
  email: string;
  createdAt: string;
  date_joined: string;
}


export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  resetToken?: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// Add this interface for the activation response
export interface ActivationResponse {
  status: string;
  code: number;
  message: string;
  data: any;
  meta?: any;
  requestId?: string;
  timestamp?: string;
}




// export interface RegisterResponse {
//   aceessToken: string; // skip
//   tokenType: string; // skip
//   expiresIn: number; // skip
//   userId: string;
//   email: string;
//   firstName: string; // skip
//   lastName: string; // skip
//   accountType: AccountType; // skip
//   createdAt: string;
//   date_joined: string;
// }

// export interface LoginResponse {
//   token: string;
//   refreshToken: string;
//   tokenType: string; // skip
//   expiresIn: number; // skip
//   userId: string;
//   email: string;
//   userName: string;
//   lastName: string; // skip
//   accountType: AccountType; // skip
//   createdAt: string; // skip
//   date_joined: string; // skip
// }
