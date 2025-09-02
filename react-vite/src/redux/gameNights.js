// Action Types
const SET_GAMENIGHTS = "gameNights/setGameNights";
const ADD_GAMENIGHT = "gameNights/addGameNight";
const UPDATE_GAMENIGHT = "gameNights/updateGameNight";
const REMOVE_GAMENIGHT = "gameNights/removeGameNight";

// Action Creators
const setGameNights = (gameNights) => ({
  type: SET_GAMENIGHTS,
  payload: gameNights
});

const addGameNight = (gameNight) => ({
  type: ADD_GAMENIGHT,
  payload: gameNight
});

const updateGameNight = (gameNight) => ({
  type: UPDATE_GAMENIGHT,
  payload: gameNight
});

const removeGameNight = (gameNightId) => ({
  type: REMOVE_GAMENIGHT,
  payload: gameNightId
});

// Thunks
export const thunkFetchGameNights = () => async (dispatch) => {
  const res = await fetch("/api/gameNights");
  if (res.ok) {
    const data = await res.json(); 
    const gameNightsObj = {};
    data.forEach(gn => { gameNightsObj[gn.id] = gn });
    dispatch(setGameNights(gameNightsObj));
  }
};

export const thunkCreateGameNight = (gameNight) => async (dispatch) => {
  const res = await fetch("/api/gameNights", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(gameNight)
  });

  if (res.ok) {
    const newGameNight = await res.json();
    dispatch(addGameNight(newGameNight));
    return newGameNight;
  }
};

export const thunkEditGameNight = (gameNight) => async (dispatch) => {
  const res = await fetch(`/api/gameNights/${gameNight.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(gameNight)
  });

  if (res.ok) {
    const updated = await res.json();
    dispatch(updateGameNight(updated));
    return updated;
  }
};

export const thunkDeleteGameNight = (id) => async (dispatch) => {
  const res = await fetch(`/api/gameNights/${id}`, {
    method: "DELETE"
  });

  if (res.ok) {
    dispatch(removeGameNight(id));
  }
};

// Initial State
const initialState = {};

// Reducer
export default function gameNightsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_GAMENIGHTS:
      return { ...action.payload };
    case ADD_GAMENIGHT:
    case UPDATE_GAMENIGHT:
      return { ...state, [action.payload.id]: action.payload };
    case REMOVE_GAMENIGHT: {
    const newState = { ...state };
    delete newState[action.payload];
    return newState;
  }
    default:
      return state;
  }
}
