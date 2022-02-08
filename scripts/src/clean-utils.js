export const pad = str => (str + '').padStart(2, '00');

// 2021-08-26T05:41:14+00:00
// 26.08.2021 07:41 = GMT+2
export const getHRDate = dateStr => {
  const now = !!dateStr ? new Date(dateStr) : new Date();
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hour = pad(now.getHours());
  const minute = pad(now.getMinutes());
  return `${day}.${month}.${year} ${hour}:${minute}`;
};

export const isDST = d => {
  let jan = new Date(d.getFullYear(), 0, 1).getTimezoneOffset();
  let jul = new Date(d.getFullYear(), 6, 1).getTimezoneOffset();
  return Math.max(jan, jul) !== d.getTimezoneOffset();
};

// 26.08.2021 07:41
// 2021-08-26T07:41:00+02:00
export const getDateTime = hrDate => {
  const isSummertime = isDST(new Date());
  const date = hrDate.split(' ');
  const dmy = date[0].split('.');
  return `${dmy[2]}-${dmy[1]}-${dmy[0]}T${date[1] || '00:00'}:00+0${!isSummertime ? 2 : 1}:00`;
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

export const mergeTags = (existingTags, newTags, additionalTags) => {
  return mergeArrays(existingTags, newTags, additionalTags || []).sort(sortTags);
};

export const sortTags = (a, b) => a - b;

export const cleanUpHistoryChange = product => {
  // sort timestamps
  const sortObject = o =>
    Object.keys(o)
      .sort()
      .reduce((r, k) => ((r[k] = o[k]), r), {});
  product.history = sortObject(product.history);

  // clean up double states
  let lastState = -1;
  let newHistory = {};
  for (const [timestamp, state] of Object.entries(product.history)) {
    if (lastState !== state) {
      lastState = state;
      newHistory[timestamp] = state;
    }
  }
  product.history = newHistory;
};
