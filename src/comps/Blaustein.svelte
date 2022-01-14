<script lang="ts">
    import { storedProducts, storedGlobalData, storedActiveSelection } from '../stores';
    import { STR_BURG_BLAUSTEIN } from '../_interfaces';
    import { getEEProduct, getEEState } from '../utils';

    const type = STR_BURG_BLAUSTEIN;
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

    $:{
        const imgWidth = 750;
        const maxWidth = innerWidth < imgWidth ? innerWidth : 750;
        zoom = `${(100 * (maxWidth / imgWidth))}%`;

        pieces = data.blaustein.pieces.map((piece, i) => {
            const product = getEEProduct(products, piece);

            return {
                id: product.id,
                nr: ((i + 1) + '').padStart(2, '00'),
                title: product.title.replace(' für ' + STR_BURG_BLAUSTEIN, ''),
                state: getEEState(product),
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
    <h2>{STR_BURG_BLAUSTEIN}</h2>
    {#if innerWidth}
        <div class="pieces" style="zoom:{zoom}">
            <div class="pieces__wrap flex">
                <img class="piece__img"
                     alt={STR_BURG_BLAUSTEIN}
                     src="./images/{'burg-blaustein'}.png"/>
                {#each pieces as piece}
                    <div class="{`piece piece--${piece.nr} ${piece.state}`}"
                         on:click={(event) => {setActive(event, piece.id)}} data-title={piece.title}>
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

    &__wrap {
      width: 750px;
      height: 563px;
      position: relative;
      margin-bottom: $space-xl * 4;
    }

    .piece {
      position: absolute;

      &::after {
        position: absolute;
        content: attr(data-title);
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

      &--01 {
        top: 218px;
        left: 519px;
      }

      &--02 {
        left: 404px;
        top: 107px;
      }

      &--03 {
        left: 611px;
        top: 293px;
      }

      &--04 {
        left: 129px;
        top: 221px;
      }
    }
  }

  $selector: '.piece';
  #{$selector} {
    display: block;

    &__img {
      position: relative;
      z-index: 1;
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
  }
</style>

