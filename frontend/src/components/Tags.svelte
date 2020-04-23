<script>
    import {createEventDispatcher} from 'svelte';
        
    const dispatch = createEventDispatcher();

    let tag;
    let tid;
    let container;
    let liIndex = -1;
    let removeComma = false;
    let matchedElements = [];

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
    export let dropdownTimeout;

    /**
     * More here https://keycode.info/
     */ 
    const CODES = {
        BACKSPACE: 8,
        TAB: 9,
        ENTER:13,
        ARROW_UP: 38,
        ARROW_DOWN: 40,
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
    $: dropdownTimeout = dropdownTimeout || false;

    function setTag(event) {
        // handleKeyPress(event);
        const keyCode = event.keyCode;
        let currentTag = event.target.value;

        //On ENTER press we add the tag
        if(keyCode === CODES.ENTER) {
            if(matchedElements.length > 0) {
                let index = liIndex === -1 ? 0 : liIndex;
                currentTag = matchedElements[index];
            }

            return addTag(currentTag);
        }
        
        //If we BACKSPACE when there's no text then remove previous tag
        if(keyCode === CODES.BACKSPACE && tag === '') {
            tags.pop();
            tags = tags;
            liIndex = -1;
            dispatch('tags', {tags});
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
                        removeComma = true;
                        addTag(_trimTrailing(currentTag, ','));
                        break;
                    case CODES.TAB:
                        event.preventDefault();
                        let index = liIndex === -1 ? 0 : liIndex;
                        let match = matchedElements[index];
                        addTagFromDropdown(currentTag, match);
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
                tag = '' ;
                liIndex = -1;
                dispatch('tags', {tags});
            });
        }
    }

    function addTagFromDropdown(currentTag, match) {
        if(match) {
            if(currentTag === match) {
                tag = '';
            } else if(match.indexOf(currentTag) !== -1) {
                currentTag = tag = match;
            }
        }

        if(onlyUnique) {
            matchedElements = matchedElements.filter(m => m !== currentTag );
        }
        
        addTag(currentTag);
    }

    function addTag(currentTag='') {
        currentTag = currentTag.trim();
        if(!currentTag) return;
        
        //TODO: We might want to move this to a function where we check
        if(maxTags && tags.length === maxTags) return;

        if(onlyUnique && tags.includes(currentTag)) return;

        tags.push(currentTag);
        tags = tags;
        tag = '';
        liIndex = -1;
        dispatch('tags', {tags});
    }

    function removeTag(i) {
        tags.splice(i, 1);
        tags = tags;
        liIndex = -1;
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
        const data = e.dataTransfer.getData('Text');
        const tags = splitTags(data).map(tag => addTag(tag));
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
        if(!data) return [];
        return data.split(splitWith).map(t => t.trim());
    }

    function getMatchElements(e) {
        if(!Array.isArray(autoComplete)) return;

        let term = e.target.value;
        if(!term) return matchedElements = [];

        /**
         * Select elements that match the given
         * string...
         */ 
        let matched = autoComplete.filter(item => {
            return item.toLowerCase().includes(term.toLowerCase());
        });

        if(onlyUnique) {
            matched = matched.filter(m => tags.indexOf(m) === -1 );
        }

        matchedElements = matched;
    }

    function handleWindowClick(event) {
        if(!container) return;
        const eventTarget = event.path && event.path.length > 0 ? event.path[0] : event.target;
        if (container.contains(eventTarget)) return;
        reset();
    }

    function reset() {
        matchedElements = [];
        tag = '';
        liIndex = -1;
    }

    function handleKeyPress(event) {
        if(!matchedElements || matchedElements.length === 0) return;
        const keyCode = event.keyCode;
        let el;
        switch (keyCode) {
            case CODES.ARROW_UP:
                _moveActiveLi(true);
                break;
        
            case CODES.ARROW_DOWN:
                _moveActiveLi(false);
                break;
        }
    }

    function _moveActiveLi(up=false) {
        let el = document.getElementById(`li-${liIndex}`);
        if(el) el.classList.remove('active');
        up ? liIndex-- : liIndex++;
        el = document.getElementById(`li-${liIndex}`);
        if(el) el.classList.add('active');
    }

    function _trimTrailing(word='', char=',') {
        let last = word[word.length - 1];
        if(char !== last) return word;
        return word.substring(0, word.length - 1);
    }
 
    /**
     * Handle menu suggestions close on 
     * inactive user. This should rather
     * be an idle timeout...
     */ 
    // $: if(matchedElements.length > 0) tid = setTimeout(reset, dropdownTimeout);
    // $: if(matchedElements.length === 0 && tid) clearTimeout(tid);

</script>
<svelte:window on:click={handleWindowClick}
on:keydown={handleKeyPress} />

<div bind:this={container}>
    <div class="svelte-tags-input-layout">
        {#if tags.length > 0}
            {#each tags as tag, i}
                <span class="svelte-tags-input-tag tag {tag}">{tag} 
                    <span class="svelte-tags-input-tag-remove" on:click={_ => removeTag(i)}> ×</span>
                </span>
            {/each}
        {/if}
        <input  type="text" 
                bind:value={tag} 
                on:keydown={setTag} 
                on:keyup={getMatchElements} 
                on:paste={onPaste} 
                on:drop={onDrop} 
                class="svelte-tags-input" 
                placeholder={placeholder} />
        
    </div>

    {#if autoComplete && matchedElements.length > 0}
        <ul class="svelte-tags-input-matchs">
            {#each matchedElements as element, i}
            <li id="li-{i}" value="{element}" on:click={_ => addTagFromDropdown(element, element)}>
                <div>
                    <span class="icon">{element}</span>
                </div>
            </li>
            {/each}
        </ul>
    {/if}
</div>

<style>
/* main */
.svelte-tags-input {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
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

    /* min-width: 400px;
    max-width: 600px;
    flex-basis: auto; 
    flex-grow: 1; */

    padding: 0px 5px 5px 5px;
    border: solid 1px #CCC;
    background: #f6f6fc;
    border-radius: 2px;
    box-shadow: 0 0 0 2px rgba(0,0,0,.1);
}

.svelte-tags-input-layout:focus,
.svelte-tags-input-layout:hover {
    border: solid 1px #171a21;    
}

/* svelte-tags-input */
.svelte-tags-input {
    -webkit-box-flex: 1;
        -ms-flex: 1;
            flex: 1;
    
    margin: 0;
    margin-top: 5px;
    border:none;
    background: #f6f6fc;
}

.svelte-tags-input:focus {
    outline:0;
}

/* svelte-tags-input-tag */
.svelte-tags-input-tag {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 5px 5px 5px;
}

.svelte-tags-input-tag {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Opera and Firefox */
}

.svelte-tags-input-tag {
    display:-webkit-box;
    display:-ms-flexbox;
    display:flex;

    white-space: nowrap;
    list-style:none;
    background: #171a21;
    color: #f6f6fc;
    border-radius: 2px;
    margin-right: 5px;
    margin-top: 5px;
}

.svelte-tags-input-tag:hover {
    /*background: #CCC;*/
}

.svelte-tags-input-tag-remove {
    cursor:pointer;
    padding-left: 4px;
}

/* svelte-tags-input-matchs */
.svelte-tags-input-matchs {
    margin: 3px 0;
    padding: 0px;
    /* border: solid 1px #CCC; */
    border-radius: 0 0 2px 2px;
    max-height: 310px;
    overflow: scroll;
    overflow-x: hidden;
}

.svelte-tags-input-matchs li {
    list-style: none;
    padding: 5px;
    /* border-radius: 2px; */
    cursor: pointer;
    background:#f6f6fc;
}

.svelte-tags-input-matchs  li.active  {
    color:#f6f6fc;
    background:#171a21 !important;
}

.svelte-tags-input-matchs li:hover {
    background:#171a21;
    color:#f6f6fc;
}
</style>