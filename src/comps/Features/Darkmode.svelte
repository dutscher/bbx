<script lang="ts">
  // https://jfelix.info/blog/using-react-spring-to-animate-svg-icons-dark-mode-toggle
  // https://stackoverflow.com/questions/56300132/how-to-override-css-prefers-color-scheme-setting
  // https://svelte.dev/tutorial/spring
  import { spring } from 'svelte/motion';
  import { localStore } from '../../stores';
  import { onMount } from '../../utils';

  const properties = {
    dark: {
      r: 9,
      transform: 40,
      cx: 12,
      cy: 4,
      opacity: 0,
    },
    light: {
      r: 5,
      transform: 90,
      cx: 30,
      cy: 0,
      opacity: 1,
    },
    springConfig: {
      stiffness: 0.1,
      damping: 0.25,
    },
  };

  let isDarkmode = false;
  let isReady = false;
  let svgContainerProps = spring({ transform: 0 }, properties.springConfig);
  let maskedCircleProps = spring({ cx: 0, cy: 0 }, properties.springConfig);
  let centerCircleProps = spring({ r: 0 }, properties.springConfig);
  let linesProps = spring({ opacity: 0 }, properties.springConfig);

  const toggleDarkMode = () => {
    isDarkmode = !isDarkmode;
    updateToggle();
  };

  const initToggle = () => {
    // local storage is used to override OS theme settings
    if (localStore.getRaw('theme')) {
      if (localStore.getRaw('theme') === 'dark') {
        isDarkmode = true;
      }
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // OS theme setting detected as dark
      isDarkmode = true;
    }

    updateToggle();
  };

  const updateToggle = () => {
    const theme = isDarkmode ? 'dark' : 'light';
    const { r, transform, cx, cy, opacity } = properties[theme];

    svgContainerProps.set({ transform });
    maskedCircleProps.set({ cx, cy });
    centerCircleProps.set({ r });
    linesProps.set({ opacity });

    // dark theme preferred, set body with a `is-dark` class
    if (isDarkmode) document.body.classList.add('is-dark');
    else document.body.classList.remove('is-dark');

    localStore.set('theme', theme);
    setTimeout(() => {
      isReady = true;
    }, 500);
  };

  onMount(() => {
    initToggle();
  });
</script>

<svg
  class="darkmode {isReady ? 'is-ready' : ''}"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  stroke="currentColor"
  on:click={toggleDarkMode}
  style="transform:rotate({$svgContainerProps.transform}deg)"
>
  <mask id="myMask2">
    <rect x="0" y="0" width="100%" height="100%" fill="white" />
    <circle cx={$maskedCircleProps.cx} cy={$maskedCircleProps.cy} r="9" fill="black" />
  </mask>
  <circle cx="12" cy="12" fill="white" mask="url(#myMask2)" r={$centerCircleProps.r > 0 ? $centerCircleProps.r : 0} />
  <g stroke="currentColor" style="opacity:{$linesProps.opacity || 0}">
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </g>
</svg>

<style lang="scss">
  @import '../../scss/variables';

  .darkmode {
    transition: opacity 1000ms ease-in-out;
    will-change: opacity;
    position: fixed;
    z-index: 1337;
    right: 16rem;
    bottom: 16rem;
    user-select: none;
    opacity: 0;
    cursor: pointer;

    &.is-ready {
      opacity: 1 !important;
    }
  }
</style>
