<div align="center">
<h1>
   BlackJackAPI
</h1>
</div>

<br />

# :notebook_with_decorative_cover: Table of Contents

- [About the Project](#star2-about-the-project)
  - [Tech Stack](#space_invader-tech-stack)
- [Getting Started](#toolbox-getting-started)
  - [Run Locally](#running-run-locally)
- [Contact](#handshake-contact)
- [Acknowledgements](#gem-acknowledgements)

## :star2: About the Project

Project is a replication of the popular black jack card game. It was created to show my skills.
The project was written in Nest.js with typescript. I used the Atlas mongoDb database Cloud database for mongoDb.
For authentication and authorization I use passport.js and jwt token. 
The application can be a separate entity, but it can also be combined with the frontend version, which can be found here:<a href="https://github.com/Michalus88/BlackJack-React-ts.git">BlackJack-React-ts</a>

### :space_invader: Tech Stack

  <ul>
    <li><a href="https://nestjs.com/">Nest.js</a></li>
    <li><a href="https://www.typescriptlang.org/">Typescript</a></li>
    <li><a href="https://www.mongodb.com/">MongoDb</a></li>
  </ul>

### :key: Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGO_URI`

`SALT_PWD`

`JWT_SECRET`

`SEND_GRID_KEY` (optional - the module is not used yet)

## :toolbox: Getting Started

### :running: Run Locally

Clone the project

```bash
  git clone https://github.com/Michalus88/BlackJack-Nest-mongo.git
```

Go to the project directory

```bash
  cd BlackJack-Nest-mongo
```

Install dependencies

```bash
  npm install
```

Start the server development

```bash
  npm start
```

Start the  watch mode

```bash
   npm run start:dev
```

Start the  production mode

```bash
   npm run start:prod
```

## :handshake: Contact

Michał Molenda: [Gmail](mailto:michalus88@gmail.com)


