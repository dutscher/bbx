<script lang="ts">
  import Tooltip from './ProductTooltip.svelte';
  import ClickOutside from 'svelte-click-outside';
  import {
    ID_BURG_BLAUSTEIN,
    ID_MANHATTAN,
    ID_MOVIE,
    ID_NETHERLAND,
    ID_STAR_TREK,
    STR_MANHATTAN,
    STR_NETHERLAND,
    STR_BURG_BLAUSTEIN,
    STR_STAR_TREK,
    UNLOADED,
  } from '../../_interfaces';
  import { storedGlobalData, storedActiveSelection, storedStates, storedHearts, loadInstData } from '../../stores';
  import { getLatestStateOfToday, ess } from '../../utils';
  import { storedActiveProduct } from '../../stores/states';

  export let product: any;
  export let withoutTooltip: boolean = false;
  export let type: string = ''; // todayChanges
  export let todayChangesDate: string = ''; // 08.10.2021

  let data: any;
  let states: any;
  let hearts: any;
  let heartLists: any;
  let activeProduct: any;
  let activeTagsIds: any;
  let dataLoaded: string;
  let showTooltip = false;
  let isHeart: boolean;
  let isActive: boolean = false;
  let stateColor: string = '';
  let productTitle: string = '';

  storedActiveSelection.subscribe(store => {
    activeTagsIds = store.tags;
    dataLoaded = store.loadedData.inst;
  });
  storedActiveProduct.subscribe(store => {
    activeProduct = store.product;
    if (activeProduct && ((activeProduct.id !== product.id && activeProduct.type === type) || activeProduct.id === 0)) {
      showTooltip = false;
    }
  });
  storedGlobalData.subscribe(store => (data = store));
  storedStates.subscribe(store => (states = store));
  storedHearts.subscribe(store => {
    hearts = store;
    heartLists = Object.keys(hearts);
  });

  const onClick = () => {
    // toggle tooltip
    showTooltip = !showTooltip;

    // update store to close other tooltips
    storedActiveProduct.update(store => {
      store.product = {
        id: showTooltip ? product.id : 0,
        type,
      };
      store.reason = 'open-tooltip';
      return store;
    });
  };

  const onClickOutside = () => {
    if (isActive) {
      showTooltip = false;
      storedActiveProduct.update(store => {
        store.product = {
          id: 0,
          type,
        };
        store.reason = 'click-outside';
        return store;
      });
    }
  };

  const getTitle = product => {
    const isBurgBlaustein = activeTagsIds && activeTagsIds.includes(ID_BURG_BLAUSTEIN) && activeTagsIds.length === 1;
    const isNetherland = activeTagsIds && activeTagsIds.includes(ID_NETHERLAND) && activeTagsIds.length === 1;
    const isManhattan = activeTagsIds && activeTagsIds.includes(ID_MANHATTAN) && activeTagsIds.length === 1;
    const isMovieFilterOnly = activeTagsIds && activeTagsIds.includes(ID_MOVIE) && activeTagsIds.length === 1;
    const isStarTrekFilterOnly = activeTagsIds && activeTagsIds.includes(ID_STAR_TREK) && activeTagsIds.length === 1;
    const isStarTrek = !!product.title && product.title.includes(STR_STAR_TREK);
    let title = product.title;

    if (isBurgBlaustein) {
      title = title.replace(' für ' + STR_BURG_BLAUSTEIN, '');
    }

    if (isNetherland) {
      title = title.replace(STR_NETHERLAND + ' ', '');
    }

    if (isManhattan) {
      title = title.replace(STR_MANHATTAN + ' ', '');
    }

    if (isStarTrek && (isMovieFilterOnly || isStarTrekFilterOnly)) {
      title = title.replace(STR_STAR_TREK + ' ', '');
      product.movieData = STR_STAR_TREK;
    }

    return title;
  };

  const handleStateName = product => {
    let stateName = product.state.id > 0 ? product.state.de : null;
    if (!!todayChangesDate) {
      const stateId = getLatestStateOfToday(product, todayChangesDate);
      const state = states.find(state => state.id === stateId);
      stateName = stateId > 0 ? state.de : null;
    }
    return stateName;
  };

  const handleStateColor = product => {
    let stateColor = product.state.color;
    if (!!todayChangesDate) {
      const stateId = getLatestStateOfToday(product, todayChangesDate);
      const state = states.find(state => state.id === stateId);
      stateColor = state.color;
    }
    return stateColor;
  };

  $: {
    isActive = (activeProduct && activeProduct.id === product.id && type === activeProduct.type) || false;

    if (dataLoaded === UNLOADED && isActive) {
      loadInstData();
    }

    isHeart = heartLists.find(list => hearts[list].i.includes(product.id));

    stateColor = handleStateColor(product);

    productTitle = getTitle(product);
  }
</script>

<ClickOutside on:clickoutside={onClickOutside}>
  <div class="product" data-state={handleStateName(product)}>
    <span class={ess('chip large round no-margin white-text', stateColor)} on:click={onClick}>
      <span>
        {#if isHeart && !type.startsWith('hearts')}
          <i class={stateColor === 'red' ? 'orange-text' : 'red-text'}>favorite</i>
        {/if}
        {#if (product.isNew || product.isNewSoon) && !isHeart}
          <i class="yellow-text">star</i>
        {/if}
        {#if product.isHot && !isHeart}
          <i class="orange-text">local_fire_department</i>
        {/if}
        {productTitle}
      </span>
      {#if type === 'products' && product.movieData && activeTagsIds.includes(ID_MOVIE)}
        <span class="product__movie">{product.movieData}</span>
      {/if}
    </span>
    {#if !withoutTooltip}
      <Tooltip {product} showTooltip={isActive} />
    {/if}
  </div>
</ClickOutside>

<style lang="scss">
  .product {
    user-select: none;
    cursor: pointer;

    i {
      overflow: inherit;
      margin-right: 4rem;
    }

    .chip {
      flex-direction: column;
    }

    &__movie {
      align-self: flex-end;
      display: block;
      font-size: 12rem;
      top: -3rem;
      margin-left: 0 !important;

      @media (min-width: 750px) {
        font-size: 8rem;
      }
    }
  }
</style>
