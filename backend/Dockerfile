FROM node:20.8.0

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

# docker build -f ./Dockerfile -t expressdocker .
# docker run -p 3000:3000 expressdocker
