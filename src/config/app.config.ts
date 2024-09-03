import { ENV } from "./environment";

export const appConfig = {
  sessionCookieName: 'power-tools-session',
  jwtToken: ENV.JWT_SECRET || "jwt-secret", // This is a fallback value, it should be replaced with a proper secret
}