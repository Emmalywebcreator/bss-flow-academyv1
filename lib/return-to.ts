// Where to send a learner after they register or log in. Only paths
// under /learn are accepted, so a crafted ?next= link can't redirect
// anyone to another site.

const LEARNING_PATH = /^\/learn(\/[a-z0-9-]+)*$/;

export function safeReturnTo(value: string | null | undefined): string | null {
  return value && LEARNING_PATH.test(value) ? value : null;
}

/** `/register` or `/login`, remembering the learning page to return to. */
export function withReturnTo(path: "/register" | "/login", returnTo: string | null | undefined) {
  const next = safeReturnTo(returnTo);
  return next ? `${path}?next=${encodeURIComponent(next)}` : path;
}
