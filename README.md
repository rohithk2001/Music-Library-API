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

### User Routes

| Method | Endpoint                 | Description          |
|--------|--------------------------|----------------------|
| POST   | `/auth/signup`           | User signup          |
| POST   | `/auth/login`            | User login           |
| POST   | `/auth/logout`           | Logout user          |

### Artist Routes

| Method | Endpoint                 | Description                |
|--------|--------------------------|----------------------------|
| POST   | `/artists/add`           | Add a new artist           |
| GET    | `/artists/:id`           | Get artist details         |
| PATCH  | `/artists/:id`           | Update artist details      |
| DELETE | `/artists/:id`           | Delete an artist           |

### Album Routes

| Method | Endpoint                 | Description                |
|--------|--------------------------|----------------------------|
| POST   | `/albums/add`            | Add a new album            |
| GET    | `/albums/:id`            | Get album details          |
| PATCH  | `/albums/:id`            | Update album details       |
| DELETE | `/albums/:id`            | Delete an album            |

### Track Routes

| Method | Endpoint                 | Description                |
|--------|--------------------------|----------------------------|
| POST   | `/tracks/add`            | Add a new track            |
| GET    | `/tracks/:id`            | Get track details          |
| PATCH  | `/tracks/:id`            | Update track details       |
| DELETE | `/tracks/:id`            | Delete a track             |

### Favorites Routes

| Method | Endpoint                 | Description                |
|--------|--------------------------|----------------------------|
| POST   | `/favorites/add/:item_id` | Add favorite (by ID)       |
| GET    | `/favorites`             | Retrieve user favorites    |

---

## Usage

1. **Sign Up**:
   ```http
   POST /auth/signup
   Content-Type: application/json

   {
     "username": "user123",
     "email": "user@example.com",
     "password": "password123"
   }
   ```

2. **Login**:
   ```http
   POST /auth/login
   Content-Type: application/json

   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

3. **Add a Favorite**:
   ```http
   POST /favorites/add/:item_id
   Authorization: Bearer <JWT_TOKEN>

   {
     "category": "track"
   }
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
