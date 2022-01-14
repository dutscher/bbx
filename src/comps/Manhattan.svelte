<script lang="ts">
    import { storedProducts, storedGlobalData, storedActiveSelection } from '../stores';
    import {
        ID_STATE_ANNOUNCEMENT,
        ID_STATE_AVAILABLE,
        ID_STATE_COMING_SOON,
        ID_STATE_UNAVAILABLE, STR_MANHATTAN
    } from "../_interfaces";
    import { getEEProduct, getEEState } from "../utils";

    const type = STR_MANHATTAN;
    let products: any;
    let data: any;
    let innerWidth;
    let zoom;
    let pieces;
    let activeProductID = -1;

    storedProducts.subscribe(store => products = store);
    storedGlobalData.subscribe(store => data = store);
    storedActiveSelection.subscribe(store => {
        if (store.product && (store.product.type !== type || store.product.id === 0)) {
            activeProductID = -1;
        }
    });

    $: {
        const imgWidth = 800;
        const minWidth = innerWidth < imgWidth ? innerWidth : imgWidth;
        zoom = `${(100 * (minWidth / imgWidth))}%`;

        pieces = data.manhattan.pieces.map((piece, i) => {
            const product = getEEProduct(products, piece);

            return {
                id: product.id,
                nr: ((i + 1) + '').padStart(2, '00'),
                title: product.title.replace(STR_MANHATTAN + ' ', ''),
                state: getEEState(product),
                isOutside: i >= 17,
            }
        })
    }

    const setActive = (event, id) => {
        event.stopPropagation();
        activeProductID = id;
        storedActiveSelection.update(value => {
            value.product = {
                id: activeProductID,
                type: 'products',
            };
            value.reason = 'click-on-zoom';
            return value;
        })
    }
</script>

<svelte:window bind:innerWidth={innerWidth}/>

<div>
    <h2>{STR_MANHATTAN}</h2>
    {#if innerWidth}
        <div class="pieces" style="zoom:{zoom}">
            <div class="pieces__wrap">
                {#each pieces as piece}
                    <div class="{`piece piece--${piece.nr} ${piece.state}`}"
                         on:click={(event) => {setActive(event, piece.id)}}
                         data-nr={piece.nr}
                         title={piece.title}>
                        {#if !piece.isOutside}
                            <img class="piece__img"
                                 alt={piece.title}
                                 src="./images/manhattan/{piece.nr}.png"/>
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
  @import '../scss/variables';

  .pieces {
    overflow: hidden;
    position: relative;
    margin-bottom: $space-xl * 4;

    &__wrap {
      height: 700px;
      width: 730px;
      position: relative;
      margin: 0 auto;
    }
  }

  $selector: '.piece';
  #{$selector} {
    position: absolute;
    top: 0;
    display: block;

    &__img {
      position: relative;
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
      background: rgba($color-primary, 0.75);
      color: $color-white;
      font-weight: bold;
      padding: $space-md;
      border-radius: $border-radius-xl;
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

    &.blue {
      &::after {
        background: rgba($color-primary, 0.75);
      }
    }

    &.green {
      &::after {
        background: rgba($color-comingsoon, 0.75);
      }
    }

    &.red {
      &::after {
        background: rgba($color-unavailable, 0.75);
      }
    }

    &.orange {
      &::after {
        background: rgba($color-annoucement, 0.75);
      }
    }

    &--01 {
      top: 32px;
    }

    &--02 {
      left: 122px;
    }

    &--03 {
      left: 262px;
    }

    &--04 {
      left: 445px;
    }

    &--05 {
      left: 569px;
    }

    &--06 {
      top: 226px;
      left: 52px;
    }

    &--07 {
      top: 227px;
      left: 188px;
    }

    &--08 {
      top: 108px;
      left: 311px;

      &::after {
        left: 45%;
        top: 20%;
      }
    }

    &--09 {
      top: 121px;
      left: 418px;
    }

    &--10 {
      top: 178px;
      left: 360px;
    }

    &--11 {
      top: 183px;
      left: 441px;
    }

    &--12 {
      top: 219px;
      left: 518px;
    }

    &--13 {
      top: 372px;
      left: 115px;
    }

    &--14 {
      top: 324px;
      left: 220px;

      &::after {
        left: 61%;
        top: 41%;
      }
    }

    &--15 {
      top: 433px;
      left: 360px;
    }

    &--16 {
      top: 361px;
      left: 457px;

      &::after {
        top: 43%;
      }
    }

    &--17 {
      top: 524px;
      left: 293px;
    }

    &--18 {
      top: 675px;
      left: 540px;

      &::after {
        left: -20px;
      }
    }

    &--19 {
      top: 622px;
      left: 51px;
      z-index: 4;

      &::after {
        left: -20px;
      }
    }

    &--20 {
      top: 660px;
      left: 92px;
      z-index: 3;

      &::after {
        left: -20px;
      }
    }
  }
</style>

