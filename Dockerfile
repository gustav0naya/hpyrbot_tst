# 1. Use an official Node.js runtime as a parent image
FROM node:18-alpine

# 2. Create and set the working directory inside the container
WORKDIR /usr/src/app

# 3. Copy package.json and package-lock.json before installing dependencies
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the application code into the container
COPY . .

# 6. Expose the port that your app runs on (usually 3000)
EXPOSE 3000

# 7. Define the command to start your app
CMD [ "npm", "start" ]
