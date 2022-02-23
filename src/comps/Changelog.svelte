<script>
  import Changelog from '../../public/CHANGELOG.md';
</script>

<details class="card">
  <summary>Changelog</summary>
  <Changelog />
  <a href="https://github.com/dutscher/bbx/blob/master/CHANGELOG.md" target="_blank" class="link">
    Die komplette Übersicht gibts hier >
  </a>
</details>

<style lang="scss">
  @import '../scss/variables';

  .card {
    :global a,
    :global p {
      color: var(--primary);
    }
  }
</style>
