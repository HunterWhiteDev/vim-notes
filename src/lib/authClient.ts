import { createAuthClient } from "better-auth/react";
const baseURL = import.meta.env.VITE_API_URL;

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL,
});

export const { signIn, signUp, useSession } = authClient;
