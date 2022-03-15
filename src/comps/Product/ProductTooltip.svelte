<script lang="ts">
  import {
    storedGlobalData,
    storedCategories,
    storedTags,
    storedStates,
    storedActiveSelection,
    loadProductData,
  } from '../../stores';
  import { jsVoid, setUrlParams, handlePrice, ess } from '../../utils';
  import ProductHistory from './ProductHistory.svelte';
  import ProductStage from './ProductStage.svelte';
  import ProductHearts from './ProductHearts.svelte';

  export let product: any;
  export let states: any;
  export let showTooltip: boolean = true;

  let data: any;

  let categories: any;
  let tags: any;
  const spaceing: number = 32;

  let innerWidth = 0;
  let wrapElement: any;
  let wrapWidth: number;
  let isMobile: boolean = true;
  let leftAdjust: string;

  let timer;

  storedStates.subscribe(store => (states = store));
  storedGlobalData.subscribe(store => (data = store));
  storedCategories.subscribe(store => (categories = store));
  storedTags.subscribe(store => (tags = store));

  // /101/101857%20Das%20Schwarze%20Auge,%20Thowaler%20Drachenschiff,%20Otta%20(45MB).pdf
  // https://www.bluebrixx.com/data/files/manuals/103/103272%20Nimitz%20Teil%202%20(26MB).pdf
  const getInstLabel = str => {
    let strReturn = '';
    const defaultLabel = 'Download';
    const foundSize = str.match(/\((\d*MB)\)/);
    const foundPart = str.match(/Teil(%20| )(\d{1})/);
    const foundUnit = str.match(/Unit (\d{1,2})/);
    if (foundSize || foundPart || foundUnit) {
      if (foundUnit) {
        strReturn = 'Unit ' + foundUnit[1] + (foundSize ? ' - ' + foundSize[1] : '');
      } else if (foundPart) {
        strReturn = 'Teil ' + foundPart[2] + (foundSize ? ' - ' + foundSize[1] : '');
      } else {
        strReturn = foundSize[1];
      }
    } else {
      strReturn = defaultLabel;
    }
    return strReturn;
  };

  const openInstHref = pdfLink => {
    let url;
    if (pdfLink.includes('http')) {
      url = pdfLink;
    } else {
      url = data.instUrl + pdfLink;
    }
    window.open(url);
  };

  const handleLeftAdjust = (wrapElement, showTooltip) => {
    const bounds = wrapElement.getBoundingClientRect();
    const mobileWidth = 320;
    const rightEdge = Math.round(bounds.left + bounds.width);
    const rightEdgeWithSpace = rightEdge + spaceing * 2;
    let maxLeft;

    if (mobileWidth >= innerWidth) {
      isMobile = true;
      wrapWidth = innerWidth - spaceing;
      maxLeft = Math.round(bounds.left - spaceing / 2);
    } else {
      isMobile = false;
      wrapWidth = 0;
      maxLeft = Math.round(bounds.left + bounds.width - innerWidth + spaceing);
    }

    if (rightEdgeWithSpace > innerWidth) {
      leftAdjust = '-' + maxLeft + 'rem';
    } else {
      leftAdjust = '0rem';
    }
  };

  const getTagName = tagID => {
    return tags.filter(tag => tag.id === tagID).map(tag => tag.name);
  };

  const setActiveTag = tagID => {
    storedActiveSelection.update(store => {
      if (!('tags' in store)) {
        store.tags = [];
      }
      if (!store.tags.includes(tagID)) {
        store.tags.push(tagID);
        store.reason = 'tooltip-tag-clicked';
        store.page = 'products';

        setUrlParams(
          'tags',
          tags.filter(tag => store.tags.includes(tag.id)).map(tag => tag.seoName)
        );
      }
      return store;
    });
  };

  const scrollIntoView = () => {
    const { bottom, height } = wrapElement.getBoundingClientRect();
    if (bottom > window.innerHeight) {
      const header = 64;
      const newTop = window.pageYOffset + height - header;
      window.scrollTo({ top: newTop, left: 0, behavior: 'smooth' });
    }
  };

  $: {
    if (wrapElement) {
      if (showTooltip) {
        loadProductData(product);
      }
      handleLeftAdjust(wrapElement, showTooltip);
    }
  }
</script>

<svelte:window bind:innerWidth />

<div class={ess('product-tooltip absolute', showTooltip && 'open')}>
  {#if showTooltip}
    <article
      class="no-padding border round"
      bind:this={wrapElement}
      style="{isMobile ? 'width:' + wrapWidth + 'rem; ' : ''}left:{leftAdjust}"
    >
      <div class="top">
        <ProductStage
          {product}
          onLoad={() => {
            scrollIntoView();
          }}
        />
      </div>
      <div class="small-padding">
        <h5 class="no-margin">
          {#if product.title}
            <div class="tooltip__title-wrap">
              <b class="tooltip__title">
                <ProductHearts {product} />
                {product.title}
              </b>
            </div>
          {/if}
        </h5>
        <div>
          {#if product.movieData}<b>{product.movieData}</b><br />{/if}
          {#if product.id}<b>ID:</b>
            <span class="tooltip__content">
              {product.id}
              {#if product.partNr}
                /
                <b>BricklinkID: </b>
                <a
                  href="{data.partNr}{product.partNr}{product.partColor ? `#C=${product.partColor.id}` : ''}"
                  target="_blank"
                  class="link"
                >
                  {product.partNr}
                </a>
              {/if}
            </span><br />
          {/if}
          {#if product.parts}<b>Steine:</b> <span class="tooltip__content">{product.parts}</span><br />{/if}
          {#if !!product.price}
            <b>Preis:</b> <span class="tooltip__content">{handlePrice(product)}</span><br />
          {/if}
          {#if product.designer}<b>Designer:</b> <span class="tooltip__content">{product.designer}</span><br />{/if}
          {#if product.size}<b>Maße:</b> <span class="tooltip__content">{product.size}</span><br />{/if}
          {#if product.cats && product.cats.length > 0}
            <b class="tooltip__content--top">Kategorien:</b>
            <span class="tooltip__content tooltip__content--cats">
              {#each product.cats as categoryId, i}
                <span data-divider={i + 1 < product.cats.length && '/'}>
                  {categories[categoryId]}
                </span>
              {/each}
            </span>
            <br />
          {/if}
          {#if product.tags && product.tags.length > 0}
            <b class="tooltip__content--top">Tags:</b>
            <span class="tooltip__content tooltip__content--no-select tooltip__content--tags">
              {#each product.tags as tagID, i}
                <a
                  href={jsVoid}
                  class="link"
                  on:click={() => setActiveTag(tagID)}
                  data-divider={i + 1 < product.tags.length && '/'}
                >
                  {getTagName(tagID)}
                </a>
              {/each}
            </span>
            <br />
          {/if}
          {#if product.inst}
            <br />
            <b>Anleitung:</b><br />
            <div class="tooltip__content tooltip__content--rows flex flex--wrap">
              {#if Array.isArray(product.inst)}
                {#each product.inst as inst}
                  <a class="inst-link link" target="_blank" href="https://www.bluebrixx.com/de/inst#{product.id}">
                    <i on:click={() => openInstHref(inst)}>article</i>
                    {getInstLabel(inst)}
                  </a>
                {/each}
              {:else}
                <a class="inst-link link" target="_blank" href="https://www.bluebrixx.com/de/inst#{product.id}">
                  <i on:click={() => openInstHref(product.inst)}>article</i>
                  {getInstLabel(product.inst)}
                </a>
              {/if}
            </div>
          {/if}
          <br />
          <b>Verlauf:</b><br />
          <div class="tooltip__content tooltip__content--rows">
            <ProductHistory {product} />
          </div>
        </div>
      </div>
    </article>
  {/if}
</div>

<style lang="scss">
  @import '../../scss/variables';

  .product-tooltip {
    cursor: default;
    position: absolute;
    white-space: nowrap;
    z-index: 2;

    .link {
      i {
        color: var(--primary);
      }
    }

    .inst-link {
      i {
        cursor: default;
      }
    }

    article {
      background-color: var(--surface-variant);
    }

    [data-divider] {
      margin-right: 8rem;
    }
  }

  .tooltip {
    &__title-wrap {
      padding-right: $space-lg * 2.5;
    }

    // break headline which is longer as tooltip
    &__title {
      white-space: normal;
      font-size: ms(1);
      display: block;
      margin-bottom: $space-xs;
      line-height: 18rem;
    }

    &__content {
      user-select: all;

      a {
        display: inline-block;
        margin-right: $space-xl;
      }

      &--rows {
        margin-left: $space-xs;
      }

      &--no-select {
        user-select: none;
      }

      &--tags {
        max-width: 215px;
        display: inline-flex;
        flex-wrap: wrap;
      }

      &--cats {
        max-width: 190px;
        display: inline-flex;
        flex-wrap: wrap;
      }

      &--top {
        vertical-align: top;
      }
    }
  }
</style>
