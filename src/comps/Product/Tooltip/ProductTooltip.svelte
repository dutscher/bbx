<script lang="ts">
  import {
    storedGlobalData,
    storedCategories,
    storedTags,
    storedStates,
    storedActiveSelection,
    loadProductData,
  } from '@stores';
  import { jsVoid, setUrlParams, handlePrice, ess, getOffsetRect } from '@utils';
  import ProductStage from './ProductStage.svelte';
  import ProductInst from './ProductInst.svelte';
  import ProductHistory from './ProductHistory.svelte';

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
  let leftAdjustInt: number = 0;

  let timer;

  storedStates.subscribe(store => (states = store));
  storedGlobalData.subscribe(store => (data = store));
  storedCategories.subscribe(store => (categories = store));
  storedTags.subscribe(store => (tags = store));

  const handleLeftAdjust = () => {
    const { left, width } = wrapElement.getBoundingClientRect();
    const leftEdge = left + leftAdjustInt;
    const rightEdge = Math.round(leftEdge + width);
    const rightEdgeWithSpace = rightEdge + spaceing * 2;
    let maxLeft;

    if (width + 120 >= innerWidth) {
      isMobile = true;
      wrapWidth = innerWidth - spaceing;
      maxLeft = Math.round(leftEdge - spaceing / 2);
    } else {
      isMobile = false;
      wrapWidth = 0;
      maxLeft = Math.round(rightEdgeWithSpace - innerWidth);
    }

    if (rightEdgeWithSpace > innerWidth) {
      leftAdjustInt = maxLeft;
      leftAdjust = '-' + maxLeft + 'rem';
    } else {
      leftAdjustInt = 0;
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
        store.site = 'products';

        setUrlParams(
          'tags',
          tags.filter(tag => store.tags.includes(tag.id)).map(tag => tag.seoName)
        );
      }
      return store;
    });
  };

  const scrollIntoView = (notScroll?) => {
    const { y } = getOffsetRect(wrapElement);
    let newTop = -1;
    // tooltip bottom corner not visible
    if (y + 120 > window.innerHeight) {
      newTop = y - 120;
    }
    // scroll to top of product
    if (newTop >= 0) {
      newTop = Math.round(newTop);
      if (!notScroll) {
        window.scrollTo({ top: newTop, left: 0, behavior: 'smooth' });
      }
    }
  };

  $: {
    if (wrapElement && showTooltip) {
      handleLeftAdjust();
      loadProductData(product);
      setTimeout(() => {
        scrollIntoView();
      }, 50);
    }
  }
</script>

<svelte:window bind:innerWidth />

<div
  class={ess('product-tooltip absolute', showTooltip && 'open')}
  style="{isMobile ? 'width:' + wrapWidth + 'rem; ' : ''}left:{leftAdjust}"
>
  {#if showTooltip}
    <article class="no-padding border round" bind:this={wrapElement}>
      <div class="top">
        <ProductStage {product} />
      </div>
      <div class="small-padding">
        <h5 class="no-margin">
          {#if product.title}
            <div class="product-tooltip__title-wrap">
              <h5 class="product-tooltip__title">
                {product.title}
              </h5>
            </div>
          {/if}
        </h5>
        <div>
          {#if product.movieData}<b>{product.movieData}</b><br />{/if}
          {#if product.id}<b>ID:</b>
            <span class="product-tooltip__content">
              {product.id}
              {#if product.partNr}
                /
                <b>BricklinkID:</b>
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
          {#if product.parts}<b>Steine:</b> <span class="product-tooltip__content">{product.parts}</span><br />{/if}
          {#if !!product.price}
            <b>Preis:</b> <span class="product-tooltip__content">{handlePrice(product)}</span><br />
          {/if}
          {#if product.designer}<b>Designer:</b> <span class="product-tooltip__content">{product.designer}</span><br
            />{/if}
          {#if product.size}<b>Maße:</b> <span class="product-tooltip__content">{product.size}</span><br />{/if}
          {#if product.cats && product.cats.length > 0}
            <b class="product-tooltip__content--top">Kategorien:</b>
            <span class="product-tooltip__content product-tooltip__content--cats">
              {#each product.cats as categoryId, i}
                <span data-divider={i + 1 < product.cats.length && '/'}>
                  {categories[categoryId]}
                </span>
              {/each}
            </span>
            <br />
          {/if}
          {#if product.tags && product.tags.length > 0}
            <b class="product-tooltip__content--top">Tags:</b>
            <span class="product-tooltip__content product-tooltip__content--no-select product-tooltip__content--tags">
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
            <div class="product-tooltip__content product-tooltip__content--rows flex flex--wrap">
              <ProductInst {product} />
            </div>
          {/if}
          <br />
          <b>Verlauf:</b><br />
          <div class="product-tooltip__content product-tooltip__content--rows">
            <ProductHistory {product} />
          </div>
        </div>
      </div>
    </article>
  {/if}
</div>

<style lang="scss">
  .product-tooltip {
    cursor: default;
    white-space: nowrap;
    padding-bottom: 86rem;
    z-index: 2;

    .link {
      user-select: none;
      i {
        color: var(--primary);
      }
    }

    .partlist-link {
      cursor: pointer;
    }

    article {
      background-color: var(--surface-variant);
    }

    [data-divider] {
      margin-right: 8rem;
    }
    // break headline which is longer as tooltip
    &__title {
      white-space: normal;
      display: block;
      line-height: 26rem;
      user-select: text;
    }

    &__content {
      user-select: all;

      &--no-select {
        user-select: none;
      }

      &--tags {
        max-width: 215rem;
        display: inline-flex;
        flex-wrap: wrap;
      }

      &--cats {
        max-width: 190rem;
        display: inline-flex;
        flex-wrap: wrap;
      }

      &--top {
        vertical-align: top;
      }
    }
  }
</style>
