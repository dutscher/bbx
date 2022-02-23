<script lang="ts">
  export let name;
  export let activePage;
  export let isActive;
</script>

<div class="page padding {isActive(name, activePage)}">
  <div class="container max">
    <div class="row">
      <div class="col s12">
        <slot />
      </div>
    </div>
  </div>
</div>
