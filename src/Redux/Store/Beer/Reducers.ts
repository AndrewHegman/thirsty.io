import { actionTypes, BeerActionTypes, BeerState } from "./Types";
import { BeerDocument, BreweryDocument, NewBeer, StyleDocument } from "../../../Interfaces";

const initialNewBeerState: NewBeer = {
  name: "",
  brewery: {} as BreweryDocument,
  style: {} as StyleDocument,
  quantity: 0,
};

const initialState: BeerState = {
  inventory: [],
  isLoading: false,
};

export const beerReducer = (state = initialState, action: BeerActionTypes): BeerState => {
  switch (action.type) {
    case actionTypes.SET_NEW_BEER_NAME:
      return {
        ...state,
        newBeer: {
          ...initialNewBeerState,
          ...state.newBeer,
          name: action.name,
        },
      };
    case actionTypes.SET_NEW_BEER_BREWERY:
      return {
        ...state,
        newBeer: {
          ...initialNewBeerState,
          ...state.newBeer,
          brewery: action.brewery,
        },
      };
    case actionTypes.SET_NEW_BEER_STYLE:
      return {
        ...state,
        newBeer: {
          ...initialNewBeerState,
          ...state.newBeer,
          style: action.style,
        },
      };
    case actionTypes.SET_NEW_BEER_QUANTITY:
      return {
        ...state,
        newBeer: {
          ...initialNewBeerState,
          ...state.newBeer,
          quantity: action.quantity,
        },
      };

    case actionTypes.WAIT_ON_BEER_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case actionTypes.FETCH_BY_ID_RECEIVED:
      return {
        ...state,
        isLoading: false,
        inventory: [...state.inventory, action.byId],
      };

    case actionTypes.FETCH_ALL_BEER_RECEIVED:
      return {
        ...state,
        isLoading: false,
        inventory: action.inventory,
      };

    case actionTypes.UPDATE_BEER_BY_ID:
      return {
        ...state,
        isLoading: false,
        inventory: [
          ...state.inventory.map((beer) => {
            if (beer._id !== action.id) {
              return beer;
            }

            return {
              ...beer,
              ...action.beer,
            };
          }),
        ],
      };

    default:
      return state;
  }
};
