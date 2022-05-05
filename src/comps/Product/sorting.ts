export const sorter = ['Teile:parts', 'Preise:price', 'PreisProTeil:pricePerPart', 'ABC:title']; // , '1111:parts'

export const handleProductSort = (unsorted, sorting) => {
  let sorted = [];
  // default sort
  if (sorting.sortType === '') {
    // sort unit 01-17
    sorted = unsorted
      .sort((a, b) => {
        if (a.title < b.title) {
          return -1;
        }
        if (a.title > b.title) {
          return 1;
        }
        return 0;
      })
      // sort state
      .sort((a, b) => {
        if (a.state.id < b.state.id) {
          return -1;
        }
        if (a.state.id > b.state.id) {
          return 1;
        }
        return 0;
      });
  }

  if (!!sorting.sortType) {
    if (sorting.sortTitle === '1111') {
      sorted = unsorted.filter(product => product.parts <= 1111);
    }

    // sort by
    // asc > aufsteigend 123
    // desc < absteigend 321
    const isZfirstASC = sorting.sortDirection === 'asc'; // ABC > Z
    const isAfirstDESC = sorting.sortDirection === 'desc'; /// ABC < A

    sorted = unsorted.sort((a, b) => {
      let prev = a[sorting.sortType];
      let next = b[sorting.sortType];

      if (sorting.sortType === 'title') {
        prev = prev.toLowerCase();
        next = next.toLowerCase();
      }

      if (isZfirstASC) {
        return prev > next ? -1 : prev < next ? 1 : 0;
      }

      if (isAfirstDESC) {
        return prev < next ? -1 : prev > next ? 1 : 0;
      }
    });
  }

  return sorted;
};

export const exportCSV = filteredProducts => {
  const divider = ';';
  let exportString =
    ['ID', 'Hersteller', 'Artikelnummer', 'Artikelbezeichnung', 'Farbe', 'Menge', 'Preis'].join(divider) + '\n';
  /*
  ID: 607425
  Hersteller NR: BPP3943b-black
  Artikelnummer: 3943b
  Artikelbezeichng: ROCKET STEP 4X4X2 X 15
  Farbe: Black
  Menge (VPE?): 15
  Preis: 5,95 €
*/
  filteredProducts.raw
    //.reverse()
    //.slice(0, 50)
    .map(product => {
      const newLine = [
        product.id,
        '',
        product.partNr,
        product.title,
        product.partColor ? product.partColor.name : '',
        product.parts,
        product.price,
      ];
      exportString += newLine.join(divider) + '\n';
    });
  console.log(exportString);
};
