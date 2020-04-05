<script>
  	import Map from './components/Map.svelte';
  	import List from './components/List.svelte';
</script>

<style>
  .container {
    height: 100vh;
    display: flex;
  }

  .pane {
    display: flex;
    flex-direction: column;
    max-height: 100vh;
  }

  .left {
    align-items: center;
    width: 30%;
    justify-content: center;
  }

  .right {
    justify-content: space-between;
    width: 70%;
  }
</style>

<div class="container">
  <div class="pane left">
    <List />
  </div>
  <div class="pane right">
    <Map />
  </div>
</div>
