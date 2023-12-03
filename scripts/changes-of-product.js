import states from '../data/states.json' assert { type: 'json' };
import prompts from 'prompts';

const response = await prompts({
  type: 'number',
  name: 'productId',
  message: 'Gebe eine ProduktID ein? (Bsp.: 102870)',
});
if (!!response.productId && response.productId.toString().length === 6) {
  const apiUrl = `https://api.bbx.watch/bapi/product/detail/${response.productId}`;
  console.log({ apiUrl });
  const json = await fetch(apiUrl).then(res => res.json());

  const actualState = json.status;
  const lastChanges = json.lastChanges;
  const history = {};

  console.log(json);

  lastChanges.map(change => {
    const date = new Date(change.datetime);
    // INITIAL_FULLDATA, INITIAL
    const state = change.status.includes('INITIAL') ? actualState : change.status;
    history[date.getTime() / 1000] = states.api.indexOf(state);
  });

  console.log(JSON.stringify({ [response.productId]: history }, null, 2));
}
