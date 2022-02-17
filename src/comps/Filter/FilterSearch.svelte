<script lang="ts">
  import { onMount } from 'svelte';
  import { storedActiveSelection } from '../../stores';
  import { getUrlParam, setUrlParams } from '../../utils';

  export let activeSearchString: any = '';

  const urlParam = 'search';

  const getUrlParams = () => {
    // ?tags=piraten
    const queryTags = getUrlParam(urlParam);
    activeSearchString = queryTags;
    onInput();
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
    ui();
    getUrlParams();
  });
</script>

<div class="row">
  <div class="col s12">
    <div class="field label prefix border">
      <i>search</i>
      <input
        class="search"
        type="search"
        value={activeSearchString}
        on:input={({ target: { value } }) => checkInput(value)}
        on:keyup={({ target: { value } }) => debounce(value)}
        spellcheck="false"
      />
      <!--               bind:value={activeSearchString}-->
      <!--               on:input={() => onInput(true)}-->
      <label>Suche</label>
      <span class="helper">Produktname oder ID</span>
    </div>
  </div>
</div>

<style lang="scss">
</style>
