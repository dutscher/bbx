import fetch from 'node-fetch';
import cheerio from 'cheerio';
import { handleCache, getCleanText } from './src/utils.js';
/*
https://www.bluebrixx.com/de/ajax_add_sparParts.php POST
  - {
    set_itemno: 102035
    mode: addSparParts
    orderNo: 300747484
  }
*/
const fetchUrl = 'https://www.bluebrixx.com/de/ajax_add_sparParts.php';
const cacheDir = `./data/partlist/`;
const products = [102035, 101999, 102497, 103406, 102818, 104185, 104953];
let fileData = {};

await Promise.all(
  products.map(async productID => {
    const params = new URLSearchParams();
    params.append('set_itemno', '' + productID);
    params.append('mode', 'addSparParts');
    //params.append('orderNo', '' + 300747484);

    //console.log({ formData });

    const cache = await handleCache(
      `${cacheDir}`,
      `${productID}.html`,
      async () =>
        await fetch(fetchUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
          body: params,
        }).then(async res => {
          //console.log({ status: res.status, headers: res.headers });
          const text = await res.text();
          //console.log({ text });
          return text;
        }),
      false
    );
    //console.log({ cache });
    const $ = cheerio.load(cache);

    // Art.-Nr. / Form-Nr / Bricklink Farbe / Beschreibung / Anzahl pro Set
    const items = $('table.inst tbody tr');
    fileData[productID] = {};
    items.map((index, item) => {
      const thumb = $(item)
        .find('td img')
        .attr('src')
        .replace('https://www.bluebrixx.com/img/items/', '')
        .replace(/\?t=.*/, '');
      const id = parseInt(getCleanText($(item).find('td:nth-child(2)').text()));
      const partNcolor = $(item).find('td:nth-child(3)').html().split('<br>');
      const nameNcat = $(item).find('td:nth-child(4)').html().split('<br>');
      const amount = parseInt(getCleanText($(item).find('td:nth-child(5)').text()));
      //data[productID][id] = {
      fileData[productID][id] = {
        thumb,
        name: getCleanText($(nameNcat[0]).text()),
        //cat: getCleanText(nameNcat[1]),
        partNr: parseInt(getCleanText(partNcolor[0])),
        color: getCleanText(partNcolor[1]),
        amount,
      };
    });
  })
);

await handleCache('./public/data/', 'partlist.json', () => JSON.stringify(fileData, null), true);
