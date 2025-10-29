// Action Types
const SET_RELATIONSHIPS = "relationships/setRelationships";
const ADD_RELATIONSHIP = "relationships/addRelationship";
const UPDATE_RELATIONSHIP = "relationships/updateRelationship";
const REMOVE_RELATIONSHIP = "relationships/removeRelationship";

// Action Creators
const setRelationships = (relationships) => ({
  type: SET_RELATIONSHIPS,
  payload: relationships
});

const addRelationship = (relationship) => ({
  type: ADD_RELATIONSHIP,
  payload: relationship
});

const updateRelationship = (relationship) => ({
  type: UPDATE_RELATIONSHIP,
  payload: relationship
});

const removeRelationship = (relationshipId) => ({
  type: REMOVE_RELATIONSHIP,
  payload: relationshipId
});

// Thunks
export const thunkFetchRelationships = () => async (dispatch) => {
  const res = await fetch("/api/relationships");
  if (res.ok) {
    const data = await res.json();
    const relationshipsObj = {};
    data.forEach(rel => { relationshipsObj[rel.id] = rel });
    dispatch(setRelationships(relationshipsObj));
  }
};export const thunkCreateRelationship = (relationship) => async (dispatch) => {
  const res = await fetch("/api/relationships", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(relationship)
  });

  if (res.ok) {
    const newRelationship = await res.json();
    dispatch(addRelationship(newRelationship));
    return newRelationship;
  }
};

export const thunkEditRelationship = (relationship) => async (dispatch) => {
  const res = await fetch(`/api/relationships/${relationship.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(relationship)
  });

  if (res.ok) {
    const updated = await res.json();
    dispatch(updateRelationship(updated));
    return updated;
  }
};

export const thunkDeleteRelationship = (id) => async (dispatch) => {
  const res = await fetch(`/api/relationships/${id}`, {
    method: "DELETE"
  });

  if (res.ok) {
    dispatch(removeRelationship(id));
  }
};

// Initial State
const initialState = {};

// Reducer
export default function relationshipsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_RELATIONSHIPS:
      return { ...action.payload };
    case ADD_RELATIONSHIP:
    case UPDATE_RELATIONSHIP:
      return { ...state, [action.payload.id]: action.payload };
    case REMOVE_RELATIONSHIP: {
    const newState = { ...state };
    delete newState[action.payload];
    return newState;
  }
    default:
      return state;
  }
}
