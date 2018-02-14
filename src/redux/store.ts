import { createStore } from 'redux';
import { Store, State, Reducer } from "./reducers/root";

export { Store, State, Reducer };

export default createStore(Reducer);