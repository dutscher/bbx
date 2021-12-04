<script lang="ts">
    import { storedProducts, storedGlobalData } from '../stores';

    let products: any;
    let data: any;

    storedProducts.subscribe(value => products = value);
    storedGlobalData.subscribe(value => data = value);

    const isAvailable = (piece) => {
        let id = piece.match(/(\d{6})/);
        let state = false;

        if (id && products) {
            products.map(product => {
                if (product.id === parseInt(id) && product.state.id === 0) {
                    state = true;
                }
            })

        }

        return state;
    }
    let innerWidth;
</script>

<svelte:window bind:innerWidth={innerWidth} />

<div>
    <h2>Manhattan</h2>

    <div class="pieces" style="zoom: {(100 * ( innerWidth / 850 ))}%">
        <div class="pieces__wrap">
            {#each data.manhattan.pieces as piece, i}
                <div class="{`piece piece--${((i + 1) + '').padStart(2, '00')}${isAvailable(piece) ? ' available' : ''}`}"
                     data-nr={((i + 1) + '').padStart(2, '00')}>
                    <img class="piece__img"
                         alt={piece}
                         src="./images/manhattan/{((i + 1) + '').padStart(2, '00')}.png"/>
                </div>
            {/each}
        </div>
    </div>
</div>

<style lang="scss">
    @import '../scss/variables';

    .pieces {
        position: relative;

        @media (min-width: 750px) {
            zoom: 1 !important;
        }

        &__wrap {
            height: 700px;
            width: 730px;
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

            &::after {
            }
        }

        &:hover {
            cursor: pointer;

            #{$selector}__img {
                opacity: 0.5;
            }

            &::after {
                color: $color-primary;
                background: rgba($color-white, 0.75);
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
    }
</style>

