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
   
You are ready! Happy coding :)
