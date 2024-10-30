Event-booking API
This API provides functionality for managing events, including ticket booking, user management, and real-time status updates. The main functionalities include user registration and login, event creation and booking, and status checking for events.

Table of Contents
Getting Started
Environment Variables
Endpoints
User Management
Error Handling
Getting Started
Prerequisites
Node.js
NPM
MySQL (or any supported SQL database)
Installation

bash
Copy code
git clone https://github.com/your-username/event-management-api.git
cd event-management-api
Install dependencies:

bash
Copy code
npm install
Set up environment variables in a .env file. See Environment Variables for details.

bash
npm sequelize-cli db:migrate
Start the server:

bash
Copy code
npm run start
The API will be available at http://localhost:3307.

Environment Variables
Set up a .env file in the root directory with the following values:

Endpoints
Signup
URL: POST /auth/signup
Description: Registers a new user.
Request Body:
json
Copy code
{
    "username": "name",
    "email": "email",
    "password": "password"
}
Login
URL: POST /auth/login
Description: Authenticates a user and returns a JWT token.
Request Body:
json
Copy code
{
    "email": "name",
    "password": "password"
}
Update User
URL: PUT /user/admin/:userId
Description: Updates user information.
Request Body:
json
Copy code
{
    "username": "name",
    "email": "email"
}
Delete User
URL: DELETE /user/:UserId
Description: Deletes a user from the system.

Event

Initialize Event
URL: POST /events
Description: Initializes a new event.
Request Body:
json
Copy code
{
    "name": "event-name",
    "totalTickets": 50,
    "availableTickets": 50
}

Book Event
URL: POST /events/book
Description: Books a ticket for an event if available, or adds to a waiting list if full.
Request Body:
json
Copy code
{
    "eventId": 1,
    "userId": "user123"
}
Cancel Event Booking
URL: POST /events/cancel
Description: Cancels a ticket and updates availability. If there are users on the waiting list, assigns a ticket to the next user.
Request Body:
json
Copy code
{
    "eventId": 1,
    "userId": "smooth"
}

Event Status
URL: GET /events/status/:eventId
Description: Retrieves current ticket availability and waiting list count.
Response:
json
Copy code
{
    "availableTickets": 50,
    "waitingListCount": 0
}
Error Handling
Errors are returned in JSON format:

json
Copy code
{
    "message": "Error message",
}
