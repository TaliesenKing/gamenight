// Action Types
const SET_GAMES = "games/setGames";
const ADD_GAME = "games/addGame";

// Action Creators
const setGames = (games) => ({
  type: SET_GAMES,
  payload: games
});

const addGame = (game) => ({
  type: ADD_GAME,
  payload: game
});

// Thunks
export const thunkFetchGames = () => async (dispatch) => {
  const res = await fetch("/api/games");
  if (res.ok) {
    const data = await res.json();
    // Normalize: { [id]: game }
    const gamesObj = {};
    data.forEach(game => { gamesObj[game.id] = game });
    dispatch(setGames(gamesObj));
  }
};

export const thunkCreateGame = (game) => async (dispatch) => {
  const res = await fetch("/api/games", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(game)
  });

  if (res.ok) {
    const newGame = await res.json();
    dispatch(addGame(newGame));
    return newGame;
  }
};

// Initial State
const initialState = {};

// Reducer
export default function gamesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_GAMES:
      return { ...action.payload };
    case ADD_GAME:
      return { ...state, [action.payload.id]: action.payload };
    default:
      return state;
  }
}
