<script>
    import inView from 'in-view';
    import { onMount, onDestroy } from 'svelte';
    import { fly } from 'svelte/transition';
        
    import incidents, {incidentItems} from '../stores/incidents';
    import { activeListItem, activeMapItem } from '../stores.js';
    import { activeCity } from '../consts.js';

    // Define the ref
    let listRef;

    /**
     * @see https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf
     */ 
    function debounce(callback, wait=500) {
        let timeout;
        return (...args) => {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(_ => callback.apply(context, args), wait);
        };
    }

    function initialize() {
        // Set a nicer offset so it's not a hard cutoff
        inView.offset(110);

        listRef.addEventListener('scroll', debounce(_=> {
            // Active list item is top-most fully-visible item
           const visibleListItems = Array.from(
                document.getElementsByClassName('list-item')
            ).map(inView.is);

            // If it's a new one, update active list item
            const topMostVisible = visibleListItems.indexOf(true);
            if (topMostVisible !== $activeMapItem) {
                activeMapItem.set(topMostVisible);
            }
        }, 500));
    }

    function setActiveMapItem(index) {
        activeMapItem.set(index);
    }

    // Update list scroll position when active list item is updated via map
    const unsubscribeActiveListItem = activeListItem.subscribe(newActiveListItem => {
        if (listRef) {
            const activeItem  =document.getElementById(
                `list-item-${newActiveListItem}`
            );

            listRef.scrollTop = activeItem.offsetTop;
        }
    });

    let page = 1;

    function goNext() {
        page++;
		incidents.listItems(activeCity.name, {page, size:200});
    }

    function goPrev(){
        page--;
		incidents.listItems(activeCity.name, {page, size:200});
    }

    /**
     * Livecycle handler, register map on first
     * render.
     */ 
    onMount(initialize);

    /**
     * Remove listener on unmount
     */ 
    onDestroy(unsubscribeActiveListItem);

    let visible = false;

    $: visible = $incidentItems && $incidentItems.length;
</script>

<style>
    #list-items {
        display: flex;
        flex-wrap: wrap;
        overflow: scroll;
    }

    .list-item {
        /* font-family: Helvetica, Arial, sans-serif;
        font-size: 1.2em;
        line-height: 1.5em; */
        width: 100%;
        margin: 0px 40px 0px 40px;
        border-bottom: #ccc solid 1px;
    }

    .list-item.active { 
        background-color: #ff3377;
    }

    .list-item .description {
        font-size: 1.2em;
    }

    .head {
        position: -webkit-sticky;
        position: sticky;
        top: 0;
        background:#fff;
        width: 100%;
        align-self: flex-start;
    }
    .title {
        margin: 30px 40px;
    }

    .loader {
        margin: 30px 40px;
    }

    .tail {
        margin: 20px 40px;
        padding-bottom: 40px;
    }

    .pagination {
        /* position: absolute; */
        position: -webkit-sticky;
        position: sticky; 
        bottom: 0px;
        height: 40px;
        width:100%;
        background-color:#232332;
        padding: 20px 40px;
    }

    h5 {
        font-family: Helvetica, Arial, sans-serif;
        text-transform: capitalize;
    }
</style>

<div id="list-items" bind:this="{listRef}">
  
  <div class="head">
    <div class="title">
        <h2>Overwatch: Sacramento</h2>
    </div>
  </div>

{#if $incidentItems && $incidentItems.length}
  {#each $incidentItems as listItem, index}
    <div on:click={_=>setActiveMapItem(index)} class="list-item {$activeMapItem === index ? 'active': ''}" id="list-item-{index}">
        <div>
            <span class="description">{listItem.description}</span>
        </div>
        Reported on <span>{listItem.date} At {listItem.address}</span>
    </div>
  {/each}
{:else}
    <div class="loader">Loading...</div>
{/if}

  <div class="tail">
    <i>
      List of crimes reported in Sacramento during 01/01/06 and 01/02/06
    </i>
  </div>

{#if visible}
  <div class="pagination" transition:fly="{{ y: 40, duration: 600 }}">
    <button on:click={goPrev}>Prev</button>
    <button on:click={goNext}>Next</button>
  </div>
{/if}

</div>
