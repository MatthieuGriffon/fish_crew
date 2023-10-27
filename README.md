🎣 Fish Crew
Fish Crew 🐟 is a web application designed for fishing enthusiasts who want to share their favorite fishing spots with their friends.
The application allows users to create public or private groups to invite people to join and share fishing locations.
Users can mark points on the map 🗺️ and decide their visibility based on their group or public availability.

Key Features

Creation of public and private groups for sharing fishing spots 🐠

Marking points on the map with details about fishing spots 📍

Management of group members, including inviting and removing members 👥

Selective visibility of fishing spots based on group privacy settings 🔒

Real-time communication among members through Socket.IO ⚡


Technologies Used
Next.js for web application development

React for building the user interface

Leaflet for integrating interactive mapping

Socket.IO for real-time communication between server and client

Prisma for interaction with the MySQL database 

JSON Web Tokens (jsonwebtoken) for authentication and security

bcrypt for password hashing

Node.js for running server-side JavaScript code

UUID for generating unique identifiers

Dotenv for managing environment variables

TypeScript for adding static typing to JavaScript

Tailwind CSS for designing and styling the user interface

Eslint for static code analysis of JavaScript


Installation
Make sure you have Node.js and npm installed locally. Clone the repository, then run the following commands:

```bash
npm install
npm run dev
```
The development server should start at http://localhost:3000.

Configuration
Make sure to set up environment variables in a separate .env file that will not be publicly shared.

Include sensitive information such as database URLs, authentication secrets, and API keys in this file.

Here is an example of the .env file structure:

```bash
DATABASE_URL=""
NEXTAUTH_SECRET=
NEXTAUTH_URL=
JWT_SECRET=
MAILJET_API_KEY=
MAILJET_API_SECRET=
```


