# Account frontend

A React + TypeScript frontend for the Express API in `../backend-api`, with Zod
validation and shadcn/ui components. Includes signup, signin, profile editing,
password visibility, loading/error states, and session-expiry handling.

## Run locally

Start the backend in one terminal (MongoDB and the backend `.env` must be configured):

```sh
cd backend-api
npm install
npm run dev
```

In another terminal, from the project root:

```sh
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`). The development
proxy forwards `/api` to `API_PROXY_TARGET` (default `http://127.0.0.1:5000`).
The local `.env` is already set to port `5001` to match this backend. If your backend uses another port,
copy `frontend/.env.example` to `frontend/.env`, set `API_PROXY_TARGET`, and restart
Vite. Backend secrets belong only in the backend `.env`.

Use Node.js 22.18+ (required by this frontend toolchain and its native TypeScript tests).

## Check and build

```sh
npm test          # Validation and API-client tests, no database needed
npm run typecheck # Strict TypeScript checks
npm run build     # Typecheck and produce dist/
```

Deploy `dist/` as static files and configure your web server to proxy `/api` to
Express on the same origin. Vite's development proxy is not part of the static
build. `npm run preview` is for checking the build locally, not production hosting.

## Where to learn

- `src/lib/schemas.ts`: Zod schemas validate at runtime; `z.infer` derives TypeScript
  types from those same schemas. Signup checks the backend's 72-byte password limit.
- `src/lib/api.ts`: native `fetch`, typed responses checked by Zod, and API errors.
- `src/components/account-form.tsx`: native form data, inline validation, accessible
  labels, focus on invalid input, and submitting states. No form library needed.
- `src/App.tsx`: session state and API handlers; composes the page components.
- `src/components/auth-page.tsx`: login/signup layout and help links.
- `src/components/social-signin.tsx`: social sign-in buttons.
- `src/components/profile-page.tsx`: profile editor layout.
- `src/components/profile-summary.tsx`: identity card and session note.
- `src/components/profile-loading.tsx`: loading, retry, and error UI.
- `src/components/site-header.tsx`: branding and signout control.
- `src/components/ui/`: actual shadcn components, generated with the shadcn CLI.
- `src/index.css`: Tailwind theme tokens and responsive page styling.

The JWT is stored in `sessionStorage` for reloads within this browser tab and is
removed on signout or an API 401. If storage is unavailable, the session stays in
memory. Signout clears the frontend session; this backend has no token-revocation
endpoint. JavaScript can access sessionStorage, so a future HttpOnly-cookie session
would require coordinated backend changes. Passwords are never saved by the app.

Reference: [shadcn with Vite](https://ui.shadcn.com/docs/installation/vite),
[Zod basics](https://zod.dev/basics).

## Login reference

The login layout follows the supplied Gusto reference. The illustration is shown
from `public/images/login-reference.png` using a CSS viewport; the form is native
React/shadcn UI, not a screenshot. Username authentication remains unchanged.
Google/Xero/Intuit and persistent-device login are visibly disabled because the
backend does not implement them. Recovery/help controls explain this limitation.
