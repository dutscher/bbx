<script lang="ts">
    import {
        storedGlobalData,
        storedCategories,
        storedTags,
        storedStates,
        storedActiveSelection,
        storedHearts,
        lsKeyHeart,
        localStore,
    } from '../../stores';
    import { jsVoid, setUrlParams } from "../../utils";
    import Icon from '../Icon.svelte';
    import ProductHistory from "./ProductHistory.svelte";
    import ProductImage from "./ProductImage.svelte";

    export let product: any;
    export let states: any;
    export let showTooltip: boolean = true;
    export let imageLoaded: boolean = false;

    let data: any;
    let categories: any;
    let tags: any;
    let hearts: any;
    const spaceing: number = 16;
    let innerWidth: number;
    let wrapElement: any;
    let wrapWidth: number;
    let isMobile: boolean = true;
    let leftAdjust: string;

    let timer;

    storedStates.subscribe(store => states = store);
    storedGlobalData.subscribe(store => data = store);
    storedCategories.subscribe(store => categories = store);
    storedTags.subscribe(store => tags = store);
    storedHearts.subscribe(store => hearts = store);

    // /101/101857%20Das%20Schwarze%20Auge,%20Thowaler%20Drachenschiff,%20Otta%20(45MB).pdf
    // https://www.bluebrixx.com/data/files/manuals/103/103272%20Nimitz%20Teil%202%20(26MB).pdf
    const getInstLabel = (str) => {
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
    }

    const getInstHref = (pdfLink) => {
        if (pdfLink.includes('http')) {
            return pdfLink;
        }
        return data.instUrl + pdfLink;
    }

    const handleLeftAdjust = (node, showTooltip) => {
        const bounds = node.getBoundingClientRect();
        const mobileWidth = 320;
        const rightEdge = Math.round(bounds.left + bounds.width);
        const rightEdgeWithSpace = rightEdge + (spaceing * 2);
        let maxLeft;

        if (mobileWidth >= innerWidth) {
            isMobile = true;
            wrapWidth = innerWidth - spaceing;
            maxLeft = bounds.left - (spaceing / 2);
        } else {
            isMobile = false;
            wrapWidth = 0;
            maxLeft = bounds.left + bounds.width - innerWidth + spaceing;
        }

        if (rightEdgeWithSpace > innerWidth) {
            leftAdjust = '-' + maxLeft + 'px';
        } else {
            leftAdjust = '0px';
        }
    }

    const handlePrice = (product) => {
        if (product.price > 0) {
            return `${('' + product.price.toFixed(2)).replace('.', ',')}EUR (${product.pricePerPart.toFixed(2).replace('.', ',')} ct/Stein)`;
        }
        return '';
    }

    const getTagName = (tagID) => {
        return tags.filter(tag => tag.id === tagID).map(tag => tag.name)
    }

    const setActiveTag = (tagID) => {
        storedActiveSelection.update(store => {
            if (!('tags' in store)) {
                store.tags = [];
            }
            if (!store.tags.includes(tagID)) {
                store.tags.push(tagID);
                store.reason = 'tooltip-tag-clicked';

                setUrlParams(
                    'tags',
                    tags
                        .filter(tag => store.tags.includes(tag.id))
                        .map((tag) => tag.seoName));
            }
            return store;
        });
    }

    const onClose = (event) => {
        event.stopPropagation();
        storedActiveSelection.update(store => {
            store.product = {
                id: 0,
                type: 'Tooltip',
            };
            store.reason = 'close-tooltip';
            return store;
        });
    }

    const clickHeart = () => {
        storedHearts.update(store => {
            if (!store.includes(product.id)) {
                store.push(product.id);
            } else {
                store = store.filter(pid => pid !== product.id)
            }

            localStore.set(lsKeyHeart, JSON.stringify(store));

            return store;
        })
    }

    const setDownload = (downloadUrl, name) => {
        const link = document.createElement("a");
        // If you don't know the name or want to use
        // the webserver default set name = ''
        link.setAttribute('download', name);
        link.href = downloadUrl;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    const scrollIntoView = () => {
        const {bottom} = wrapElement.getBoundingClientRect();

        if (bottom > window.innerHeight) {
            wrapElement.scrollIntoView({behavior: 'smooth'});
        }
    }

    $: {
        if (wrapElement) {
            handleLeftAdjust(wrapElement, showTooltip);
        }
    }
</script>

<svelte:window bind:innerWidth={innerWidth}/>

<div class="tooltip{showTooltip ? ' open' : ''}">
    {#if showTooltip}
        <div class="tooltip__outer-wrap" style="{isMobile ? 'width:' + (wrapWidth) +'px; ' : ''}left: {leftAdjust}"
             bind:this={wrapElement}>
            <div class="tooltip__wrap">
                <div class="tooltip__close">
                    <Icon modifier="cross" svg="true" on:click={onClose}/>
                </div>
                {#if product.title}
                    <div class="tooltip__title-wrap">
                        <strong class="tooltip__title">
                            <Icon modifier="heart" svg="true" class="{hearts.includes(product.id) ? 'active' : ''}"
                                  title="Will ich haben"
                                  on:click={clickHeart}/>
                            {product.title}
                        </strong>
                    </div>
                {/if}
                {#if product.movieData}<strong>{product.movieData}</strong><br/>{/if}
                {#if product.id}<strong>ID:</strong> <span class="tooltip__content">{product.id}</span><br/>{/if}
                {#if product.parts}<strong>Steine:</strong> <span
                        class="tooltip__content">{product.parts}</span><br/>{/if}
                {#if !!product.price}
                    <strong>Preis:</strong> <span class="tooltip__content">{handlePrice(product)}</span><br/>
                {/if}
                {#if product.cats && product.cats.length > 0}
                    <strong>Kategorien:</strong>
                    <span class="tooltip__content">
                {#each product.cats as categoryId,i}
                    <span data-divider="{(i + 1) < product.cats.length && '/'}">
                        {categories[categoryId]}
                    </span>
                {/each}
                        <br/>
                </span>
                {/if}
                {#if product.tags && product.tags.length > 0}
                    <strong>Tags:</strong>
                    <span class="tooltip__content tooltip__content--no-select tooltip__content--tags">
                {#each product.tags as tagID,i}
                    <a href={jsVoid} on:click={() => setActiveTag(tagID)}
                       data-divider="{(i + 1) < product.tags.length && '/'}">{getTagName(tagID)}</a>
                {/each}
            </span>
                    <br/>
                {/if}
                {#if product.inst}
                    <br/>
                    <strong>Anleitung:</strong><br/>
                    <div class="tooltip__content tooltip__content--rows">
                        {#if Array.isArray(product.inst)}
                            {#each product.inst as inst}
                                <a class="inst-link" target="_blank" href={getInstHref(inst)}>
                                    <Icon modifier="manual"/>
                                    {getInstLabel(inst)}
                                </a>
                            {/each}
                        {:else}
                            <a class="inst-link" target="_blank" href={getInstHref(product.inst)}>
                                <Icon modifier="manual"/>
                                {getInstLabel(product.inst)}
                            </a>
                        {/if}
                    </div>
                {/if}
                <br/>
                <strong>Verlauf:</strong><br/>
                <div class="tooltip__content tooltip__content--rows">
                    <ProductHistory {product}/>
                </div>
                <br/>
                <a href={data.url + product.href} target="_blank">
                    <span>
                        Zum Shop
                        <Icon modifier="cart"/>
                    </span><br/>
                    <ProductImage {product} onLoad={() => {imageLoaded = true;scrollIntoView();}}></ProductImage>
                </a>
            </div>
        </div>
    {/if}
</div>

<style lang="scss">
  @import '../../scss/variables';

  .tooltip {
    position: relative;
    height: 1px;
    display: block;
    width: 100%;
    white-space: nowrap;

    &__outer-wrap {
      display: none;
      position: absolute;
      top: -2px;
      left: 0;
      color: $color-white;
      font-size: ms(0);

      @media (min-width: 750px) {
        font-size: ms(-2);
      }

      z-index: 2;

      .open & {
        display: block;
        padding-bottom: $space-xl;
      }
    }

    &__wrap {
      background: $color-primary;
      box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
      padding: $space-md;
      border-radius: $border-radius;
      min-width: 250px;
    }

    // break headline which is longer as tooltip
    &__title {
      white-space: normal;
      font-size: ms(1);
      display: block;
      margin-bottom: $space-xs;
    }

    &__title-wrap {
      padding-right: $space-lg * 2.5;
    }

    &__close {
      position: absolute;
      right: $space-sm;
      top: $space-sm;
    }

    &__content {
      color: $color-primary-lighter;
      user-select: all;

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
    }

    [data-divider] {
      margin-right: $space-sm;

      &::after {

      }
    }

    a {
      display: block;
      color: $color-primary-lighter;

      &:hover {
        color: $color-white;
      }
    }

    .inst-link {
      user-select: none;
    }
  }
</style>
