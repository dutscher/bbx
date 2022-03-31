<script lang="ts">
  import { storedGlobalData } from '../../../stores/global-data';

  export let product: any;

  let data: any;

  storedGlobalData.subscribe(store => (data = store));

  const openInstHref = pdfLink => {
    let url;
    if (pdfLink.includes('http')) {
      url = pdfLink;
    } else {
      url = data.instUrl + pdfLink;
    }
    window.open(url);
  };

  // /101/101857%20Das%20Schwarze%20Auge,%20Thowaler%20Drachenschiff,%20Otta%20(45MB).pdf
  // https://www.bluebrixx.com/data/files/manuals/103/103272%20Nimitz%20Teil%202%20(26MB).pdf
  const getInstLabel = str => {
    let strReturn = '';
    const defaultLabel = 'Download';
    const foundSize = str.match(/\((\d*MB)\)/);
    const foundPart = str.match(/Teil(%20| )(\d{1})/);
    const foundUnit = str.match(/Unit (\d{1,2})/);
    if (foundSize || foundPart || foundUnit) {
      if (foundUnit) {
        strReturn = 'Unit ' + foundUnit[1] + (foundSize ? ' - ' + foundSize[1] : '');
      } else if (foundPart) {
        strReturn = 'Teil ' + foundPart[2] + (foundSize ? ' - ' + foundSize[1] : '');
      } else {
        strReturn = foundSize[1];
      }
    } else {
      strReturn = defaultLabel;
    }
    return strReturn;
  };
</script>

{#if Array.isArray(product.inst)}
  {#each product.inst as inst}
    <a class="inst-link link" target="_blank" href="https://www.bluebrixx.com/de/inst#{product.id}">
      <i on:click={() => openInstHref(inst)}>article</i>
      {getInstLabel(inst)}
    </a>
  {/each}
{:else}
  <a class="inst-link link" target="_blank" href="https://www.bluebrixx.com/de/inst#{product.id}">
    <i on:click={() => openInstHref(product.inst)}>article</i>
    {getInstLabel(product.inst)}
  </a>
{/if}

<!--
&nbsp;|&nbsp;
<a class="partlist-link link" href="https://api.bbx.watch/tool/partlist/{product.id}.pdf" target="_blank">
  <i>checklist_rtl</i>
  <div class="tooltip bottom">Teileliste</div>
</a>
-->
<style lang="scss">
  .inst-link {
    i {
      cursor: default;
    }
  }
</style>
