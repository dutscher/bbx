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
      on:click={() => clickHeart()}
      on:focus={onMouseOver}
      on:mouseover={onMouseOver}
      on:mouseout={onMouseOut}
      on:blur={onMouseOut}
      class="trigger{isHeart || isHover ? ' red-text' : ''}"
    >
      {isHeart || isHover ? 'favorite' : 'favorite_border'}
    </i>
    <div class="hearts__flyout">
      {#each heartLists as listName}
        <div class="hearts__list">
          <i
            on:click={() => clickHandleList(listName)}
            class={hearts[listName].i.includes(product.id) ? 'red-text' : ''}
          >
            {hearts[listName].i.includes(product.id) ? 'favorite' : 'favorite_border'}
          </i>
          {#if editList !== listName}
            <i on:click={e => clickEditList(e, listName, hearts[listName].t)}>edit</i>
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
        <i>add</i>
        <input type="text" placeholder="Neue Liste" on:keypress={onKeyPress} bind:value={newValue} />
      </div>
    </div>
  </ClickOutside>
</div>

<style lang="scss">
  @import '../../scss/variables';

  .trigger {
    position: relative;
    top: -2px;
  }

  .hearts {
    position: relative;
    display: inline-block;

    &__flyout {
      color: $color-black;
      position: absolute;
      z-index: 1;
      top: -2px;
      left: -4px;
      background: $color-white;
      border-radius: $border-radius-lg;
      padding: $space-lg;
      display: none;

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
        width: 100px;
        border-radius: $border-radius;
        margin-bottom: 5px;
        flex: 1;
      }

      &--new {
        i {
          margin-right: 2px;
        }
      }
    }
  }
</style>
