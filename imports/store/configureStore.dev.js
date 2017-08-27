import { createStore } from 'redux';
import rootReducer from './reducers';
import DevTools from '/imports/ui/containers/DevTools';

export default function configureStore(initialState) {
    const store = createStore(
        rootReducer,
        initialState,
        DevTools.instrument()
    );

    return store;
}
