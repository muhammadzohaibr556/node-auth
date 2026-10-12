# Node Auth

A full-stack authentication learning project built with TypeScript. The Express
API uses MongoDB, Mongoose, JWT authentication, and bcrypt password hashing. The
React frontend uses Vite, Zod, Tailwind CSS, and shadcn/ui.

## Features

- Create an account and sign in with a username and password.
- View and update your name, email address, and phone number.
- Client and server input validation with clear error messages.
- Restore a session within the current browser tab and sign out.
- Responsive login and signup screens with small UI components.

Social sign-in, password recovery, and persistent-device sessions are not
implemented. Their UI controls are disabled or explain their availability.

## Project structure

```text
backend-api/   Express API, Mongoose model, and backend tests
frontend/      React application, UI components, and frontend tests
```

See the [backend guide](backend-api/README.md) and
[frontend guide](frontend/README.md) for implementation details.

## Requirements

- Node.js 22.18 or newer and npm.
- A running local MongoDB instance or a MongoDB Atlas connection string.

## Local setup

Run these commands from the repository root:

```sh
npm ci --prefix backend-api
npm ci --prefix frontend
```

Create local environment files if they do not already exist:

```sh
cp -n backend-api/.env.example backend-api/.env
cp -n frontend/.env.example frontend/.env
```

Set `MONGO_URI` and `JWT_SECRET` in `backend-api/.env`. Generate a random JWT
secret with the command below, then paste its output into that local file:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

The examples use backend port `5000`. If you change `PORT`, also change
`API_PROXY_TARGET` in `frontend/.env` to match, such as
`http://127.0.0.1:5001`. Existing local configuration is preserved by `cp -n`.
Never put backend secrets in frontend environment variables.

Start the API in one terminal:

```sh
npm run dev --prefix backend-api
```

Start the frontend in another:

```sh
npm run dev --prefix frontend
```

Open the URL printed by Vite, usually `http://localhost:5173`.

## Checks and builds

```sh
npm run typecheck --prefix backend-api
npm run typecheck --prefix frontend
npm test --prefix backend-api
npm test --prefix frontend
npm run build --prefix backend-api
npm run build --prefix frontend
```

The automated tests do not require MongoDB. Run the compiled API with
`npm start --prefix backend-api`. The frontend build is written to
`frontend/dist/`; production hosting must forward `/api` to Express on the same
origin. Vite's development proxy is not included in the static build.

## API endpoints

| Method | Endpoint              | Access       |
| ------ | --------------------- | ------------ |
| GET    | `/api/v1/health`      | Public       |
| POST   | `/api/v1/auth/signup` | Public       |
| POST   | `/api/v1/auth/signin` | Public       |
| GET    | `/api/v1/users/me`    | Bearer token |
| PATCH  | `/api/v1/users/me`    | Bearer token |

## Notes

JWTs are kept in browser `sessionStorage`. Signout clears the browser session;
the API does not revoke previously issued tokens. This is a learning project,
not a complete production authentication system.

The login design and illustration come from the supplied Gusto/Mobbin reference.
They are reference assets, not original project branding; replace them with your
own assets for a separately branded deployment.
