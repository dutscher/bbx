<script lang="ts">
  import { storedProducts, storedGlobalData, storedActiveProduct } from '@stores';
  import { STR_MANHATTAN } from '@interfaces';
  import { getEEProduct, getEEState, pad } from '@utils';

  const type = STR_MANHATTAN;
  let products: any;
  let data: any;
  let innerWidth = 0;
  let zoom;
  let pieces;
  let activeProductID = -1;

  storedProducts.subscribe(store => (products = store));
  storedGlobalData.subscribe(store => (data = store));
  storedActiveProduct.subscribe(store => {
    if (store.product && (store.product.type !== type || store.product.id === 0)) {
      activeProductID = -1;
    }
  });

  $: {
    const imgWidth = 800;
    const minWidth = innerWidth < imgWidth ? innerWidth : imgWidth;
    zoom = minWidth / imgWidth;

    pieces = data.manhattan.pieces.map((piece, i) => {
      const product = getEEProduct(products, piece);

      return {
        id: product.id,
        nr: pad(i + 1),
        title: product.title.replace(STR_MANHATTAN + ' ', ''),
        state: getEEState(product),
        isOutside: i >= 17,
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
  <h2 bind:clientWidth={innerWidth}>{STR_MANHATTAN}</h2>
  {#if innerWidth}
    <div class="pieces" style="zoom:{zoom};-moz-transform:scale({zoom});">
      <div class="pieces__wrap">
        {#each pieces as piece}
          <div
            class="piece white-text absolute piece--{piece.nr} state--{piece.state}"
            on:click={event => {
              setActive(event, piece.id);
            }}
            data-nr={piece.nr}
            title={piece.title}
          >
            {#if !piece.isOutside}
              <img class="piece__img" alt={piece.title} src="./images/specials/manhattan/{piece.nr}.png" />
            {:else}
              {piece.title}
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .pieces {
    -moz-transform-origin: left;

    &__wrap {
      height: 700rem;
      width: 730rem;
      margin: 0 auto;
      margin-bottom: 36rem;
    }
  }

  $selector: '.piece';
  #{$selector} {
    top: 0;
    display: block;

    &__img {
      z-index: 1;
      opacity: 0.2;
    }

    &::after {
      position: absolute;
      content: attr(data-nr);
      display: block;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
      font-weight: bold;
      padding: 6rem;
      border-radius: 16rem;
    }

    &.available {
      #{$selector} {
        &__img {
          opacity: 1;
        }
      }
    }

    &:hover {
      cursor: pointer;

      #{$selector}__img {
        opacity: 0.5;
      }
    }

    &.state--blue {
      &::after {
        background: #2196f3cc;
      }
    }

    &.state--green {
      &::after {
        background: #4caf50cc;
      }
    }

    &.state--red {
      &::after {
        background: #f44336cc;
      }
    }

    &.state--orange {
      &::after {
        background: #ff9800cc;
      }
    }

    &--01 {
      top: 32rem;
    }

    &--02 {
      left: 122rem;
    }

    &--03 {
      left: 262rem;
    }

    &--04 {
      left: 445rem;
    }

    &--05 {
      left: 569rem;
    }

    &--06 {
      top: 226rem;
      left: 52rem;
    }

    &--07 {
      top: 227rem;
      left: 188rem;
    }

    &--08 {
      top: 108rem;
      left: 311rem;

      &::after {
        left: 45%;
        top: 20%;
      }
    }

    &--09 {
      top: 121rem;
      left: 418rem;
    }

    &--10 {
      top: 178rem;
      left: 360rem;
    }

    &--11 {
      top: 183rem;
      left: 441rem;
    }

    &--12 {
      top: 219rem;
      left: 518rem;
    }

    &--13 {
      top: 372rem;
      left: 115rem;
    }

    &--14 {
      top: 324rem;
      left: 220rem;

      &::after {
        left: 61%;
        top: 41%;
      }
    }

    &--15 {
      top: 433rem;
      left: 360rem;
    }

    &--16 {
      top: 361rem;
      left: 457rem;

      &::after {
        top: 43%;
      }
    }

    &--17 {
      top: 524rem;
      left: 293rem;
    }

    &--18 {
      top: 675rem;
      left: 540rem;

      &::after {
        left: -20rem;
      }
    }

    &--19 {
      top: 622rem;
      left: 51rem;
      z-index: 4;

      &::after {
        left: -20rem;
      }
    }

    &--20 {
      top: 660rem;
      left: 92rem;
      z-index: 3;

      &::after {
        left: -20rem;
      }
    }
  }
</style>
