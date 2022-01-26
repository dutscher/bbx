<script lang="ts">
    import { storedProducts, storedGlobalData, storedActiveProduct } from '../stores';
    import {
        STR_NETHERLAND,
    } from "../_interfaces";
    import { getEEProduct, getEEState } from "../utils";

    const type = STR_NETHERLAND;
    let products: any;
    let data: any;
    let innerWidth;
    let zoom;
    let pieces;
    let activeProductID = -1;

    storedProducts.subscribe(store => products = store);
    storedGlobalData.subscribe(store => data = store);
    storedActiveProduct.subscribe(store => {
        if (store.product && (store.product.type !== type || store.product.id === 0)) {
            activeProductID = -1;
        }
    });

    $:{
        const maxWidth = innerWidth < 1050 ? innerWidth : innerWidth / 1.5;
        const imgWidth = 201 + 153 + 184 + 179 + 229 + 249 + 184 + 294 + 100; // 100 extra pixel
        zoom = `${(100 * (maxWidth / imgWidth))}%`;

        pieces = data.netherland.pieces.map((piece, i) => {
            const product = getEEProduct(products, piece);

            return {
                id: product.id,
                nr: ((i + 1) + '').padStart(2, '00'),
                title: product.title.replace(STR_NETHERLAND + ' ', ''),
                state: getEEState(product),
            }
        })
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
        })
    }
</script>

<svelte:window bind:innerWidth={innerWidth}/>

<div>
    <h2>{STR_NETHERLAND}</h2>
    {#if innerWidth}
        <div class="pieces" style="zoom:{zoom}">
            <div class="pieces__wrap flex">
                {#each pieces as piece}
                    <div class="{`piece piece--${piece.nr} ${piece.state}`}"
                         on:click={(event) => {setActive(event, piece.id)}}
                         title={piece.title}
                         data-nr={piece.nr}>
                        <img class="piece__img"
                             alt={piece.title}
                             src="./images/netherland/{piece.nr}.png"/>
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
      width: 1673px;
      height: 750px;
      position: relative;
      margin-bottom: $space-xl * 4;
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

