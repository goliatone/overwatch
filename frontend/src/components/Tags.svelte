<script>
    import {createEventDispatcher} from 'svelte';

    const dispatch = createEventDispatcher();
    let tag;
    let arrelementsmatch = [];

    export let inputEl = {};

    export let tags;
    export let addKeys;
    export let maxTags;
    export let onlyUnique;
    export let removeKeys;
    export let placeholder;
    export let allowPaste;
    export let allowDrop;
    export let splitWith;
    export let autoComplete;

    /**
     * More here https://keycode.info/
     */ 
    const CODES = {
        BACKSPACE: 8,
        TAB: 9,
        ENTER:13,
        COMMA: 188,
    };

    $: tags = tags || [];
    $: addKeys = addKeys || false;
    $: maxTags = maxTags || false;
    $: onlyUnique = onlyUnique || false;
    $: removeKeys = removeKeys || false;
    $: placeholder = placeholder || '';
    $: allowPaste = allowPaste || false;
    $: allowDrop = allowDrop || false;
    $: splitWith = splitWith || ',';
    $: autoComplete = autoComplete || false;

    function _trimTrailing(word, char=',') {
        return word.substring(0, word.length - 1);
    }

    function setTag(event) {
        const keyCode = event.keyCode;
        const currentTag = event.target.value;

        //On ENTER press we add the tag
        if(keyCode === CODES.ENTER) {
            addTag(currentTag);
        }

        //If we BACKSPACE when there's no text then remove previous tag
        if(keyCode === CODES.BACKSPACE && tag === '') {
            tags.pop();
            tags = tags;

            dispatchEvent('tags', {tags});
        }

        /**
         * We can add tags by:
         * - type tag + hitting ENTER
         * - type tag + hitting TAB
         * - type tag + typing "," between tags
         * - type tag + typing random key added to addKeys[]
         */ 
        if(Array.isArray(addKeys)) {
            addKeys.forEach(key => {
                if(key !== keyCode) return;
                switch (keyCode) {
                    case CODES.COMMA:
                        /**
                         * We want to remove the trailing comma before
                         * we add the word as a tag
                         */ 
                        addTag(_trimTrailing(currentTag, ','))
                        break;
                    case CODES.TAB:
                        event.preventDefault();
                        addTag(currentTag);
                        break;
                    default:
                        addTag(currentTag);
                        break;

                }
            });
        }

        if(Array.isArray(removeKeys)) {
            removeKeys.forEach(key => {
                if(key !== keyCode) return;
                tags.pop();
                tags = tags;
                tag = '';

                dispatch('tags', {tags});
            });
        }
    }

    function addTag(currentTag='') {
        currentTag = currentTag.trim();
        if(!currentTag) return;
        
        //TODO: We might want to move this to a function where we check
        if(maxTags && tags.length === maxTags) return;

        if(onlyUnique &&tags.includes(currentTag)) return;

        tags.push(currentTag);
        tags = tags;
        tag = '';

        dispatch('tags', {tags});
    }

    function removeTag(i) {
        tags.splice(i, 1);
        tags = tags;

        dispatch('tags', {tags});
    }

    /**
     * Handle pasting a string on tags in our field
     * https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event
     */ 
    function onPaste(e) {
        if(!allowPaste) return;
        e.preventDefault();
        const data = getClipboardData(e);
        const tags = splitTags(data).forEach(addTag);
    }

    function onDrop(e) {
        if(!allowDrop) return;
        e.preventDefault();

        const data = e.dataTransfer.getData('text');
        const tags = splitTags(data).forEach(addTag);
    }

    function getClipboardData(e) {
        if(window && window.clipboardData) {
            return window.clipboardData.getData('text');
        }
        if(e.clipboardData) {
            return e.clipboardData.getData('text/plain');
        }
        return '';
    }

    function splitTags(data) {
        if(!data) return []
        return data.split(splitWith).map(t=>t.trim());
    }

    function getMatchElements(e) {
        if(!Array.isArray(autoComplete)) return;

        let x = e.target.value;
        if(!x) return arrelementsmatch = [];

        let matchs = autoComplete.filter(e => {
            return e.toLowerCase().includes(e.toLowerCase());
        });

        arrelementsmatch = matchs;
    }

</script>

<div class="svelte-tags-input-layout">
    {#if tags.length > 0}
        {#each tags as tag, i}
            <span class="svelte-tags-input-tag">{tag}</span>
            <span class="svelte-tags-input-tag-remove" on:click={_=>removeTag(i)}>x</span>
        {/each}
    {/if}
    <input  type="text"
            bind:this={inputEl}
            bind:value={tag} 
            on:keydown={setTag} 
            on:keyup={getMatchElements}
            on:paste={onPaste}
            on:drop={onDrop}
            class="svelte-tags-input"
            placeholder={placeholder}
            contenteditable="true"
    >
</div>

{#if autoComplete && arrelementsmatch.length > 0}
    <ul class="svelte-tags-input-matchs">
        {#each arrelementsmatch as element, i}
        <li value="element" on:click={_=>addTag(element)}>{element}</li>
        {/each}
    </ul>
{/if}


<style>
/* main */
.svelte-tags-input,
.svelte-tags-input-tag {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    font-size: 14px;
    padding: 2px 5px;
}

/* svelte-tags-input-layout */
.svelte-tags-input-layout {
    display:-webkit-box;
    display:-ms-flexbox;
    display:flex;
    -ms-flex-wrap:wrap;
        flex-wrap:wrap;
    -webkit-box-align:center;
       -ms-flex-align:center;
          align-items:center;
    padding: 0px 5px 5px 5px;
    border: solid 1px #CCC;
    background: #FFF;
    border-radius: 2px;
}
.svelte-tags-input-layout:focus,
.svelte-tags-input-layout:hover {
    border: solid 1px #000;    
}

/* svelte-tags-input */
.svelte-tags-input {
    -webkit-box-flex: 1;
            -ms-flex: 1;
                flex: 1; 
    margin: 0;
    margin-top: 5px;
    border:none;
}
.svelte-tags-input:focus {
    outline:0;
}

/* svelte-tags-input-tag */
.svelte-tags-input-tag {
    display:-webkit-box;
    display:-ms-flexbox;
    display:flex;
    white-space: nowrap;
    list-style:none;
    background: #000;
    color: #FFF;
    border-radius: 2px;
    margin-right: 5px;
    margin-top: 5px;
}
.svelte-tags-input-tag:hover {
    /*background: #CCC;*/
}
.svelte-tags-input-tag-remove {
    cursor:pointer;
}

/* svelte-tags-input-matchs */
.svelte-tags-input-matchs {
    margin:3px 0;
    padding: 0px;
    border: solid 1px #CCC;
    border-radius: 2px;
    max-height:310px;
    overflow:scroll;
    overflow-x:hidden;
}
.svelte-tags-input-matchs li {
    list-style:none;
    padding:5px;
    border-radius: 2px;
    cursor:pointer;
}
.svelte-tags-input-matchs li:hover {
    background:#000;
    color:#FFF;
}
</style>