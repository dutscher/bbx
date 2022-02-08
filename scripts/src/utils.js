import moment from 'moment';
import chalk from 'chalk';
import sanitizeHtml from 'sanitize-html';
import fetch from 'node-fetch';
import fs from 'fs-extra';
import tags from '../../data/tags.json';
import partTags from '../../data/parts.json';
import categories from '../../data/categories.json';
import movienamesJSON from '../../data/movie-names.json';
import { IDs } from './interfaces.js';

export const graphql = async query => {
  return await fetch('https://api.bbx.watch/api/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // query GetLearnWithJasonEpisodes($now: DateTime!) {
    // allEpisode(limit: 10, sort: {date: ASC}, where: {date: {gte: $now}}) {
    body: JSON.stringify({
      query,
    }),
  })
    .then(res => res.json())
    .then(res => res.data);
};

export const reverseObject = object => {
  const newObject = {};
  const keys = [];

  for (const key in object) {
    keys.push(key);
  }

  for (let i = keys.length - 1; i >= 0; i--) {
    const value = object[keys[i]];
    newObject[keys[i]] = value;
  }

  return newObject;
};

export const handleCache = async (dirName, fileName, contentFnc, forceWrite) => {
  const filePath = `${dirName}${fileName}`.replace('?', 'QUEST');
  let content = '';
  fs.ensureDirSync(dirName);
  if (!fs.pathExistsSync(filePath) || forceWrite) {
    console.log(chalk.yellow('write into cache:', filePath));
    content = await contentFnc();
    fs.writeFileSync(filePath, content, 'utf-8');
  } else {
    //console.log(chalk.yellow('read cache:', filePath))
    content = fs.readFileSync(filePath, 'utf-8');
  }
  return content;
};

export const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const mergeArrays = (...arrays) => {
  let jointArray = [];

  arrays.forEach(array => {
    jointArray = [...jointArray, ...(array || [])];
  });
  const uniqueArray = jointArray.reduce((newArray, item) => {
    if (newArray.includes(item)) {
      return newArray;
    } else {
      return [...newArray, item];
    }
  }, []);
  return uniqueArray;
};

export const getTextOfElement = element => {
  return getCleanText(sanitizeHtml(element.textContent));
};

export const getCleanText = text => {
  return text
    .replace(/[\r\n\t]+/gm, '')
    .trim()
    .replace('  ', ' ')
    .replace('&amp;', '&');
};

// pageUrls = https://www.bluebrixx.com/de/bluebrixxspecials/military_models = [bluebrixxspecials,military_models]
export const getTags = (pageUrls, title, cat, href, productId) => {
  const found = [];

  if (false && productId === 101867) {
    console.log('debug getTags', pageUrls, title, cat, href, productId);
  }

  const umlauts = { ue: 'ü', oe: 'ö', ae: 'ä' };
  const checkAdd = (tagID, string, match, ignoreArray) => {
    // tagID: 0
    // string: "Lokschuppen"
    // match: "lok"
    const stringFormatted = string.toLowerCase();
    const matchFormatted = match.toLowerCase();
    let shouldIgnore = false;
    ignoreArray.map(ignore => {
      // console.log(tagName, string.toLowerCase(), i.toLowerCase(), string.toLowerCase().includes(i.toLowerCase()))
      if (stringFormatted.includes(ignore.toLowerCase())) {
        shouldIgnore = stringFormatted.includes(ignore.toLowerCase());
      }
    });
    //   [
    //     "Lok",
    //     "Zug",
    //     [
    //       "Schuppen"
    //     ]
    //   ],
    const shouldAddTag =
      // tag isnt a ignored one
      shouldIgnore === false &&
      // match shouldnt include in the string
      stringFormatted.includes(matchFormatted) &&
      // found should not have them twice
      !found.includes(tagID);

    if (false && stringFormatted.includes('t-rex') && matchFormatted.includes('pflanzen')) {
      console.log(
        'stringFormatted:',
        stringFormatted,
        'shouldAddTag:',
        shouldAddTag,
        'match:',
        matchFormatted,
        'tagID:',
        tagID,
        'ignore:',
        ignoreArray,
        shouldIgnore
      );
    }
    return shouldAddTag;
  };

  tags.map((tag, id) => {
    let innerTag = tag;
    let tagName = '';
    let tagID = id;
    let matches = [];
    let ignore = [];
    // PREPARE TAGS
    // tag multi: [ "THW", "Hilfswerk" ],
    // tag ignore: [ "Lok", "Zug", [ "Schuppen" ] ]
    if (Array.isArray(tag)) {
      // duplicate tag because of pop()
      innerTag = [...tag];
      tagName = innerTag[0];
      // add ignore if last is an array
      const lastElement = innerTag[innerTag.length - 1];
      if (Array.isArray(lastElement)) {
        ignore = lastElement.map(char => char.toLowerCase());
        // add new url shizzle whitespace to dash
        // "Leuchtturm des Astronomen" -> "Leuchtturm-des-Astronomen"
        ignore.map(i => {
          if (i.includes(' ')) {
            ignore.push(i.replace(/ /g, '-'));
          }
        });
        innerTag.pop();
      }
      matches = [...innerTag].map(char => char.toLowerCase());
    } else {
      // "Manhattan",
      tagName = innerTag;
      matches = [innerTag.toLowerCase()];
    }

    // find tags
    // tagName: Lok
    // matches: [ 'lok', 'zug' ]
    // ignore: [ 'schuppen' ]
    if (!!tagName) {
      // url: https://www.bluebrixx.com/de/bluebrixxspecials/military_models
      // pageUrls: [bluebrixxspecials, military_models]
      // title: "Burg Blaustein"
      // cat: "BlueBrixx-Pro"
      // matches: [ 'lok', 'zug' ]
      matches.map(match => {
        // TODO: refactore?
        // .replace('bluebrixxspecials', '') ?
        pageUrls.map(pageUrl => {
          if (checkAdd(tagID, pageUrl, match + title, ignore)) {
            found.push(tagID);
          }
        });

        if (checkAdd(tagID, title, match, ignore)) {
          found.push(tagID);
        }

        if (checkAdd(tagID, cat, match, ignore)) {
          found.push(tagID);
        }
        // /de/bluebrixxspecials/104119/Reichstag-Berlin-BlueBrixx-Pro === kein special
        let cleanHref = href.replace('bluebrixxspecials', '');
        Object.entries(umlauts).map(umlaut => {
          cleanHref = cleanHref.replace(umlaut[0], umlaut[1]);
        });
        if (checkAdd(tagID, cleanHref, match, ignore)) {
          found.push(tagID);
        }
      });
    }
  });

  // add movie tag
  if (productId in movienamesJSON) {
    found.push(IDs.ID_TAG_MOVIE_MODELLS);
  }

  if (false && productId === 101867) {
    console.log('debug getTags result', found, pageUrls, title, cat, href);
  }

  return found.sort(sortTags);
};

export const sortTags = (a, b) => a - b;

// pageUrls = https://www.bluebrixx.com/de/part-packs/bars_ladders_and_fences = [part-packs, bars_ladders_and_fences]
// title = 1X2 PLATE WITH 3 TEETH X 100, Reddish Brown
// productId = 605358
export const getPartTags = (pageUrls, title, productId) => {
  const found = [];
  const partTag = pageUrls[pageUrls.length - 1];
  const partCats = ['chrome-packs', 'assortments', 'part-packs'];
  if (pageUrls.some(urlPart => partCats.includes(urlPart))) {
    /*[
            "Bars, Ladders and Fences",
            "Stangen, Leiter und Zäune",
            "bars_ladders_and_fences"
        ]*/
    partTags.map((tag, tagId) => {
      if (tag[2] && tag[2] === partTag) {
        found.push(tagId);
      }
    });
  }
  if (false && productId === 606490) {
    // 606469
    console.log('getPartTags', { productId, found, pageUrls, partTag });
  }
  return found.sort(sortTags);
};

export const getCats = (url, cat) => {
  const found = [];

  if (categories.indexOf(cat) !== -1) {
    found.push(categories.indexOf(cat));
  }

  if (url.includes('chrome')) {
    found.push(categories.indexOf('BlueBrixx Chrome Parts'));
  }

  if (url.includes('part-packs')) {
    found.push(categories.indexOf('BlueBrixx Part Packs'));
  }

  if (url.includes('Bundeswehr')) {
    found.push(categories.indexOf('BlueBrixx-Pro'));
  }

  return found;
};

export const printTime = (msg, startDate) => {
  console.log(chalk.grey(msg + ':', moment(moment(new Date())).diff(startDate, 'milliseconds') + 'ms'));
  // reset new
  startDate = moment(new Date());
  return startDate;
};
let debugCount = 1;
export const debug = (...args) => {
  console.log(chalk.red(JSON.stringify(args)));
  debugCount++;
};
