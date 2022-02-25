<script lang="ts">
  import { jsVoid } from '../../utils';
  import { storedProductsSorting } from '../../stores';
  import { ID_PARTS } from '../../_interfaces';

  export let filteredProducts: any = [];
  export let activeTagIds: any = [];

  const sorter = ['Teile:parts', 'Preise:price', 'PreisProTeil:pricePerPart', 'ABC:title', '1111:parts'];
  let sorting: string = '';
  let sortTitle: string = '';
  let sortDirection: string = 'desc';

  const exportCSV = () => {
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

  const clickSort = sortRaw => {
    const [potentialSortTitle, type] = sortRaw.split(':');
    const isDifferentSort = type !== sorting;
    const doReset = sortDirection === 'desc';
    sorting = doReset && !isDifferentSort ? '' : type;
    sortTitle = doReset && !isDifferentSort ? '' : potentialSortTitle;
    sortDirection = doReset || isDifferentSort ? 'asc' : 'desc';
    storedProductsSorting.set({
      sorting,
      sortTitle,
      sortDirection,
    });
  };
</script>

{#if filteredProducts.withFilter.length > 0}
  <div class="flex flex--gap flex--inline flex--vertical-center flex--wrap filter">
    <b>Sortieren:</b>
    {#each sorter as item}
      <a href={jsVoid} class="link" on:click={() => clickSort(item)}>
        {item.split(':')[0]}
        {#if sorting === item.split(':')[1]}
          {sortDirection === 'asc' ? '>' : '<'}
        {/if}
      </a>
    {/each}

    {#if activeTagIds.includes(ID_PARTS)}
      <b>&nbsp;| CSV export:</b>
      <a href={jsVoid} class="link" on:click={() => exportCSV()}>Do IT</a>
    {/if}
    <br />
    <br />
  </div>
{/if}

<style lang="scss">
  @import '../../scss/variables';

  $selector: '.filter';
  #{$selector} {
    font-size: ms(-1);
    cursor: default;
  }
</style>
