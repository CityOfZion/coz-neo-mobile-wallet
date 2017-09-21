import * as neon from 'neon-js';

// Constants
const NEW_WALLET = 'NEW_WALLET';
const IMPORT_WALLET = 'IMPORT_WALLET';
const RESET_WALLET = 'RESET_WALLET';

// Actions
export function newWallet() {
  return {
    type: NEW_WALLET,
  }
}

export function importWallet(wif) {
  return {
    type: IMPORT_WALLET,
    wif: wif
  }
}

export function resetWallet() {
  return {
    type: RESET_WALLET
  }
}

// Reducer used for state necessary to generating a wallet
export default (state = {wif: null, address: null}, action) => {
  switch (action.type) {
    case NEW_WALLET:
      const newPrivateKey = neon.generatePrivateKey();
      const newWif = neon.getWIFFromPrivateKey(newPrivateKey);
      return {...state, wif: newWif, address: neon.getAccountsFromWIFKey(newWif)[0].address};
    case IMPORT_WALLET:
      if(!neon.getAccountsFromWIFKey(action.wif)[0]) return {...state, wif: false, address: false};
      return {...state, wif: action.wif, address: neon.getAccountsFromWIFKey(action.wif)[0].address};
    case RESET_WALLET:
      return {...state, wif: false, address: false};
    default:
      return state;
  }
};