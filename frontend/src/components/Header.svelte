<script>

    const totalFrames = 3;
    const animationDuration = 1300;
    const timePerFrame = 100;

    let lastUpdated;
    let timeSinceLastUpdate;
    let frameNumber = 2;
    
    let cycles = 0;
    let maxCycles = 3;
    let nextAnimation; 
    let tid;

    export let doAnimate = false;

    export function start() {
        doAnimate = true;
        maxCycles = random(2, 8);
        nextAnimation = random(1000, 30000);
        requestAnimationFrame(step)
    }

    export function stop() {
        doAnimate = false;
        frameNumber = 2;
        // clearTimeout(tid);
        // if(nextAnimation) tid = setTimeout(start, nextAnimation);
    }

    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function step(startTime) {
        
        if (!lastUpdated) lastUpdated = startTime;

        timeSinceLastUpdate = startTime - lastUpdated;

        if (timeSinceLastUpdate > timePerFrame) {
            lastUpdated = startTime;
            if (frameNumber >= totalFrames) {
                cycles++;
                frameNumber = 1;
            } else {
                frameNumber = frameNumber + 1;
            }
        }

        if(doAnimate) {
            if(cycles <= maxCycles) requestAnimationFrame(step);
            else  stop();
        }
    }

    $: {
        if(doAnimate) start();
    }

    window.animateEye = step;

</script>

<style>
    .head {
        position: sticky;
        position: -webkit-sticky;
        top: 0;
        width: 100%;
        align-self: flex-start;
        background-color: #f6f6fc;
    }
    .title {
        margin: 30px 40px;
        display: flex;
        flex-direction: row;
    }

    .title > .logo > img {
        width: 48px;
        padding-right: 6px;
    }

    h2 {
        font-family: Helvetica, Arial, sans-serif;
        text-transform: capitalize;
        /** this is to compensate for the icons attribution padding **/
        line-height: 16px; 
    }
</style>

<div class="head">
    <div class="title">
        <span class="logo"><img src="/images/eye-0{frameNumber}.svg" alt="logo"/></span>
        <h2>Overwatch</h2>
    </div>
  </div>