<script lang="ts">
  import { onMount } from 'svelte';
  import { storedActiveSelection } from '../../stores';
  import { getUrlParam, setUrlParams } from '../../utils';
  import { beerui } from '../../beerui';

  export let activeSearchString: any = '';

  const urlParam = 'search';

  const getUrlParams = () => {
    // ?tags=piraten
    const queryTags = getUrlParam(urlParam);
    activeSearchString = queryTags;
    onInput();
    beerui();
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
        store.reason = 'url-parsed';
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
  });
</script>

<article>
  <div class="field label prefix border no-margin">
    <i>search</i>
    <input
      id="search"
      class="search"
      type="search"
      value={activeSearchString}
      on:input={({ target: { value } }) => checkInput(value)}
      on:keyup={({ target: { value } }) => debounce(value)}
      spellcheck="false"
    />
    <label for="search">Suche nach Produkt oder ID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
  </div>
</article>
<br />

<style lang="scss">
</style>
