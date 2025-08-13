# Backend API Routes
All endpoints return JSON unless otherwise noted.
Base URL: /api

# USER AUTHENTICATION/AUTHORIZATION

## All endpoints that require authentication
All endpoints that require a current user to be logged in.

* Request: endpoints that require authentication

* Error Response: Require authentication
  * Status Code: 401
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Authentication required"
    }
    ```

## All endpoints that require proper authorization
All endpoints that require authentication and the current user does not have the correct role(s) or permission(s).

* Request: endpoints that require proper authorization

* Error Response: Require proper authorization
  * Status Code: 403
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Forbidden"
    }
    ```

## USERS

### Sign Up a User
Creates a new user, logs them in as the current user, and returns the current user's information.

* Require Authentication: false

* Request
  * Method: POST
  * Route path: /api/users
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "username": "player1",
      "email": "player1@example.com",
      "password": "securepassword"
    }
    ```

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "user": {
        "user_id": 1,
        "username": "player1",
        "email": "player1@example.com",
        "created_at": "2025-08-08T12:00:00Z"
      }
    }
    ```

* Error response: User already exists with the specified email or username
  * Status Code: 500
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "User already exists",
      "errors": {
        "email": "User with that email already exists",
        "username": "User with that username already exists"
      }
    }
    ```

* Error response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Bad Request",
      "errors": {
        "email": "Invalid email",
        "username": "Username is required",
        "password": "Password must be 6 or more characters"
      }
    }
    ```

### Log In a User
Logs in a current user with valid credentials and returns the current user's information.

* Require Authentication: false

* Request
  * Method: POST
  * Route path: /api/session
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "email": "player1@example.com",
      "password": "securepassword"
    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "user": {
        "user_id": 1,
        "username": "player1",
        "email": "player1@example.com"
      }
    }
    ```

* Error Response: Invalid credentials
  * Status Code: 401
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Invalid credentials"
    }
    ```

* Error response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Bad Request",
      "errors": {
        "email": "Email is required",
        "password": "Password is required"
      }
    }
    ```

### Log Out Current User
Logs out the current user.

* Require Authentication: true

* Request
  * Method: DELETE
  * Route path: /api/session
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Successfully logged out"
    }
    ```

### Get User Details
Get details for a specific user.

* Require Authentication: false (true for private details)

* Request
  * Method: GET
  * Route path: /api/users/:id
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "user": {
        "user_id": 1,
        "username": "player1",
        "email": "player1@example.com",
        "created_at": "2025-08-08T12:00:00Z"
      }
    }
    ```

* Error response: Couldn't find a User with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "User couldn't be found"
    }
    ```

## GAMENIGHTS

### Get all Game Nights
Returns all the upcoming game nights.

* Require Authentication: false

* Request
  * Method: GET
  * Route path: /api/gamenights
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "GameNights": [
        {
          "id": 1,
          "host_id": 1,
          "title": "Friday D&D",
          "game_id": 2,
          "description": "Level 5 campaign — bring snacks!",
          "location_name": "John's House",
          "location_details": "123 Main St, Apt 2",
          "start_time": "2025-08-15T18:00:00Z",
          "end_time": "2025-08-15T23:00:00Z",
          "max_players": 6,
          "created_at": "2025-08-08T12:00:00Z",
          "updated_at": "2025-08-08T12:00:00Z"
        }
      ]
    }
    ```

### Create a Game Night
Creates and returns a new game night.

* Require Authentication: true

* Request
  * Method: POST
  * Route path: /api/gamenights
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "title": "Friday D&D",
      "game_id": 2,
      "description": "Level 5 campaign — bring snacks!",
      "location_name": "John's House",
      "location_details": "123 Main St, Apt 2",
      "start_time": "2025-08-15T18:00:00Z",
      "end_time": "2025-08-15T23:00:00Z",
      "max_players": 6
    }
    ```

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "GameNight": {
        "id": 1,
        "host_id": 1,
        "title": "Friday D&D",
        "game_id": 2,
        "description": "Level 5 campaign — bring snacks!",
        "location_name": "John's House",
        "location_details": "123 Main St, Apt 2",
        "start_time": "2025-08-15T18:00:00Z",
        "end_time": "2025-08-15T23:00:00Z",
        "max_players": 6,
        "created_at": "2025-08-08T12:00:00Z",
        "updated_at": "2025-08-08T12:00:00Z"
      }
    }
    ```

* Error response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Bad Request",
      "errors": {
        "title": "Title is required",
        "start_time": "Start time must be in the future",
        "max_players": "Max players must be at least 2"
      }
    }
    ```

### Get Details of a Specific Game Night
Returns the details of a specific game night.

* Require Authentication: false

* Request
  * Method: GET
  * Route path: /api/gamenights/:id
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "GameNight": {
        "id": 1,
        "host_id": 1,
        "title": "Friday D&D",
        "game_id": 2,
        "description": "Level 5 campaign — bring snacks!",
        "location_name": "John's House",
        "location_details": "123 Main St, Apt 2",
        "start_time": "2025-08-15T18:00:00Z",
        "end_time": "2025-08-15T23:00:00Z",
        "max_players": 6,
        "created_at": "2025-08-08T12:00:00Z",
        "updated_at": "2025-08-08T12:00:00Z",
        "Host": {
          "user_id": 1,
          "username": "player1"
        },
        "Game": {
          "id": 2,
          "name": "Dungeons & Dragons 5e"
        }
      }
    }
    ```

* Error response: Couldn't find a GameNight with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Game night couldn't be found"
    }
    ```

### Edit a Game Night
Updates and returns an existing game night.

* Require Authentication: true
* Require proper authorization: Game night must belong to the current user

* Request
  * Method: PUT
  * Route path: /api/gamenights/:id
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "title": "Updated Friday D&D",
      "description": "Updated description",
      "max_players": 8
    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "GameNight": {
        "id": 1,
        "host_id": 1,
        "title": "Updated Friday D&D",
        "game_id": 2,
        "description": "Updated description",
        "location_name": "John's House",
        "location_details": "123 Main St, Apt 2",
        "start_time": "2025-08-15T18:00:00Z",
        "end_time": "2025-08-15T23:00:00Z",
        "max_players": 8,
        "created_at": "2025-08-08T12:00:00Z",
        "updated_at": "2025-08-09T10:00:00Z"
      }
    }
    ```

* Error response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Bad Request",
      "errors": {
        "max_players": "Max players cannot be less than current RSVPs"
      }
    }
    ```

### Delete a Game Night
Deletes an existing game night.

* Require Authentication: true
* Require proper authorization: Game night must belong to the current user

* Request
  * Method: DELETE
  * Route path: /api/gamenights/:id
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Game night was successfully deleted"
    }
    ```

* Error response: Couldn't find a GameNight with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Game night couldn't be found"
    }
    ```

## GAMES

### Get all Games
Returns all the games in the system.

* Require Authentication: false

* Request
  * Method: GET
  * Route path: /api/games
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "Games": [
        {
          "id": 1,
          "name": "Dungeons & Dragons 5e",
          "description": "Tabletop role-playing game",
          "min_players": 2,
          "max_players": 8,
          "created_at": "2025-08-08T12:00:00Z",
          "updated_at": "2025-08-08T12:00:00Z"
        }
      ]
    }
    ```

### Create a Game
Creates and returns a new game.

* Require Authentication: true

* Request
  * Method: POST
  * Route path: /api/games
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "name": "Dungeons & Dragons 5e",
      "description": "Tabletop role-playing game",
      "min_players": 2,
      "max_players": 8
    }
    ```

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "Game": {
        "id": 1,
        "name": "Dungeons & Dragons 5e",
        "description": "Tabletop role-playing game",
        "min_players": 2,
        "max_players": 8,
        "created_at": "2025-08-08T12:00:00Z",
        "updated_at": "2025-08-08T12:00:00Z"
      }
    }
    ```

* Error response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Bad Request",
      "errors": {
        "name": "Name is required",
        "min_players": "Minimum players must be at least 1",
        "max_players": "Max players must be greater than min players"
      }
    }
    ```

### Get Details of a Specific Game
Returns the details of a specific game.

* Require Authentication: false

* Request
  * Method: GET
  * Route path: /api/games/:id
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "Game": {
        "id": 1,
        "name": "Dungeons & Dragons 5e",
        "description": "Tabletop role-playing game",
        "min_players": 2,
        "max_players": 8,
        "created_at": "2025-08-08T12:00:00Z",
        "updated_at": "2025-08-08T12:00:00Z"
      }
    }
    ```

* Error response: Couldn't find a Game with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Game couldn't be found"
    }
    ```

### Edit a Game
Updates and returns an existing game.

* Require Authentication: true

* Request
  * Method: PUT
  * Route path: /api/games/:id
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "description": "Updated description",
      "max_players": 10
    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "Game": {
        "id": 1,
        "name": "Dungeons & Dragons 5e",
        "description": "Updated description",
        "min_players": 2,
        "max_players": 10,
        "created_at": "2025-08-08T12:00:00Z",
        "updated_at": "2025-08-09T10:00:00Z"
      }
    }
    ```

* Error response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Bad Request",
      "errors": {
        "max_players": "Max players must be greater than min players"
      }
    }
    ```

### Delete a Game
Deletes an existing game.

* Require Authentication: true

* Request
  * Method: DELETE
  * Route path: /api/games/:id
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Game was successfully deleted"
    }
    ```

* Error response: Couldn't find a Game with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Game couldn't be found"
    }
    ```

## RSVPs (GAMENIGHT PLAYERS)

### RSVP to a Game Night
Creates an RSVP for the current user to a game night.

* Require Authentication: true

* Request
  * Method: POST
  * Route path: /api/gamenights/:id/players
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "status": "going"
    }
    ```

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "RSVP": {
        "id": 1,
        "user_id": 1,
        "gamenight_id": 1,
        "status": "going",
        "created_at": "2025-08-09T10:00:00Z",
        "updated_at": "2025-08-09T10:00:00Z"
      }
    }
    ```

* Error response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Bad Request",
      "errors": {
        "status": "Status must be 'going', 'maybe', or 'not_going'"
      }
    }
    ```

* Error response: Game night is full
  * Status Code: 403
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "This game night has reached maximum capacity"
    }
    ```

### Update RSVP Status
Updates an existing RSVP for a game night.

* Require Authentication: true
* Require proper authorization: RSVP must belong to the current user

* Request
  * Method: PUT
  * Route path: /api/gamenights/:id/players/:player_id
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "status": "maybe"
    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "RSVP": {
        "id": 1,
        "user_id": 1,
        "gamenight_id": 1,
        "status": "maybe",
        "created_at": "2025-08-09T10:00:00Z",
        "updated_at": "2025-08-09T11:00:00Z"
      }
    }
    ```

### Cancel RSVP
Deletes an existing RSVP for a game night.

* Require Authentication: true
* Require proper authorization: RSVP must belong to the current user

* Request
  * Method: DELETE
  * Route path: /api/gamenights/:id/players/:player_id
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "RSVP was successfully cancelled"
    }
    ```

## COMMENTS

### Get all Comments for a Game Night
Returns all the comments for a specific game night.

* Require Authentication: false

* Request
  * Method: GET
  * Route path: /api/gamenights/:id/comments
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "Comments": [
        {
          "id": 1,
          "user_id": 1,
          "gamenight_id": 1,
          "content": "Can't wait for game night!",
          "created_at": "2025-08-09T10:00:00Z",
          "updated_at": "2025-08-09T10:00:00Z",
          "User": {
            "user_id": 1,
            "username": "player1"
          }
        }
      ]
    }
    ```

### Create a Comment for a Game Night
Creates and returns a new comment for a game night.

* Require Authentication: true

* Request
  * Method: POST
  * Route path: /api/gamenights/:id/comments
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "content": "Can't wait for game night!"
    }
    ```

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "Comment": {
        "id": 1,
        "user_id": 1,
        "gamenight_id": 1,
        "content": "Can't wait for game night!",
        "created_at": "2025-08-09T10:00:00Z",
        "updated_at": "2025-08-09T10:00:00Z"
      }
    }
    ```

* Error response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Bad Request",
      "errors": {
        "content": "Comment text is required"
      }
    }
    ```

### Edit a Comment
Updates and returns an existing comment.

* Require Authentication: true
* Require proper authorization: Comment must belong to the current user

* Request
  * Method: PUT
  * Route path: /api/comments/:id
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "content": "Updated comment content"
    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "Comment": {
        "id": 1,
        "user_id": 1,
        "gamenight_id": 1,
        "content": "Updated comment content",
        "created_at": "2025-08-09T10:00:00Z",
        "updated_at": "2025-08-09T11:00:00Z"
      }
    }
    ```

### Delete a Comment
Deletes an existing comment.

* Require Authentication: true
* Require proper authorization: Comment must belong to the current user

* Request
  * Method: DELETE
  * Route path: /api/comments/:id
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Comment was successfully deleted"
    }
    ```

* Error response: Couldn't find a Comment with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Comment couldn't be found"
    }
    ```
