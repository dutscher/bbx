<script lang="ts">
  import { onMount } from 'svelte';
  import { storedActiveSelection, storedTags } from '../../stores';
  import { getUrlParam, setUrlParams } from '../../utils';
  import { ID_MANHATTAN, ID_MOVIE, ID_NETHERLAND, ID_PARTS, IDS_SPECIAL_TAGS } from '../../_interfaces';

  export let activeTagIds: any = [];

  let tags: any;
  const abc = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
  const urlParam = 'tags';

  storedTags.subscribe(store => (tags = store));

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

  onMount(() => {
    getUrlParams();
  });

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
      'chip secondary small',
      activeTagIds.includes(tag.id) && 'active',
      IDS_SPECIAL_TAGS.includes(tag.id) && 'highlight',
      isFirst && 'new-letter',
    ]
      .filter(css => !!css)
      .join(' ');
</script>

<details class="card">
  <summary class="small-margin">Tags</summary>
  <div class="flex flex--gap flex--wrap bl">
    {#each sortedAbcTags as abc}
      {#each abc.sortedTags as tag, index}
        <span
          class={getClasses(tag, index === 0, activeTagIds)}
          on:click={() => clickTag(tag, true)}
          data-id={tag.id}
        >
          {#if index === 0}
            <div class="chip__letter">
              <p class="tertiary">{abc.letter}</p>
            </div>
          {/if}
          {tag.name}
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
    gap: 10px;

    &:hover,
    &.active {
      outline: 2px solid $color-primary-darker;
    }

    &.disabled {
      opacity: 0.1;
      cursor: default;
    }

    &__letter {
      border: 2rem solid transparent;
      box-sizing: border-box;
      object-fit: cover;
      object-position: center;
      width: 32rem;
      height: 100%;
      border-radius: 8rem;
      margin-left: -16rem;

      p {
        width: 100%;
        height: 100%;
        margin: 0;
        border-radius: 8rem;
        background-color: var(--secondary);
        text-align: center;
        line-height: 25rem;

        &::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
          border-radius: inherit;
          width: 100%;
          height: 100%;
          background-position: center;
          background-image: radial-gradient(circle,rgba(255,255,255,.4) 1%,transparent 1%);
          opacity: 0;
          transition: none;
          will-change: background-size;
        }
      }
    }
  }
</style>
