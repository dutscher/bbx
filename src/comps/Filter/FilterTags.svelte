<script lang="ts">
  import { onMount } from 'svelte';
  import { storedActiveSelection, storedTags } from '../../stores';
  import { getUrlParam, setUrlParams, stopClick } from '../../utils';
  import { IDS_SPECIAL_TAGS } from '../../_interfaces';
  import ChipLetter from '../Atoms/ChipLetter.svelte';

  export let activeTagIds: any = [];

  let tags: any;
  let isOpen = false;
  const abc = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
  const urlParam = 'tags';

  storedTags.subscribe(store => (tags = store));

  storedActiveSelection.subscribe(store => {
    console.log(store.page, store.reason);
    if (store.page === 'products' && store.reason === 'show-tags') {
      isOpen = true;
      // remove reason
      storedActiveSelection.update(store => {
        store.reason = '';
        return store;
      });
    }
  });

  const getUrlParams = () => {
    // ?tags=piraten
    const queryTags = getUrlParam(urlParam).split(',');
    tags.map(tag => {
      queryTags.map(queryTag => {
        if (tag.seoName === queryTag) {
          clickTag(tag);
        }
      });
    });
  };

  const clickTag = (tag, withUrlUpdate?) => {
    storedActiveSelection.update(store => {
      if (!(urlParam in store)) {
        store[urlParam] = [];
      }
      if (!store[urlParam].includes(tag.id)) {
        store[urlParam].push(tag.id);
      } else {
        store[urlParam] = store[urlParam].filter(tagId => tagId !== tag.id);
      }

      if (withUrlUpdate) {
        setUrlParams(
          urlParam,
          tags.filter(tag => store[urlParam].includes(tag.id)).map(tag => tag.seoName)
        );
        store.reason = 'tag-clicked';
      } else {
        store.reason = 'url-parsed';
      }

      return store;
    });
  };

  const sortedTags = tags.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

  const sortedAbcTags = abc.map(letter => {
    return {
      letter,
      sortedTags: sortedTags.filter(tag => tag.count > 0).filter(tag => tag.name.toUpperCase().startsWith(letter)),
    };
  });

  const getClasses = (tag, isFirst, activeTagIds) =>
    [
      'chip small round no-margin',
      activeTagIds.includes(tag.id) && 'active',
      IDS_SPECIAL_TAGS.includes(tag.id) ? 'grey7' : 'secondary',
      isFirst && 'new-letter',
    ]
      .filter(css => !!css)
      .join(' ');

  const clickToggle = event => {
    stopClick(event);
    isOpen = !isOpen;
  };

  $: openAttribute = isOpen;

  onMount(() => {
    getUrlParams();
  });
</script>

<details class="card small-padding" open={openAttribute} on:click={clickToggle}>
  <summary>Tags</summary>
  <div class="flex flex--gap flex--wrap">
    {#each sortedAbcTags as abc}
      {#each abc.sortedTags as tag, index}
        <span class={getClasses(tag, index === 0, activeTagIds)} on:click={() => clickTag(tag, true)} data-id={tag.id}>
          {#if index === 0}
            <ChipLetter letter={abc.letter} />&nbsp;
          {/if}
          {tag.name}&nbsp;
          <span class="chip_state">{tag.count}</span>
        </span>
      {/each}
    {/each}
  </div>
</details>

<style lang="scss">
  @import '../../scss/variables';

  .chip {
    cursor: pointer;
    user-select: none;

    &:hover,
    &.active {
      outline: 2px solid $color-primary-darker;
    }

    &.disabled {
      opacity: 0.1;
      cursor: default;
    }
  }
</style>
