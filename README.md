# Secure Notes API

A secure REST API built with Node.js, Express, MongoDB, Mongoose, bcrypt, and JSON Web Tokens.

The application demonstrates both authentication and ownership-based authorization. Users can register and log in, but authenticated users may only access and manage notes that they personally own.

## Features

- User registration
- Secure bcrypt password hashing
- User login
- JWT authentication
- Protected notes endpoints
- User-owned notes
- Create notes associated with the authenticated user
- Retrieve only the authenticated user's notes
- Update only notes owned by the authenticated user
- Delete only notes owned by the authenticated user
- `401 Unauthorized` responses for authentication failures
- `403 Forbidden` responses for ownership failures

## Technologies

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- bcrypt
- JSON Web Tokens
- dotenv

## Project Structure

```text
secure-notes-api/
├── config/
│   └── connection.js
├── models/
│   ├── User.js
│   ├── Note.js
│   └── index.js
├── routes/
│   ├── index.js
│   └── api/
│       ├── index.js
│       ├── userRoutes.js
│       └── noteRoutes.js
├── utils/
│   └── auth.js
├── .env
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## Installation

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=3001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_private_jwt_secret
```

The real `.env` file should not be committed to GitHub.

## Running the Application

```bash
npm start
```

The API runs at:

```text
http://localhost:3001
```

## Authentication

Protected endpoints require a JWT in the Authorization header:

```text
Authorization: Bearer YOUR_TOKEN
```

## User Endpoints

### Register

```http
POST /api/users/register
```

Example:

```json
{
  "username": "ricardo",
  "email": "ricardo@example.com",
  "password": "password123"
}
```

### Login

```http
POST /api/users/login
```

Example:

```json
{
  "email": "ricardo@example.com",
  "password": "password123"
}
```

Successful login returns a signed JWT.

## Note Endpoints

### Get Current User's Notes

```http
GET /api/notes
```

Requires authentication.

Only notes belonging to the authenticated user are returned.

### Create Note

```http
POST /api/notes
```

Example:

```json
{
  "title": "MongoDB Notes",
  "content": "Mongoose models define the structure of MongoDB documents."
}
```

The authenticated user's ID is automatically assigned as the note owner.

### Update Note

```http
PUT /api/notes/:id
```

Example:

```json
{
  "title": "Updated MongoDB Notes"
}
```

Only the note's owner may update it.

A non-owner receives:

```json
{
  "message": "User is not authorized to update this note."
}
```

with HTTP status `403 Forbidden`.

### Delete Note

```http
DELETE /api/notes/:id
```

Only the note's owner may delete it.

A non-owner receives:

```json
{
  "message": "User is not authorized to delete this note."
}
```

with HTTP status `403 Forbidden`.

## Authentication vs. Authorization

Authentication answers:

> Who are you?

The JWT proves the identity of the logged-in user.

Authorization answers:

> Are you allowed to perform this action?

Each note stores its owner's MongoDB ObjectId. Before sensitive operations, the API compares that ID with the authenticated user's ID.

```text
Request
   ↓
JWT Authentication
   ↓
req.user
   ↓
Find Note
   ↓
Does note.user === req.user._id?
   ↓
 YES             NO
  ↓               ↓
Allow          403 Forbidden
```

## Security

- Passwords are hashed using bcrypt.
- JWT secrets are stored in environment variables.
- Protected routes require valid JWTs.
- Notes are associated with their authenticated owner.
- Users cannot retrieve another user's notes through the collection endpoint.
- Ownership is checked before updates and deletes.
- Clients cannot choose a note owner during note creation.
- Password hashes are not returned by authentication responses.

## Acceptance Criteria

- Note model contains a required User ObjectId reference.
- New notes automatically receive the authenticated user's ID.
- GET `/api/notes` returns only the authenticated user's notes.
- Owners can update their notes.
- Owners can delete their notes.
- Non-owners receive `403 Forbidden` when attempting to update another user's note.
- Non-owners receive `403 Forbidden` when attempting to delete another user's note.
- Unauthenticated requests are rejected.