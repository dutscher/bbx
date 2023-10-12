import states from '../data/states.json' assert { type: 'json' };

const productId = 107297;
const apiUrl = `https://api.bbx.watch/bapi/product/detail/${productId}`;

const json = await fetch(apiUrl).then(res => res.json());

const actualState = json.status;
const lastChanges = json.lastChanges;
const history = {};

lastChanges.map(change => {
  const date = new Date(change.datetime);
  // INITIAL_FULLDATA, INITIAL
  const state = change.status.includes('INITIAL') ? actualState : change.status;
  history[date.getTime() / 1000] = states.api.indexOf(state);
});

console.log(JSON.stringify({ [productId]: history, json }, null, 2));
console.log({ apiUrl });
