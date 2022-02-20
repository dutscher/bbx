<script>
  import Changelog from '../../public/CHANGELOG.md';
</script>

<details class="card">
  <summary>Changelog</summary>
  <Changelog />
  <a href="https://github.com/dutscher/bbx/blob/master/CHANGELOG.md" target="_blank">
    Die komplette Übersicht gibts hier >
  </a>
</details>

<style lang="scss">
  @import '../scss/variables';

  .card {
    :global a,
    :global p {
      color: $color-primary;
    }
  }
</style>
