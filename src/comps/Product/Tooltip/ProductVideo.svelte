<script lang="ts">
  let className = '';
  export { className as class };
  export let src: string;
  export let width: string = '100%';
</script>

<iframe
  class={className}
  {src}
  {width}
  title="YouTube video player"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
/>
