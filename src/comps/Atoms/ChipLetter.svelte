<script>
  export let letter = '';
  export let color = 'tertiary';
</script>

<div class="chip__letter">
  <p class={color}>{letter}</p>
</div>

<style lang="scss">
  @import '../../scss/variables';

  .chip__letter {
    border: 2rem solid transparent;
    box-sizing: border-box;
    object-fit: cover;
    object-position: center;
    width: 32rem;
    height: 100%;
    margin-left: -16rem;

    p {
      width: 100%;
      height: 100%;
      margin: 0;
      border-radius: 100%;
      background-color: var(--secondary);
      text-align: center;
      line-height: 25rem;

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        border-radius: inherit;
        width: 100%;
        height: 100%;
        background-position: center;
        background-image: radial-gradient(circle, rgba(255, 255, 255, 0.4) 1%, transparent 1%);
        opacity: 0;
        transition: none;
        will-change: background-size;
      }
    }
  }
</style>
