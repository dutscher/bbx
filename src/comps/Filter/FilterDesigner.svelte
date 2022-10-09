<script lang="ts">
  import { storedActiveSelection, storedProducts, storedFilteredProducts, storedDesigner } from '@stores';
  import { onMount, getUrlParam, setUrlParams, ess } from '@utils';

  export let activeDesignerIds: any = [];

  let sortedItems: any = [];
  let filteredProducts: any = [];
  let designer: any;
  let products: any;

  const urlParam = 'designer';
  const getUrlParams = () => {
    // ?tags=piraten
    const queryTags = getUrlParam(urlParam).split(',');
    designer.map(designer => {
      queryTags.map(queryTag => {
        if (designer.url === queryTag) {
          clickItem(designer);
        }
      });
    });
  };

  const clickItem = (item, withUrlUpdate?) => {
    if (item.count === 0) return;

    storedActiveSelection.update(store => {
      if (!(urlParam in store)) {
        store[urlParam] = [];
      }
      if (!store[urlParam].includes(item.url)) {
        store[urlParam].push(item.url);
      } else {
        store[urlParam] = store[urlParam].filter(itemUrl => itemUrl !== item.url);
      }

      if (withUrlUpdate) {
        setUrlParams(
          urlParam,
          designer.filter(item => store[urlParam].includes(item.url)).map(item => item.url)
        );
        store.reason = 'designer-clicked';
      } else {
        store.reason = 'url-parsed--designer';
      }

      return store;
    });
  };

  storedDesigner.subscribe(store => (designer = store));
  storedProducts.subscribe(store => (products = store));
  storedFilteredProducts.subscribe(store => (filteredProducts = store));

  const sortItems = filteredProducts => {
    let sortedData = [];
    // get count of products
    sortedData = designer
      .map(designer => {
        designer.count = (
          filteredProducts.raw && filteredProducts.raw.length > 0 ? filteredProducts.raw : products
        ).filter(product => {
          if (Number.isInteger(product.designerId) && product.designerId > -1) {
            return product.designerId === designer.id;
          } else {
            return false;
          }
        }).length;
        return designer;
      })
      // sort state
      .sort((a, b) => {
        if (a.count > b.count) {
          return -1;
        }
        if (a.count < b.count) {
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

<div class="items flex flex--gap flex--wrap">
  <div class={ess('chip small round no-margin white-text indigo5')}>Designer:</div>
  {#each sortedItems as designer (designer.id)}
    <div
      class={ess(
        'chip small round no-margin white-text',
        activeDesignerIds.includes(designer.url) && 'indigo5',
        designer.count === 0 && 'disabled'
      )}
      data-count={designer.count}
      on:click={() => clickItem(designer, true)}
    >
      <p>{designer.name}</p>
      <span class="chip__state">{designer.count}</span>
    </div>
  {/each}
</div>

<style lang="scss">
  .items {
    margin: 8rem 0;
  }

  .chip {
    cursor: pointer;
    user-select: none;

    &.disabled {
      opacity: 0.2;
      cursor: default;
    }
  }
</style>
