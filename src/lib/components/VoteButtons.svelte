<script lang="ts" module>
  export type VoteValue = -1 | 0 | 1;
</script>

<script lang="ts">
  import Icon from "./Icon.svelte";

  // Up and down votes as a connected pair with counts (ideas, feature requests, answers). Pressing the cast
  // vote again takes it back. The counts are the caller's: it updates them (optimistically or from the server).
  // Each count is optional: without `down` dislikes reach the owner but voters do not see them, without both
  // the pair is a plain like/dislike toggle.
  let {
    up,
    down,
    value = $bindable(0),
    large = false,
    label = "Голосование",
    upLabel = "Поддержать",
    downLabel = "Против",
    onchange,
  }: {
    up?: number;
    down?: number;
    value?: VoteValue;
    large?: boolean;
    label?: string;
    upLabel?: string;
    downLabel?: string;
    onchange?: (value: VoteValue) => void;
  } = $props();

  function cast(e: MouseEvent, pressed: 1 | -1) {
    // Votes often sit on clickable cards; the vote must not also open the card.
    e.stopPropagation();
    value = value === pressed ? 0 : pressed;
    onchange?.(value);
  }
</script>

<div class="m3-group m3-vote" class:large role="group" aria-label={label}>
  <button type="button" class:active={value === 1} class:bare={up === undefined} aria-pressed={value === 1} aria-label={up === undefined ? upLabel : `${upLabel}: ${up}`} title={upLabel} onclick={(e) => cast(e, 1)}>
    <Icon name="thumb_up" filled={value === 1} size={large ? 22 : 18} />{#if up !== undefined}<span class="m3-num">{up}</span>{/if}
  </button>
  <button type="button" class:active={value === -1} class:bare={down === undefined} aria-pressed={value === -1} aria-label={down === undefined ? downLabel : `${downLabel}: ${down}`} title={downLabel} onclick={(e) => cast(e, -1)}>
    <Icon name="thumb_down" filled={value === -1} size={large ? 22 : 18} />{#if down !== undefined}<span class="m3-num">{down}</span>{/if}
  </button>
</div>

<style>
  .m3-vote > button { min-width: 64px; justify-content: center; }
  .m3-vote > button.bare { min-width: 48px; padding: 0 12px; }
  .m3-vote > button:focus-visible { outline: 3px solid var(--md-secondary); outline-offset: 2px; z-index: 1; }
  .m3-vote.large { --group-pill: 24px; }
  .m3-vote.large > button { height: 48px; min-width: 80px; padding: 0 20px; font: var(--md-title-small); }
  .m3-vote.large > button.bare { min-width: 56px; padding: 0 16px; }
  .m3-vote.large :global(svg) { width: 22px; height: 22px; }
</style>
