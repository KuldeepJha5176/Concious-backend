# Conscious Backend

<p align="center">
  <a href="https://github.com/KuldeepJha5176/Concious-backend">
 <img src="https://github.com/KuldeepJha5176/concious-frontend/blob/master/public/logo.png" alt="Logo" width="40px" >
  </a>
</p>

<h3 align="center">Conscious App</h3>

<p align="center">
  Conscious is a second brain web app designed to save and search links, notes, and other media from various sources effortlessly. This repository contains the backend codebase for the Conscious application.
</p>

<p align="center">
  <img src="https://img.shields.io/github/languages/top/KuldeepJha5176/Concious-backend" />
  <img src="https://img.shields.io/github/license/KuldeepJha5176/Concious-backend" />
  <img src="https://img.shields.io/github/repo-size/KuldeepJha5176/Concious-backend" />
  <img src="https://img.shields.io/github/last-commit/KuldeepJha5176/Concious-backend" />
</p>

---

## Frontend Repository

👉 [conscious-frontend](https://github.com/KuldeepJha5176/concious-frontend.git)

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/)
- [MongoDB](https://www.mongodb.com/)
- [Pinecone](https://www.pinecone.io/)
- [YouTube API Key](https://developers.google.com/youtube/v3)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/KuldeepJha5176/Concious-backend.git
cd Concious-backend
```
2.  Install dependencies with `bun install`
3.  Create a `.env` file in the root directory and add the following variables:

```
PINECONE_API_KEY=
GEMINI_API_KEY= 
JWT_SECRET = 
PORT=3000
MONGO_URL="mongodb+srv:
PINECONE_ENVIRONMENT=
PINECONE_INDEX=
YOUTUBE_API_KEY=
```

4.  Start the server with `bun index.ts`

### Installation using Docker

1.  Clone the repository
    ```bash
    git clone https://github.com/KuldeepJha5176/Concious-backend.git
    ```
2.  Create a `.env` file in the root directory and add the following variables:

```
PINECONE_API_KEY=
GEMINI_API_KEY= 
JWT_SECRET = 
PORT=3000
MONGO_URL="mongodb+srv:
PINECONE_ENVIRONMENT=
PINECONE_INDEX=
YOUTUBE_API_KEY=
```

3.  Build the Docker image with `docker build -t concious-backend .`
4.  Run the Docker container with `docker run -p 3000:3000 concious-backend`

## Usage

The application is built using the following technologies:

- [Bun](https://bun.sh/): A fast all-in-one JavaScript runtime.
- [MongoDB](https://www.mongodb.com/): A NoSQL database.
- [Pinecone](https://www.pinecone.io/): A vector database for AI applications.
- [YouTube API](https://developers.google.com/youtube/v3/): A powerful API for accessing YouTube data.

The application uses the following libraries:

- [Express.js](https://expressjs.com/): A popular web framework for Node.js.
- [Mongoose](https://mongoosejs.com/): A MongoDB ODM (Object Data Model) for Node.js.
- [JWT](https://jwt.io/): A JSON Web Token (JWT) library for Node.js.
- [Axios](https://axios-http.com/): A popular HTTP client for Node.js.


## Features

- User authentication and authorization
- User profile management
- Link sharing and search
- Note taking and search
- Media upload and search
- AI-powered search and recommendations
- Integration with YouTube



## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch for your changes
3. Make your changes and commit them with descriptive commit messages
4. Push your changes to your forked repository
5. Create a pull request to the main repository

## License  
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

