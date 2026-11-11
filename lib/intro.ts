/** sessionStorage key marking that this session already saw the intro. */
export const INTRO_KEY = "intro-seen";

/**
 * Runs in <head> before first paint: on a first visit (and without reduced motion) it adds an ink cover,
 * so the hero never flashes before the Intro overlay mounts. A timer removes the cover if the app never hydrates.
 */
export const introPendingScript = `(function(){try{if(sessionStorage.getItem("${INTRO_KEY}")==="1")return;if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;var d=document.documentElement;d.classList.add("intro-pending");setTimeout(function(){d.classList.remove("intro-pending")},2500)}catch(e){}})();`;
