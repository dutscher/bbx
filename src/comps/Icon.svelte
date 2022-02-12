<script lang="ts">
  export let modifier: string = '';
  export let title: string = '';
  let className = '';
  export { className as class };
  export let svg: boolean = false;
  import Cross from '../../public/images/icon-cross.svg';
  import Arrow from '../../public/images/icon-arrow.svg';
  import Heart from '../../public/images/icon-heart.svg';
  import Edit from '../../public/images/icon-edit.svg';
  import Delete from '../../public/images/icon-delete.svg';

  $: modifierClasses = modifier
    .split(' ')
    .map(modifier => `icon--${modifier}`)
    .join(' ');
</script>

{#if svg}
  <span on:click class="icon icon--svg {modifierClasses}{!!className ? ' ' + className : ''}" {title}>
    {#if modifier.includes('cross')}
      <Cross width="1em" height="1em" />
    {/if}
    {#if modifier.includes('arrow')}
      <Arrow width="1em" height="1em" />
    {/if}
    {#if modifier.includes('heart')}
      <Heart width="1em" height="1em" />
    {/if}
    {#if modifier.includes('edit')}
      <Edit width="1em" height="1em" />
    {/if}
    {#if modifier.includes('delete')}
      <Delete width="1em" height="1em" />
    {/if}
  </span>
{:else}
  <i on:click class="icon icon--bg {modifierClasses}{!!className ? ' ' + className : ''}" {title} />
{/if}

<style lang="scss">
  @import '../scss/variables';

  $selector: '.icon';
  #{$selector} {
    vertical-align: middle;
    cursor: pointer;
    line-height: 0;

    &--bg {
      &::after {
        display: inline-block;
        content: '';
        background-size: contain;
        background-repeat: no-repeat;
        padding: 8px;
        transition: transform ease-in-out 150ms;
      }
    }

    &--manual::after {
      background-image: url('../images/icon-manual.svg');
    }

    &--cart::after {
      background-image: url('../images/icon-cart.svg');
    }

    &--new::after {
      background-image: url('../images/icon-new.svg');
    }

    &--flame::after {
      background-image: url('../images/icon-flame.svg');
    }

    &--edit::after {
      background-image: url('../images/icon-edit.svg');
    }

    &--delete::after {
      background-image: url('../images/icon-delete.svg');
    }

    &--arrow {
      &::after {
        background-image: url('../images/icon-arrow.svg');
      }

      &#{$selector}--svg {
        color: $color-primary;

        &:hover {
          color: $color-primary-darker;
        }
      }

      &#{$selector}--svg {
        font-size: ms(0);
      }
    }

    &--cross {
      &::after {
        background-image: url('../images/icon-cross.svg');
      }

      &#{$selector}--svg {
        color: $color-primary;

        &:hover {
          color: $color-primary-darker;
        }
      }
    }

    &--heart {
      &::after {
        background-image: url('../images/icon-heart.svg');
      }
    }

    &--left {
      &::after,
      :global(&#{$selector}--svg svg) {
        transform: rotate(180deg);
      }
    }

    &--down {
      &::after,
      :global(&#{$selector}--svg svg) {
        transform: rotate(90deg);
      }
    }

    &--up {
      &::after,
      :global(&#{$selector}--svg svg) {
        transform: rotate(-90deg);
      }
    }
  }

  :global(#{$selector}--svg svg) {
    transition: transform ease-in-out 150ms;
  }

  :global(#{$selector}--heart#{$selector}--svg path) {
    stroke-width: 5px;
    stroke: $color-white;
  }

  :global(#{$selector}--heart#{$selector}--svg:not(.active) path) {
    fill: none;
  }

  :global(#{$selector}--heart#{$selector}--svg:not(.active):hover path) {
    fill: #c4262f;
  }

  :global(#{$selector}--heart#{$selector}--svg.active) {
    color: #c4262f;

    &:hover {
      color: #780e14;
    }
  }

  :global([data-theme='dark'] #{$selector}--arrow#{$selector}--svg) {
    color: $color-white;

    &:hover {
      color: $color-primary;
    }
  }
</style>
