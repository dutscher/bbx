import fetch from 'node-fetch';
import states from '../data/states.json' assert { type: 'json' };

const productId = 105435;

const json = await fetch(`https://api.bbx.watch/bapi/product/detail/${productId}`).then(res => res.json());

const actualState = json.status;
const lastChanges = json.lastChanges;
const history = {};

lastChanges.map(change => {
  const date = new Date(change.datetime);
  // INITIAL_FULLDATA, INITIAL
  const state = change.status.includes('INITIAL') ? actualState : change.status;
  history[date.getTime() / 1000] = states.api.indexOf(state);
});

console.log(JSON.stringify({ [productId]: history }, null, 2));
