<script lang="ts">
    import ClickOutside from 'svelte-click-outside';
    import Tooltip from './Product/ProductTooltip.svelte';
    import { storedProducts, storedGlobalData, storedActiveSelection } from '../stores';
    import {
        ID_STATE_ANNOUNCEMENT,
        ID_STATE_AVAILABLE,
        ID_STATE_COMING_SOON,
        ID_STATE_UNAVAILABLE,
        STR_NETHERLAND,
    } from "../_interfaces";

    const type = STR_NETHERLAND;
    let products: any;
    let data: any;
    let innerWidth;
    let zoom;
    let activeProductID = -1;

    storedProducts.subscribe(store => products = store);
    storedGlobalData.subscribe(store => data = store);
    storedActiveSelection.subscribe(store => {
        if (store.product && (store.product.type !== type || store.product.id === 0)) {
            activeProductID = -1;
        }
    });

    $:{
        const maxWidth = innerWidth <= 1200 ? innerWidth : 750;
        zoom = `${(100 * (maxWidth / 1680))}%`;
    }

    const setActive = (piece) => {
        activeProductID = getProduct(piece).id;
    }

    const getProduct = (piece) => {
        let id = piece.match(/(\d{6})/);
        let foundProduct;

        products.map(product => {
            if (product.id === parseInt(id)) {
                foundProduct = product;
            }
        });

        return foundProduct;
    }

    const getState = (piece) => {
        let product = getProduct(piece);
        let state = '';

        if (product) {
            switch (product.state.id) {
                case ID_STATE_AVAILABLE:
                    state = 'blue available';
                    break;
                case ID_STATE_UNAVAILABLE:
                    state = 'red';
                    break;
                case ID_STATE_COMING_SOON:
                    state = 'green';
                    break;
                case ID_STATE_ANNOUNCEMENT:
                    state = 'orange';
                    break;
            }
        }
        return state;
    }

    const onClickOutside = (piece) => {
        if (activeProductID === getProduct(piece).id) {
            storedActiveSelection.update(value => {
                value.product = {
                    id: 0,
                    type: 'manhattan',
                };
                value.reason = 'click-outside';
                return value;
            })
        }
    }
</script>

<svelte:window bind:innerWidth={innerWidth}/>

<div>
    <h2>{STR_NETHERLAND}</h2>
    {#if innerWidth}
        <div class="pieces" style="zoom:{zoom}">
            <div class="pieces__wrap flex">
                {#each data.netherland.pieces as piece, i}
                    <ClickOutside on:clickoutside={() => onClickOutside(piece)}>
                        <div class="{`piece piece--${((i + 1) + '').padStart(2, '00')} ${getState(piece)}`}"
                             on:click={() => {setActive(piece)}}
                             data-nr={((i + 1) + '').padStart(2, '00')}>
                            <img class="piece__img"
                                 alt={piece}
                                 src="./images/netherland/{((i + 1) + '').padStart(2, '00')}.png"/>
                            <Tooltip product={getProduct(piece)}
                                     showTooltip={activeProductID === getProduct(piece).id}
                                     zoom={zoom}/>
                        </div>
                    </ClickOutside>
                {/each}
            </div>
        </div>
    {/if}
</div>

<style lang="scss">
  @import '../scss/variables';

  .pieces {
    position: relative;

    &__wrap {
      width: 1680px;
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

