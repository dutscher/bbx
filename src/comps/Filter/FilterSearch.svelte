<script lang="ts">
  import * as animateScroll from 'svelte-scrollto';
  import { storedActiveSelection } from '@stores';
  import { onMount, getUrlParam, setUrlParams } from '@utils';
  import beerui from '@beerui';

  export let activeSearchString: any = '';

  const urlParam = 'search';
  let inputElement: any;

  storedActiveSelection.subscribe(store => {
    if (store.site === 'products' && store.reason === 'click-search') {
      setTimeout(() => {
        inputElement.focus();
        animateScroll.scrollTo({ element: inputElement });
      }, 50);
      // remove reason
      storedActiveSelection.update(store => {
        store.reason = '';
        return store;
      });
    }
  });

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
        store.reason = 'search-typed';
      } else {
        store.reason = 'url-parsed--search';
      }
      return store;
    });
  };

  let timer;
  const debounce = value => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      // set value
      activeSearchString = value;
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
  }
</style>
