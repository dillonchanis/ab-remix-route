import { createCookieSessionStorage } from "@remix-run/node";

export const session = createCookieSessionStorage({
  cookie: {
    name: "__ab_cookie_test",
    path: "/",
    sameSite: "lax"
  }
});
