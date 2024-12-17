# Music Library API

The **Music Library API** allows users to interact with a music catalog system. Users can manage favorites, albums, artists, and tracks. The API supports operations like adding, updating, and deleting resources.

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Installation](#installation)
4. [Environment Variables](#environment-variables)
5. [Routes](#routes)
6. [Usage](#usage)
7. [Error Handling](#error-handling)
8. [Contributing](#contributing)
9. [License](#license)

---

## Features

- **User Authentication**: Sign up, log in, and logout securely.
- **Manage Favorites**: Add artists, albums, or tracks to favorites.
- **CRUD Operations**:
  - Artists
  - Albums
  - Tracks
- **Role-Based Access Control**: Admin and Editor permissions for creating or updating resources.
- **Token Blacklisting**: Tokens can be invalidated after logout.

---

## Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB** with Mongoose ORM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Dotenv** for environment variables
- **Nodemon** for development

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/music-library-api.git
   cd music-library-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm run dev
   ```

---

## Environment Variables

Create a `.env` file in the project root and configure the following variables:

```env
PORT=3000
DB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
```

---
## Routes

### Auth Routes

| Method | Endpoint                 | Description          |
|--------|--------------------------|----------------------|
| POST   | `/auth/signup`           | User signup          |
| POST   | `/auth/login`            | User login           |
| GET    | `/auth/logout`           | Logout user          |

### User Routes

| Method | Endpoint                 | Description                |
|--------|--------------------------|----------------------------|
| POST   | `/add-user`           | Add a new artist           |
| GET    | `/`           | Get user details         |
| PUT    | `/update-password`           | Update artist details      |
| DELETE | `/:id`           | Delete an artist           |

### Artist Routes

| Method | Endpoint                 | Description                |
|--------|--------------------------|----------------------------|
| POST   | `/artist/add-artist`           | Add a new artist           |
| GET    | `/artist`           | Get artist details         |
| GET    | `/artist/:id`           | Get artist details of particular id        |
| PUT    | `/artist/:id`           | Update artist details      |
| DELETE | `/artist/:id`           | Delete an artist           |

### Album Routes

| Method | Endpoint                 | Description                |
|--------|--------------------------|----------------------------|
| POST   | `/album/add-album`            | Add a new album            |
| GET    | `/album`            | Get album details          |
| GET    | `/album/:id`            | Get album details of particular id        |
| PUT  | `/album/:id`            | Update album details       |
| DELETE | `/album/:id`            | Delete an album            |

### Track Routes

| Method | Endpoint                 | Description                |
|--------|--------------------------|----------------------------|
| POST   | `/track/add-track`            | Add a new track            |
| GET    | `/track/:id`            | Get track details of particular id        |
| GET    | `/track`            | Get track details          |
| PUT  | `/track/:id`            | Update track details       |
| DELETE | `/track/:id`            | Delete a track             |

### Favorites Routes

| Method | Endpoint                 | Description                |
|--------|--------------------------|----------------------------|
| POST   | `/favorite/add-favorite` | Add favorite (by ID)       |
| GET    | `/favorite/:category`             | Retrieve user favorites    |
| DELETE    | `/favorite/remove-favorite/:id`             | Retrieve user favorites    |

---

## Usage

### 1. Sign Up:
   ```http
   POST /auth/signup
   Content-Type: application/json
   ```
  #### Body

  ```
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

---
### 2. login:
   ```http
   POST /auth/signup
   Content-Type: application/json
   ```
  #### Body

  ```
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

---
#
After logging in u make sure add the the Authorization Token 


### 3. logout:
   ```http
POST /auth/logout
Authorization: Bearer <token>

   ```
  #### Body

  ```
   {}
   ```

---
### 4. Get All Users
   ```http
   GET /users
Authorization: Bearer <token>

   ```
  #### Body

  ```
   {}
   ```

---
## Error Handling

Standardized error responses:

```json
{
  "status": 404,
  "data": null,
  "message": "Resource not found.",
  "error": "Details about the error"
}
```

---

## Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository.
2. Create a new branch (`feature/your-feature-name`).
3. Commit changes and push to GitHub.
4. Open a Pull Request.

---

## License

This project is licensed under the **MIT License**.
