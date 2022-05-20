<script>
  import Changelog from '../../../public/CHANGELOG.md';
</script>

<details class="card small-padding" open>
  <summary><b>Changelog</b></summary>
  <Changelog />
  <a href="https://github.com/dutscher/bbx/blob/master/CHANGELOG.md" target="_blank" class="link">
    Die komplette Übersicht gibts hier >
  </a>
</details>

<style lang="scss">
  .card {
    :global a,
    :global p {
      color: var(--primary);
    }
    :global ul {
      margin-bottom: 8rem;
      padding-left: 32rem;
    }
  }
</style>
