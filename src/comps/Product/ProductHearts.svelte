<script lang="ts">
  import { lsKeyHeart, localStore, storedHearts } from '../../stores';
  import ClickOutside from 'svelte-click-outside';
  import { stopClick } from '../../utils';

  export let product: any;
  let isActive: boolean = false;
  let isHeart: boolean = false;
  let isHover: boolean = false;
  let mouseOver: boolean = false;
  let hearts: any;
  let heartLists: any;
  let editList: string = '';
  let editValue: string = '';
  let newValue: string = '';
  let input: any;

  storedHearts.subscribe(store => {
    hearts = store;
    heartLists = Object.keys(hearts);
  });

  const clickHeart = forceClose => {
    isActive = forceClose ? false : !isActive;

    if (!isActive) {
      editList = '';
      editValue = '';
    }

    if (isActive && heartLists.length === 1) {
      clickHandleList(heartLists[0]);
    }
  };

  const clickHandleList = listName => {
    storedHearts.update(store => {
      if (!(listName in store)) {
        store[listName] = { t: listName, i: [] };
      }

      if (!store[listName].i.includes(product.id)) {
        store[listName].i.push(product.id);
      } else {
        store[listName].i = store[listName].i.filter(pid => pid !== product.id);
      }

      localStore.set(lsKeyHeart, JSON.stringify(store));

      return store;
    });
  };

  const clickEditList = (e, listName, title) => {
    stopClick(e);

    editList = listName;
    editValue = title;

    setTimeout(() => {
      input.focus();
      input.select();
    }, 50);
  };

  const handleEditList = () => {
    storedHearts.update(store => {
      if (!(editValue in store)) {
        store[editList].t = editValue;
      }
      editList = '';
      editValue = '';
      localStore.set(lsKeyHeart, JSON.stringify(store));
      return store;
    });
  };

  const handleNewList = () => {
    storedHearts.update(store => {
      if (!(newValue in store)) {
        store[newValue.toLowerCase()] = { t: newValue, i: [product.id] };
      }

      newValue = '';
      localStore.set(lsKeyHeart, JSON.stringify(store));
      return store;
    });
  };

  const onKeyDown = e => {
    if (e.key === 'Escape') {
      newValue = '';
    }
  };

  const onKeyPress = (e, listName) => {
    if (e.key === 'Enter') {
      if (!!listName) handleEditList();
      else handleNewList();
    }
  };

  const onClickOutside = () => {
    clickHeart(true);
  };

  const onMouseOver = () => {
    mouseOver = true;
  };

  const onMouseOut = () => {
    mouseOver = false;
  };

  $: isHeart = heartLists.find(list => hearts[list].i.includes(product.id)) || false;
  $: isHover = mouseOver;
</script>

<div class="hearts{isActive ? ' active' : ''}">
  <ClickOutside on:clickoutside={onClickOutside}>
    <i
      on:click={() => /* keep this due param forceClose instead of event */ clickHeart()}
      on:focus={onMouseOver}
      on:mouseover={onMouseOver}
      on:mouseout={onMouseOut}
      on:blur={onMouseOut}
      class="trigger{isHeart || isHover ? ' red-text' : ''}"
    >
      {isHeart || isHover ? 'favorite' : 'favorite_border'}
    </i>
    <div class="hearts__flyout border small-padding absolute surface">
      {#each heartLists as listName}
        <div class="hearts__list">
          <i
            on:click={() => clickHandleList(listName)}
            class={hearts[listName].i.includes(product.id) ? 'red-text' : 'black-text'}
          >
            {hearts[listName].i.includes(product.id) ? 'favorite' : 'favorite_border'}
          </i>
          {#if editList !== listName}
            <i on:click={e => clickEditList(e, listName, hearts[listName].t)} class="black-text">edit</i>
            <span>{hearts[listName].t}</span>
          {:else}
            <input
              type="text"
              bind:this={input}
              on:keydown={onKeyDown}
              on:keypress={e => onKeyPress(e, listName)}
              bind:value={editValue}
            />
          {/if}
        </div>
      {/each}
      <div class="hearts__list hearts__list--new">
        <i class="black-text">add</i>
        <input type="text" placeholder="Neue Liste" on:keypress={onKeyPress} bind:value={newValue} />
      </div>
    </div>
  </ClickOutside>
</div>

<style lang="scss">
  @import '../../scss/variables';

  .trigger {
    top: -2rem;
  }

  .hearts {
    display: inline-block;
    line-height: 26rem;
    margin-right: 8rem;

    i {
      cursor: pointer;
    }

    &__flyout {
      z-index: 1;
      top: -9rem;
      left: -9rem;
      border-radius: 8rem;
      display: none;
      color: var(--on-surface-variant);

      .active & {
        display: block;
      }
    }

    &__list {
      display: flex;

      span {
        margin: 0 $space-lg;
        flex: 1;
      }

      input {
        width: 100rem;
        border: solid 1rem var(--on-surface-variant);
        border-radius: 4rem;
        flex: 1;
      }
    }
  }
</style>
