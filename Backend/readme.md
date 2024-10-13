# Agent Master API

**Author**: Rahul Parihar (rahulaauji71@gmail.com)  
**Description**: This is an API backend for managing agents and licenses. It allows users to register, log in, create agents, purchase licenses, update agent configurations, and perform heartbeat checks to keep agent statuses up to date.

## Table of Contents
- [Technologies](#technologies)
- [Features](#features)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)

## Technologies

- Node.js
- Express
- MongoDB (with Mongoose ORM)
- JWT (JSON Web Token) for authentication
- bcrypt for password hashing
- dotenv for environment configuration
- cors for enabling cross-origin requests

## Features

- User Registration & Authentication
- Agent Creation & License Generation
- Configure Supported Brands for Agents
- Periodic Heartbeat to Update Agent Status
- Secure Routes using JWT Authentication
- MongoDB Database for User, Agent, and License Management

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rahulaauji-30/agent-master.git
   cd agent-master-api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the root directory with the following variables:
   ```env
   MONGO_URI=<your-mongo-uri>
   JWT_SECRET=<your-jwt-secret>
   ```

4. **Run the application**:
   ```bash
   npm start
   ```

5. The server will start on `http://localhost:3000`.

## API Endpoints

### Public Routes

- **GET** `/api`: Check if the API is up and running.

- **POST** `/api/register`: Register a new user.
  - Request body: `{ "email": "user@example.com", "name": "User Name", "password": "yourpassword" }`
  
- **POST** `/api/login`: Log in an existing user.
  - Request body: `{ "email": "user@example.com", "password": "yourpassword" }`

### Protected Routes (Require JWT token)

- **POST** `/api/new-agent`: Create a new agent.
  - Request body: `{ "name": "Agent Name", "description": "Agent Description", "brandsSupported": "Brand1,Brand2" }`

- **GET** `/api/agents`: Retrieve all agents.

- **POST** `/api/purchase`: Purchase an agent license.
  - Automatically creates an agent and returns an installation script.

- **GET** `/api/myagents`: Retrieve agents for the authenticated user.

- **POST** `/api/agent/heartbeat`: Update agent status.
  - Request body: `{ "agentId": "AgentID", "status": "Online/Offline" }`

- **POST** `/api/agent/configure`: Configure supported brands for an agent.
  - Request body: `{ "agentId": "AgentID", "brandsSupported": ["Brand1", "Brand2"] }`

## Usage

To interact with the API, make requests using Postman or cURL.

Example to register:
```bash
curl -X POST http://localhost:3000/api/register \
-H "Content-Type: application/json" \
-d '{"email": "user@example.com", "name": "User Name", "password": "yourpassword"}'
```

Example to create a new agent (requires token):
```bash
curl -X POST http://localhost:3000/api/new-agent \
-H "Authorization: Bearer <your-jwt-token>" \
-H "Content-Type: application/json" \
-d '{"name": "Agent X", "description": "Agent Description", "brandsSupported": "Brand1,Brand2"}'
```