<script lang="ts">
  import * as animateScroll from 'svelte-scrollto';
  import { storedActiveSelection } from '@stores';
  import states from '@states';
  import { onMount, afterUpdate, getUrlParam, setUrlParams } from '@utils';
  import beerui from '@beerui';

  export let activeSearchString: string = '';
  const urlParam = 'search';
  // https://svelte.dev/tutorial/update
  let scrollTo: boolean = false;
  let inputElement: HTMLInputElement;

  const iamOnSite = 'products';

  storedActiveSelection.subscribe(store => {
    // scroll afterUpdate hook
    if (store.reason === states.SEARCH_CLICKED) {
      scrollTo = true;
    }
    // without remount this component scroll directly
    if (store.site === iamOnSite && store.prevSite === iamOnSite && store.reason === states.SEARCH_CLICKED) {
      scrollToElement();
    }
  });

  const scrollToElement = () => {
    if (scrollTo && inputElement) {
      animateScroll.scrollTo({ element: inputElement, offset: -80 });
      scrollTo = false;
      // due beercss show hide filter
      setTimeout(() => {
        inputElement.focus();
      }, 50);

      storedActiveSelection.update(store => {
        store.reason = states.EMPTY;
        return store;
      });
    }
  };

  const getUrlParams = () => {
    // ?search=piraten
    const queryTags = getUrlParam(urlParam);
    activeSearchString = queryTags;
    if (!!activeSearchString) {
      onInput();
    }
  };

  const onInput = (withUrlUpdate?) => {
    storedActiveSelection.update(store => {
      if (!(urlParam in store)) {
        store[urlParam] = activeSearchString;
      }
      store[urlParam] = activeSearchString;

      if (withUrlUpdate) {
        setUrlParams(urlParam, !!activeSearchString ? [activeSearchString] : []);
        store.reason = states.SEARCH_TYPED;
      } else {
        store.reason = states.URL_PARSED_SEARCH;
      }
      return store;
    });
  };

  let timer;
  const debounce = value => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      // set value
      activeSearchString = value.trim();
      onInput(true);
    }, 500);
  };

  const checkInput = value => {
    // reset value
    if (value === '') {
      activeSearchString = '';
      onInput(true);
    }
  };

  onMount(() => {
    getUrlParams();
    setTimeout(() => {
      beerui();
    }, 50);
  });

  afterUpdate(() => {
    scrollToElement();
  });
</script>

<div class="field label prefix border">
  <i>search</i>
  <input
    id="search"
    class="search"
    type="search"
    value={activeSearchString}
    bind:this={inputElement}
    on:input={({ target: { value } }) => checkInput(value)}
    on:keyup={({ target: { value } }) => debounce(value)}
    spellcheck="false"
  />
  <label for="search">Produktname oder ID</label>
</div>

<style lang="scss">
  .field {
    margin: 8rem 0;
    // fix that label not in overlay
    &.label > label {
      z-index: 2;
    }
  }
</style>
