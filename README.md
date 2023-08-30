# Book Review GraphQL API

Book review GraphQL API built using Node.js, TypeScript, Prisma, and GraphQL Yoga.
This API allows you to manage users, reviews, and books.

## Installation

To set up the API locally, follow these steps:

1. Install dependencies:

```bash
pnpm install
```

2. Host postgresql database. For local development you can use docker and included `docker-compose.yml` file:
```bash
docker-compose up -d
```

3. Fill `.env` file, example:
```
DATABASE_URL="postgresql://admin:password@localhost:5432/posts"
JWT_SECRET="secret"
PORT=4000
TOKEN_EXPIRE_TIME="1d"
```

4. Apply migrations to create the database schema:

```bash
npx prisma migrate dev
```

5. Start the server:

```bash
npm run start:dev
```

## Schema Overview

The GraphQL schema defines the types, queries, and mutations available in the API. Here's an overview of the main types:

- `User`: Represents a user with their name, email, and reviews.
- `Book`: Represents a book with its title, author, ISBN, and reviews.
- `Review`: Represents a review with its text, rating, author, and book.

## Queries

### `profile`

Retrieve the profile of the currently authenticated user.

```graphql
query {
  profile {
    id
    name
    email
    reviews {
      id
      text
      rating
      book {
        id
        title
      }
    }
  }
}
```

### `users`

Retrieve a list of users based on the provided query.

```graphql
query {
  users(query: "example") {
    id
    name
    email
    reviews {
      id
      text
      rating
      book {
        id
        title
      }
    }
  }
}
```

### `books`

Retrieve a list of books based on the provided query, skip, and take parameters.

```graphql
query {
  books(query: "example", skip: 0, take: 10) {
    id
    title
    author
    reviews {
      id
      text
      rating
      author {
        id
        name
      }
    }
  }
}
```

## Mutations

### `createUser`

Create a new user.

```graphql
mutation {
  createUser(data: {
    name: "John Doe"
    email: "john@example.com"
    password: "secretpassword"
  }) {
    id
    name
    email
  }
}
```

### `login`

Authenticate a user and retrieve their profile along with a token.

```graphql
mutation {
  login(email: "john@example.com", password: "secretpassword") {
    user {
      id
      name
      email
    }
    token
  }
}
```

### `createBook` (protected)

Create a new book.

```graphql
mutation {
  createBook(title: "Sample Book", author: "Author Name", isbn: "123456789") {
    id
    title
    author
    isbn
  }
}
```

### `createReview` (protected)

Create a new review for a book.

```graphql
mutation {
  createReview(text: "Great book!", rating: 5, bookId: '123') {
    id
    text
    rating
    book {
      id
      title
      author
      isbn
    }
  }
}
```

## Authentication

The API uses token-based authentication. To authenticate, use the `login` mutation to obtain a token. Include the token in the `Authorization` header of your requests with the format: `Bearer <token>`.
