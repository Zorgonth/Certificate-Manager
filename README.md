# technical-interview-project

## Getting started

### Prerequisites

- npm
- NodeJS >= v20

1. Set up the NodeJS backend server

   ```sh
   # from the root directory
   cd backend
   
   # install dependencies
   npm install
   
   # The db-scripts will as a result create a small SQLite database so you can use it in your local development
   npm run db:migrate
   
   npm run db:push
   
   cd prisma
   
   # This is a command used in Prisma to generate the Prisma Client based on your Prisma schema (schema.prisma file). 
   # This client is used to interact with your database in a type-safe manner.
   npx prisma generate
   
   cd ..
   
   # This starts the development server
   npm run start
   ```



2. In a separate terminal, we set up the React frontend application
   ```sh
   # from the root directory
   cd frontend
   
   # install dependencies
   npm install
   
   # This starts the React application
   npm run start
   ```

3. To run The backend tests using jest, follow these steps:
   ```sh
   # from the root directory
   cd backend
   
   # This runs all the tests that are in the __tests__ directory
   npx jest
   ```

4. To use the mock database for testing purposes, follow these steps:
   ```sh
   # from the root directory
   cd backend

   # Create and push the schema to the mock SQLite database
   npm run push:mock

   # Start the backend server using the mock.db file
   npm run start:mock
   ```
5. To run the frontend tests using cypress, follow these steps:
   ```sh
   #from the root directory
   cd frontend

   # Run all Cypress E2E tests headlessly
   npm run cy:run

   # Or launch the Cypress UI for interactive testing
   npm run cy:open
   ```
