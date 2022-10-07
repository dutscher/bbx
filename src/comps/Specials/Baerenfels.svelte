<script lang="ts">
  import { storedProducts, storedSpecialData, storedActiveProduct } from '@stores';
  import { getEEProduct, getEEState, getStateAgo, handlePrice, pad } from '@utils';

  export let tag;
  let products: any;
  let data: any;
  let innerWidth = 0;
  let allParts = 0;
  let zoom;
  let pieces;
  let activeProductID = -1;

  storedProducts.subscribe(store => (products = store));
  storedSpecialData.subscribe(store => (data = store));
  storedActiveProduct.subscribe(store => {
    if (store.product && (store.product.type !== tag.title || store.product.id === 0)) {
      activeProductID = -1;
    }
  });

  $: {
    allParts = 0;
    const imgWidth = 750;
    const maxWidth = innerWidth < imgWidth ? innerWidth : 750;
    zoom = maxWidth / (imgWidth + 64);

    pieces = data[tag.data].pieces.map((piece, i) => {
      const product = getEEProduct(products, piece);
      const [timestamp, stateId] = Object.entries(product.history).pop();

      allParts += product.parts;

      return {
        id: product.id,
        nr: pad(i + 1),
        title: tag.clearTitle(product.title, tag.title),
        parts: product.parts,
        price: product.price,
        pricePerPart: product.pricePerPart,
        stateAgo: getStateAgo(product, stateId, timestamp, 0, 0),
        stateColor: getEEState(product),
        state: product.state,
      };
    });
  }

  const setActive = (event, id) => {
    event.stopPropagation();
    activeProductID = id;

    storedActiveProduct.update(store => {
      store.product = {
        id: activeProductID,
        type: 'products',
      };
      store.reason = 'click-on-zoom';
      return store;
    });
  };
</script>

<div>
  <h2 bind:clientWidth={innerWidth}>{tag.title} - {allParts} Teile</h2>
</div>

<style lang="scss">
  .pieces {
    -moz-transform-origin: left;

    &__wrap {
      width: 750rem;
      height: 563rem;
      margin-bottom: 36rem;
    }

    .piece {
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
      font-weight: bold;

      span {
        white-space: nowrap;
      }

      span.sub {
        font-size: 10rem;
        display: block;
      }

      &--01 {
        top: 207rem;
        left: 469rem;
      }

      &--02 {
        left: 404rem;
        top: 107rem;
      }

      &--03 {
        left: 611rem;
        top: 293rem;
      }

      &--04 {
        left: 129rem;
        top: 221rem;
      }

      &--05 {
        left: 284rem;
        top: 401rem;
      }
    }
  }

  $selector: '.piece';
  #{$selector} {
    display: block;

    &__img {
      z-index: 1;
    }

    &:hover {
      cursor: pointer;

      #{$selector}__img {
        opacity: 0.5;
      }
    }

    // cc=80
    &.color--blue {
      background: #2196f3cc;
    }

    &.color--green {
      background: #4caf50cc;
    }

    &.color--red {
      background: #f44336cc;
    }

    &.color--orange {
      background: #ff9800cc;
    }
  }
</style>
