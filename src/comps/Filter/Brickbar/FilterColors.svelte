<script lang="ts">
  import { storedColors, storedProducts, storedFilteredProducts } from '@stores';
  import { onMount, getUrlParam, titleMatch, ess } from '@utils';
  import { clickItem } from './click-item';

  export let colors: any;
  export let products: any;
  export let filteredProducts: any = [];
  export let activeColorIds: any = [];

  let sortedItems: any = [];
  const urlParam = 'colors';

  storedColors.subscribe(store => (colors = store));
  storedProducts.subscribe(store => (products = store));
  storedFilteredProducts.subscribe(store => (filteredProducts = store));

  const getUrlParams = () => {
    // ?tags=piraten
    const queryTags = getUrlParam(urlParam).split(',');
    colors.map(color => {
      queryTags.map(queryTag => {
        if (color.seoName === queryTag) {
          clickItem(urlParam, colors, color);
        }
      });
    });
  };

  const sortItems = filteredProducts => {
    let sortedData = [];
    // get count of products
    sortedData = colors
      .map(color => {
        const filtered = (
          filteredProducts && filteredProducts.withFilter.length > 0 ? filteredProducts.withFilter : products
        )
          // is a part
          .filter(product => product.tags.includes(48))
          .filter(product => titleMatch(color, product) > 0);

        color.countFiltered = filtered.length;

        color.count = products
          // is a part
          .filter(product => product.tags.includes(48))
          .filter(product => titleMatch(color, product) > 0).length;

        if (color.countFiltered === 1) {
          //console.log(filtered, color)
        }

        return color;
      })
      .filter(color => color.count > 0)
      // sort alphabet
      .sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      })
      // sort color type
      .sort((a, b) => {
        const cleanName = name =>
          name
            .toLowerCase()
            .replace('white', 'black1')
            .replace('trans clear', 'black1')
            .replace('dark bluish gray', 'black1')
            .replace('light bluish gray', 'black1')
            .replace('lavender', 'purple1')
            .replace('azure', 'blue1')
            .replace('lime', 'green1')
            .replace('magenta', 'red1')
            .replace('flesh', 'red2')
            .replace('brown', 'red3')
            .replace('sand ', '')
            .replace('bright ', '')
            .replace('dark ', '')
            .replace('light ', '')
            .replace('trans ', '')
            .replace('neon ', '')
            .replace('medium ', '')
            .replace('yellowish ', '')
            .replace('reddish ', '')
            .replace('olive ', '')
            .replace('flat silver', 'zzz')
            .replace('pearl gold', 'zzz')
            .replace('pearl gray', 'zzz')
            .replace('chrome silver', 'zzz');
        const clearAName = cleanName(a.name);
        const clearBName = cleanName(b.name);
        if (clearAName < clearBName) {
          return -1;
        }
        if (clearAName > clearBName) {
          return 1;
        }
        return 0;
      });
    return sortedData;
  };

  $: sortedItems = sortItems(filteredProducts);

  onMount(() => {
    getUrlParams();
  });
</script>

<div class="flex">
  <strong class="label">Farben</strong>
  <div class="flex flex--wrap">
    {#each sortedItems as color (color.id)}
      <div
        class={ess(
          'color',
          activeColorIds.includes(color.id) && 'active',
          color.id === '22' && 'chrome',
          color.id === '77' && 'pearl-gray',
          color.id === '115' && 'pearl-gold',
          color.countFiltered === 0 && 'disabled',
          color.name.toLowerCase().includes('trans') && 'trans'
        )}
        data-id={color.id}
        on:click={() => clickItem(urlParam, colors, color, true)}
        title="{color.name}{color.de ? ' / ' + color.de : ''}"
      >
        <div class="dot" style="background-color:#{color.hex}" />
        <span class="badge round">{color.countFiltered}</span>
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .label {
    width: 64rem;
  }

  .color {
    margin: 2rem;
    border: solid 1rem var(--secondary);
    cursor: pointer;
    background-size: contain;
    border-radius: 100%;

    .dot {
      padding: 16rem;
      border-radius: inherit;
    }

    &.active {
      border-color: var(--error);

      &::after {
        position: absolute;
        display: block;
        content: '';
        padding: 12rem;
        background: var(--secondary);
        transform: translate(-50%, -50%);
        z-index: -1;
        border-radius: inherit;
      }
    }

    &.chrome .dot {
      background-image: url('../images/color-chrome.jpg');
    }

    &.pearl-gray .dot {
      background-image: url('../images/color-pearl-gray.jpg');
    }

    &.pearl-gold .dot {
      background-image: url('../images/color-pearl-gold.jpg');
    }

    &.trans .dot {
      opacity: 0.5;

      &.active {
        opacity: 1;
      }
    }

    &.disabled {
      pointer-events: none;
      opacity: 0.1;
    }

    .badge {
      display: none;
    }

    &.active,
    &:active,
    &:hover {
      .badge {
        display: inline-flex;
      }
    }
  }
</style>
