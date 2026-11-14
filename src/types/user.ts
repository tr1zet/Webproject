export interface User {
  id: string
  email: string
  password: string
}

export interface RegistrationFields {
  email: string
  password: string
  passwordConfirmation: string
}

export interface LoginFields {
  email: string
  password: string
}

export interface RegistrationErrors {
  email?: string
  password?: string
  passwordConfirmation?: string
}

export type RegistrationResult =
  { success: true } | { success: false; errors: RegistrationErrors }

export type LoginResult = { success: true } | { success: false; error: string }
