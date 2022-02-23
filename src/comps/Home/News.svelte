<script lang="ts">
  let toggle = false;

  const clickNews = () => {
    toggle = !toggle;
  };

  $: isVisible = toggle;
</script>

<details class="card small-padding" on:click={clickNews}>
  <summary>News (2)</summary>
  <div>
    {#if isVisible}
      <br />
      <a
        href="//www.noppensteinnews.de/2022/01/30/klemmbaustein-podcast-bluebrixx-watcher/"
        target="_blank"
        class="link medium-text"
      >
        Noppensteinnews: Klemmbaustein Podcast Bluebrixx Watcher
      </a>
      <iframe
        class="iframe--podcast"
        frameborder="0"
        title="Noppensteinnews: Klemmbaustein Podcast Bluebrixx Watcher"
        src="https://www.podcaster.de/webplayer/?id=show~eu4w2y~klemmbaustein-podcast-noppensteinnews~pod-17eb3227cb56870a92bfc2763&v=1645344640"
      />

      <a href="//www.youtube.com/watch?v=jgKitU73Zhk" target="_blank" class="link medium-text">
        Youtube: Count of Bricks - Der BlueBrixx Watcher - Eine Webseite für Verfügbarkeiten - Was kann der "Watcher"?
      </a>
      <div class="iframe--youtube">
        <iframe
          frameborder="0"
          title="Youtube: Count of Bricks - Der BlueBrixx Watcher - Eine Webseite für Verfügbarkeiten - Was kann der
              Watcher?"
          src="https://www.youtube.com/embed/jgKitU73Zhk"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        />
      </div>
    {/if}
  </div>
</details>

<style lang="scss">
  @import '../../scss/variables';

  .iframe--youtube {
    padding: $space-xl * 3;
    iframe {
      width: 100%;
      @media (min-width: 470px) {
        height: 380px;
      }
    }
  }
  .iframe--podcast {
    width: 100%;
    height: 450px;
    @media (min-width: 470px) {
      height: 380px;
    }
    @media (min-width: 720px) {
      height: 240px;
    }
    @media (min-width: 1024px) {
      height: 360px;
    }
    @media (min-width: 1060px) {
      height: 240px;
    }
  }
</style>
