<script>
    import inView from 'in-view';
    import { onDestroy } from 'svelte';
    import { fly, fade } from 'svelte/transition';
    
    import Header from './Header.svelte';
    import debounce from '../utils/debounce';
    import incidents, {incidentItems, error, metadata} from '../stores/incidents';
    import { activeListItem, activeMapItem } from '../stores.js';
    import { activeCity } from '../consts.js';

    import pagination, {currentPage, totalPages, totalItems, currentItems, itemsPerPage} from '../stores/pagination';

    let listRef;

    // Update list scroll position when active list item is updated via map
    const unsubscribeActiveListItem = activeListItem.subscribe(newActiveListItem => {
        if (listRef) {
            const activeItem  =document.getElementById(
                `list-item-${newActiveListItem}`
            );
            listRef.scrollTo({
                top: activeItem.offsetTop - 130,
                behavior: 'smooth'
            });
        }
    });
    //TODO: Implement infinite scroll https://github.com/andrelmlins/svelte-infinite-scroll
    function setActiveMapItem(index) {
        activeMapItem.set(index);
    }

    /**
     * Remove listener on unmount
     */ 
    onDestroy(unsubscribeActiveListItem);

    let visible = false;

    $: visible = $incidentItems && $incidentItems.length;
    $: pagination.update($metadata);
    $: incidents.listItems(activeCity.name, {page: $currentPage, size:200});
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
        padding-top: 16px;
        padding-bottom: 14px;
        display: flex;
        flex-direction: column;
    }

    .list-item .description {
        font-size: 1.2em;
        line-height: 1.3em;
        padding-bottom: 8px;
    }

    .list-item .meta {
        font-size: 0.8em;
        font-weight: 400;
        line-height: 1.4em;
    }

    .list-item .meta small {
        font-weight: bold;
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

    .footer {
        /* position: absolute; */
        position: -webkit-sticky;
        position: sticky; 
        bottom: 0px;
        height: 40px;
        width:100%;
        background-color:#252529;
        padding: 20px 40px;
    }

    .pagination {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        max-width: 300px;
        margin: 0 auto;
    }

    .pagination > button {
       font-size: 12px;
       padding: 4px 10px;
    }
    .pagination .count {
        color: #f6f6fc;
        font-weight: 700;
        font-size: 12px;
        line-height: 25px;
    } 
</style>

<div id="list-items" bind:this="{listRef}">
  
  <Header doAnimate={!visible}/>

{#if $incidentItems && $incidentItems.length}
  {#each $incidentItems as listItem, index}
    <div on:click={_=>setActiveMapItem(index)} class="list-item-wrapper {listItem.codeLabel} {$activeMapItem === index ? 'active': ''}" id="list-item-{index}" transition:fly="{{ y: 60, duration: 400 }}">
        <div class="list-item">
            <span class="description">{listItem.description}</span>
            <div class="meta">
                <small>Reported on </small><span class="date">{listItem.date}</span> <small>At</small> <span class="address">{listItem.address}</span>
            </div>
            <span class="tag code">{listItem.codeLabel}</span>
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
  <div class="footer" transition:fly="{{ y: 40, duration: 600 }}">
    <div class="pagination">
        <button on:click={pagination.first}>First</button>
        <button on:click={pagination.prev}>Prev</button>
        <div class="count">
            <span>{$currentPage}</span> of <span>{$totalPages}</span>
        </div>
        <button on:click={pagination.next}>Next</button>
        <button on:click={pagination.last}>Last</button>
    </div>
  </div>
{/if}

</div>
