let locks = 0;
let saved = "";

/**
 * Stops the page behind a modal surface (dialog, drawer) from scrolling on touch screens. Returns the release
 * function; nested locks are counted. On desktop it does nothing, so the scrollbar does not jump.
 */
export function lockScroll(): () => void {
  if (!matchMedia("(pointer: coarse)").matches) return () => {};
  const root = document.documentElement;
  if (locks++ === 0) {
    saved = root.style.overflow;
    root.style.overflow = "hidden";
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--locks === 0) root.style.overflow = saved;
  };
}
