<script>
    import {filters} from '../stores/filters';
    import incidents from '../stores/incidents';
    import {categories} from '../consts';

    import Tags from './Tags.svelte'

    /**
     * We want to use TAB, ENTER, and COMMA
     */ 
    let addKeys = [9,13,188];

    function handleTagProperties(e) {
        let tags = e.detail.tags;
        $filters = tags;
    }
    //on:keyup={handleKeyup}
    function handleKeyup(e) {
        if(event.keyCode !== 13) return;
        const value = e.target.value.trim().toLowerCase();
        
        if(value === '') $filters = [];

        if(categories.indexOf(value) > -1 && $filters.indexOf(value) === -1) {
            $filters = [...$filters, value];
        }
    }

    const unsubscribeFilters = filters.subscribe(newFilters => {
        const onLoadQuery = { page: 1, size: 200 };
        
        if(newFilters && newFilters.length > 0) {
            onLoadQuery.where = {codeLabel: newFilters};
        }
        // const onLoadQuery = { page: 1, size: 200, where: {codeLabels: $filters} };
        incidents.listItems('sacramento', onLoadQuery);
    });

</script>

<style>
.filter-ctrl {
    position: absolute;
    top: 10px;
    margin-left: 10px;
    /* right: 50px; */
    z-index: 1;
}
/* 
.filter-ctrl input[type='text'] {
    font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
    width: 100%;
    border: 0;
    background-color: #fff;
    margin: 0;
    color: rgba(0, 0, 0, 0.5);
    padding: 10px;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    width: 180px;
}*/
</style>

<div class="filter-ctrl">
    <!-- <input  id="filter-input"
            on:keypress={handleKeyup}
            type="text"
            name="filter"
            placeholder="Filter by name"
    /> -->



    <Tags   {addKeys} 
            onlyUnique={true} 
            autoComplete={categories} 
            on:tags={handleTagProperties}
            placeholder="Filter by category"
            />
</div>