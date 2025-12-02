# How to run locally

1. Install dependencies:
   npm install

2. Create a Postgres database and update .env or use .env.example

3. Run migrations / start:
   npm run start:dev

4. Endpoints
   POST /auth/login    - login with { email, password }
   POST /users         - create user (register)
   GET  /users         - list users (requires Authorization: Bearer <token>)
   GET  /users/:id
   PATCH /users/:id
   DELETE /users/:id

Note: This scaffold uses TypeORM 'synchronize: true' for simplicity (auto-creates tables). Turn off in prod.
