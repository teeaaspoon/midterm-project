# DevStash

Pinterest for Developers who love to learn.

## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Run migrations: `npm run knex migrate:latest`
  - Check the migrations folder to see what gets created in the DB
6. Run the seed: `npm run knex seed:run`
  - Check the seeds file to see what gets seeded in the DB
7. If there are any problems with the seed: `npm run knex migrate:rollback`
8. Run the server: `npm run local`
9. Visit `http://localhost:8080/`

## Dependencies

- Node 5.10.x or above
- NPM 3.8.x or above
- BCrypt 2.4.3 or above
- Body-parser 1.15.2 or above
- Cookie-session 2.0.0 or above
- Dotenv 2.0.0 or above
- EJS 2.4.1 or above
- Express 4.13.4 or above
- JsonWebToken 8.3.0 or above
- Knex 0.11.7 or above
- Knex-logger 0.1.0 or above
- Moment 2.22.2 or above
- Morgan 1.7.0 or above
- Node-Sass-Middleware 0.9.8 or above
- Path 0.12.7 or above
- PG 6.0.2 or above


## Screenshots

!["Screenshot of home page"](https://github.com/Bardia95/midterm-project/blob/master/docs/Homepage%20Screenshot.png)
!["Screenshot of My Profile / Likes"](https://github.com/Bardia95/midterm-project/blob/master/docs/My%20Profile%20and%20Likes.png)
!["Screenshot of new post form"](https://github.com/Bardia95/midterm-project/blob/master/docs/New%20Post%20Form.png)



