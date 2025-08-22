State Tree Structure

{
  session: {
    user: {
      id: Number,
      username: String,
      email: String
    } | null
  },

  users: {
    [userId]: {
      id: Number,
      username: String,
      email: String
    }
  },

  gameNights: {
    [gameNightId]: {
      id: Number,
      hostId: Number,
      title: String,
      gameId: Number,
      description: String,
      locationName: String,
      locationDetails: String,
      startTime: String,  // ISO timestamp
      endTime: String,    // ISO timestamp
      maxPlayers: Number,
      attendees: [userId],
      comments: [commentId],
      createdAt: String,  // ISO timestamp
      updatedAt: String   // ISO timestamp
    }
  },

  games: {
    [gameId]: {
      id: Number,
      name: String,
      description: String,
      minPlayers: Number,
      maxPlayers: Number,
      createdAt: String,  // ISO timestamp
      updatedAt: String   // ISO timestamp
    }
  },

  rsvps: {
    [rsvpId]: {
      id: Number,
      userId: Number,
      gameNightId: Number,
      status: 'going' | 'maybe' | 'not_going',
      createdAt: String,
      updatedAt: String
    }
  },

  comments: {
    [commentId]: {
      id: Number,
      userId: Number,
      gameNightId: Number,
      content: String,
      createdAt: String,
      updatedAt: String
    }
  },

  ui: {
    modalType: null | 'login' | 'signup' | 'createGameNight' | 'editGameNight' | 'createComment' | 'editComment',
    loading: Boolean,
    errors: null | { [field: string]: string }
  }
}
