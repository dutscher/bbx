// Die ausgehenden Links "Zum Shop" von jedem Produkt sind mit einen Affiliate Link versehen.
// Mit einem Klick und anschließendem Kauf unterstütz du dieses Projekt.
// Wir selbst dürfen noch kein Partner von Bluebrixx sein daher bekommt temporär noppensteinnews die Provision.
// Dies ist der Fall weil ich zu Gast im Podcast über dieses Projekt sprechen durfte
//
// Ihr könnt trotzdem noch hier rüber https://www.bluebrixx.com/?aff=wrhjxrxb noppensteinnews supporten ;)
// Mir wurde es untersagt den Code hier einzubinden.
export const AFF_LINK = ''; //'?aff=wrhjxrxb';
// ID Stuff
export const ID_MANHATTAN = 17;
export const ID_NETHERLAND = 57;
export const ID_FRANKFURT = 62;
export const ID_BURG_BLAUSTEIN = 39;
export const ID_QUANTUM_COLONY = 63;
export const ID_STAR_TREK = 49;
export const STR_STAR_TREK = 'Star Trek';

export const SPECIALS_TAGS = [
  {
    id: ID_MANHATTAN,
    title: 'Manhattan',
    data: 'manhattan',
    clearTitle: (productTitle, tagTitle) => productTitle.replace(tagTitle + ' ', ''),
  },
  {
    id: ID_NETHERLAND,
    title: 'niederländische Hausfassade Amstel',
    data: 'netherland',
    clearTitle: (productTitle, tagTitle) => productTitle.replace(tagTitle + ' ', ''),
  },
  {
    id: ID_FRANKFURT,
    title: 'Frankfurter Römer Hausfassade',
    data: 'frankfurt',
    clearTitle: (productTitle, tagTitle) => productTitle.replace(tagTitle + ' ', ''),
  },
  {
    id: ID_BURG_BLAUSTEIN,
    title: 'Burg Blaustein',
    data: 'blaustein',
    clearTitle: (productTitle, tagTitle) => productTitle.replace(' für ' + tagTitle, ''),
  },
  {
    id: ID_QUANTUM_COLONY,
    title: 'Quantum Colony',
    data: 'quantum-colony',
    clearTitle: (productTitle, tagTitle) => productTitle.replace(tagTitle + ': ', ''),
  },
  {
    id: ID_STAR_TREK,
    title: STR_STAR_TREK,
    data: null,
    clearTitle: (productTitle, tagTitle) => productTitle.replace(tagTitle + ' ', ''),
  },
];

export const ID_MOVIE = 28;
export const ID_PARTS = 48;
export const ID_CAT_CHROME_PARTS = 3;
export const ID_STATE_AVAILABLE = 0;
export const ID_STATE_COMING_SOON = 1;
export const ID_STATE_UNAVAILABLE = 2;
export const ID_STATE_ANNOUNCEMENT = 3;
// highlighted in tag overview
export const IDS_SPECIAL_TAGS = [
  ID_PARTS,
  ID_MOVIE,
  // add id's
  ...SPECIALS_TAGS.filter(tag => tag.data !== null).map(tag => tag.id),
];

// api
export const API = 'https://api.bbx.watch';

// external data
export const UNLOADED = 'unloaded';
export const LOADING = 'loading';
export const LOADED = 'loaded';

export const lsSiteSettingsKey = 'siteSettings';
export const urlKeyTags = 'tags';
