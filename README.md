# Carrier Sales Interaction

This repository contains the API code for the Carrier Sales Interaction API Project. The API is designed to process load data and interact with the "loads" API. Below is an overview of the project structure, deployment details, and instructions for running and testing the code.

## Project Structure

The API code is organized into three main sections, for the 'loads' API and for the proxy server for the FMCSA API:

### Services

- **Contains** the core logic for the application.
- **Example**: The `loadService.js` file reads and processes a CSV file into an in-memory map for quick lookups.

### Routes

- **Defines** the API endpoints.
- **Example**: The `loadRoutes.js` file maps HTTP requests to controller functions.

### Controllers

- **Handles** incoming requests and responses.
- **Example**: The `loadController.js` file uses the service layer to fetch data and send appropriate responses.

## Features

### In-Memory Data Indexing

- The CSV data is processed into an in-memory map for efficient querying. This reduces the overhead of reading the file repeatedly.
- For future development, a database like SQL with indexed columns would be used to store and query data more efficiently.

### AWS Deployment

- The API is deployed on an AWS EC2 instance (`t2.micro`, free tier).
- Future improvements include deploying the Docker image to AWS Elastic Container Service (ECS) with Fargate and using a load balancer for traffic management.

### API Security

- Implemented API key authentication for secure interactions.
- HTTPS is enabled with a self-signed SSL certificate for local development. For public deployment, a domain and valid SSL certificate would be necessary.

### Error Handling

- Added detailed error messages for common use cases and potential user mistakes, guided by test cases.

### Dockerization

- Packaged the API into a Docker container using an AMD64 image.
- Deployed and executed the container on an EC2 instance.

## Access Instructions

The API is accessible via the following details:

- **Base URL:** `http://ec2-54-160-231-24.compute-1.amazonaws.com:3000`
- **Sample Endpoints:**
  - `/loads?reference_number=98765`
  - `/fmcsa/validate-carrier?mc_number=144127`
- **Authentication:** Use the following `curl` commands to interact with the API:

```bash
curl -X GET "http://ec2-54-160-231-24.compute-1.amazonaws.com:3000/loads?reference_number=98765" -H "x-api-key: 03d44e89"

curl -X GET "http://ec2-54-160-231-24.compute-1.amazonaws.com:3000/fmcsa/validate-carrier?mc_number=144127" -H "Authorization: Bearer 626e2c25fa501eb3fdc5bffe44863dc121464410"
```

## Running Tests

### Prerequisites

Ensure the following are installed on your system:

1. **Node.js**: Version 16 or above.
2. **npm**: Comes with Node.js (verify with `npm -v`).

### Steps to Execute Tests

1. **Clone the Repository**

   ```bash
   git clone https://github.com/gustav0naya/hpyrbot_tst
   cd hpyrbot_tst

2. **Install Dependencies**

   ```bash
   npm install

3. **Run Tests**

   ```bash
   npm test

### Testing Notes
- **Framework:** Jest is used as the testing framework for this project. 
