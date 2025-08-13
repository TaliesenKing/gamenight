# Frontend Routes

---

## Public Pages

### `/`
- **Description:** Homepage — lists upcoming gamenights (with title, game name, date)
- **Components:**
  - NavBar
  - GameNightList
  - Footer
- **State Needed:**
  - gamenights (list of objects)
- **API Calls:**
  - GET `/api/gamenights`

### `/login`
- **Description:** Login form
- **Components:**
  - LoginForm
- **State Needed:** session user
- **API Calls:**
  - POST `/api/session`

### `/signup`
- **Description:** Signup form
- **Components:**
  - SignupForm
- **State Needed:** session user
- **API Calls:**
  - POST `/api/users`

### `/gamenights/:id`
- **Description:** Gamnight detail page — shows title, description, host, game info, location, time, RSVPs, comments
- **Components:**
  - GameNightDetail
  - RSVPList
  - CommentList
  - CommentForm (if logged in)
- **State Needed:**
  - single gamenight object
  - comments list
  - RSVP list
- **API Calls:**
  - GET `/api/gamenights/:id`
  - GET `/api/gamenights/:id/comments`
  - GET `/api/gamenights/:id/players`

---

## Private Pages (Login Required)

### `/gamenights/new`
- **Description:** Form to create a new gamenight
- **Components:**
  - GameNightForm
- **State Needed:** games list (to select from)
- **API Calls:**
  - POST `/api/gamenights`
  - GET `/api/games`

### `/gamenights/:id/edit`
- **Description:** Form to edit a gamenight (host only)
- **Components:**
  - GameNightForm
- **State Needed:** single gamenight object
- **API Calls:**
  - PUT `/api/gamenights/:id`
  - GET `/api/games`

### `/games`
- **Description:** List of games in system
- **Components:**
  - GameList
- **State Needed:** games list
- **API Calls:**
  - GET `/api/games`

### `/games/new`
- **Description:** Form to add a new game
- **Components:**
  - GameForm
- **State Needed:** none
- **API Calls:**
  - POST `/api/games`

### `/games/:id/edit`
- **Description:** Edit a game (admin/creator only)
- **Components:**
  - GameForm
- **State Needed:** single game object
- **API Calls:**
  - PUT `/api/games/:id`

---

## Authenticated User Actions (No Full Page Route)

- RSVP to a gamenight:
  - Triggered from GameNightDetail
  - POST `/api/gamenights/:id/players`
- Update RSVP:
  - PUT `/api/gamenights/:id/players/:player_id`
- Cancel RSVP:
  - DELETE `/api/gamenights/:id/players/:player_id`
- Add comment:
  - POST `/api/gamenights/:id/comments`
- Edit comment:
  - PUT `/api/comments/:id`
- Delete comment:
  - DELETE `/api/comments/:id`
