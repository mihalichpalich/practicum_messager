declare global {
  export type Nullable<T> = T | null;

  export type Keys<T extends Record<string, unknown>> = keyof T;
  export type Values<T extends Record<string, unknown>> = T[Keys<T>];

  export type Indexed = { [key: string]: any };

  export type APIError = {
    reason: string;
  };

  export type AppState = {
    isAuthLoading: boolean;
    isSignUpLoading: boolean;
    userId: null | number;
    loginFormError: string | null;
    signUpFormError: string | null;
  };
}

export {};