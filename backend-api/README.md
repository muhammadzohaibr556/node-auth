# Backend API (TypeScript)

Run commands from `backend-api`:

```sh
npm install
npm run dev        # Run TypeScript and restart when source files change
npm run typecheck  # Check types without generating JavaScript
npm test           # Build and run the smoke test (no MongoDB needed)
npm run build     # Compile src/ into dist/
npm start         # Run the compiled server after building
```

The server needs `MONGO_URI` and `JWT_SECRET` in `.env`. Optional settings are
`PORT` (default `5000`), `JWT_EXPIRES_IN` (default `7d`, e.g. `1h`), and `NODE_ENV`.
Use Node.js 20.19+ to meet Mongoose's runtime requirement.

## Types to learn from

- `src/controllers/auth.controller.ts`: `Pick` selects model fields for request
  bodies. `RequestHandler<{}, unknown, SignupBody>` types the request body and
  leaves response bodies unrestricted (`unknown`).
- `src/controllers/user.controller.ts`: `Partial` makes update fields optional;
  `as const` keeps the field names as literal types so indexing is checked.
- `src/models/user.model.ts`: `InferSchemaType` derives user fields from the
  Mongoose schema. Methods defined in the schema are inferred too.
- `src/types/express.d.ts`: declaration merging adds the optional `userId`
  property to Express requests. Authentication sets it on protected routes.
- `src/middleware/error.middleware.ts`: `unknown` errors are narrowed before
  accessing their properties.
- `src/utils/generateToken.ts`: the expiry assertion describes the environment
  string to TypeScript; the JWT library still validates its format at runtime.

TypeScript checks code before it runs; it does not validate incoming JSON.
The existing express-validator chains remain responsible for request validation.
`strict` is enabled in `tsconfig.json`. Imports keep `.js` extensions because
Node runs the compiled JavaScript; TypeScript resolves them to `.ts` source files.
