<script>
    import inView from 'in-view';
    import { onMount, onDestroy } from 'svelte';
    import { fly, fade } from 'svelte/transition';
    
    import Header from './Header.svelte';

    import incidents, {incidentItems, error} from '../stores/incidents';
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

        // listRef.addEventListener('scroll', debounce(_=> {
        //     // Active list item is top-most fully-visible item
        //    const visibleListItems = Array.from(
        //         document.getElementsByClassName('list-item')
        //     ).map(inView.is);

        //     // If it's a new one, update active list item
        //     const topMostVisible = visibleListItems.indexOf(true);
        //     if (topMostVisible !== $activeMapItem) {
        //         activeMapItem.set(topMostVisible);
        //     }
        // }, 500));
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

    .list-item-wrapper {
        width: 100%;
        border-left: 1px solid #f6f6fc;
        border-bottom: #ccc solid 1px;
        cursor: pointer;
    }

    .list-item-wrapper.active { 
        border-left: 4px solid #ff3377;
        transition: border-width 0.2s ease-out;
    }

    .list-item {
        /* font-family: Helvetica, Arial, sans-serif;
        font-size: 1.2em;
        line-height: 1.5em; */
        margin: 0px 40px 0px 40px;
        padding-top: 8px;
        padding-bottom: 12px;
        display: flex;
        flex-direction: column;
    }

    .list-item .description {
        font-size: 1.2em;
        line-height: 1.3em;
        padding-bottom: 8px;
    }

    .list-item .meta {
        font-size: 0.9em;
        line-height: 1em;
    }

    .error,
    .loader {
        margin: 30px 40px;
    }

    .error {
        color: #f14668;
        font-weight: 700;
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
        background-color:#252529;
        padding: 20px 40px;
    }

    .pagination > button:first-child {
        margin-right: 4%;
    }

    .pagination > button {
        width: 46%;
    }
</style>

<div id="list-items" bind:this="{listRef}">
  
  <Header doAnimate={!visible}/>

{#if $incidentItems && $incidentItems.length}
  {#each $incidentItems as listItem, index}
    <div on:click={_=>setActiveMapItem(index)} class="list-item-wrapper {$activeMapItem === index ? 'active': ''}" id="list-item-{index}" transition:fly="{{ y: 60, duration: 400 }}">
        <div class="list-item">
            <span class="description">{listItem.description}</span>
            <div class="meta">
                <small>Reported on </small><span class="date">{listItem.date}</span> <small>At</small> <span class="address">{listItem.address}</span>
            </div>
        </div>
    </div>
  {/each}
{:else}
    {#if $error}
        <div class="error">{@html $error}</div>
    {:else}
        <div class="loader">Loading...</div>
    {/if}
{/if}

  <div class="tail">
    <p>Project by Emiliano Burgos a.k.a <a href="https://github.com/goliatone" target="_blank">goliatone</a></p>
    <p>Read more in the <a href="/about" target="_blank">about page</a></p>
    <i>List of crimes reported in Sacramento during 01/01/06 and 01/02/06.</i>
  </div>

{#if visible}
  <div class="pagination" transition:fly="{{ y: 40, duration: 600 }}">
    <button on:click={goPrev}>Prev</button>
    <button on:click={goNext}>Next</button>
  </div>
{/if}

</div>
