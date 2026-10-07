<script lang="ts">
  import { lockScroll } from "../scroll-lock.js";

  export type GridColumn = { name: string; type?: string };
  // Raw tabular data (SQL results, exports): monospace cells, sticky header, double-click a cell for its full value.
  let {
    columns,
    rows,
    sort = null,
    onsort,
    maxHeight = "64vh",
  }: {
    columns: GridColumn[];
    rows: (string | null)[][];
    sort?: { column: string; desc: boolean } | null;
    onsort?: (column: string) => void;
    maxHeight?: string;
  } = $props();

  let expanded = $state<string | null>(null);

  $effect(() => {
    if (expanded !== null) return lockScroll();
  });
</script>

<svelte:window onkeydown={(e) => e.key === "Escape" && (expanded = null)} />

<div class="wrap" style:max-height={maxHeight}>
  <table>
    <thead>
      <tr>
        {#each columns as col}
          <th aria-sort={sort?.column === col.name ? (sort.desc ? "descending" : "ascending") : undefined}>
            {#if onsort}
              <button type="button" onclick={() => onsort(col.name)} title={col.type} class:sorted={sort?.column === col.name}>
                {col.name}{#if col.type}<span class="type">{col.type}</span>{/if}{#if sort?.column === col.name}<span class="dir">{sort.desc ? "↓" : "↑"}</span>{/if}
              </button>
            {:else}
              <span class="head" title={col.type}>{col.name}{#if col.type}<span class="type">{col.type}</span>{/if}</span>
            {/if}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as row}
        <tr>
          {#each row as value}<td class:null={value === null} title={value ?? "NULL"} ondblclick={() => (expanded = value)}>{value ?? "NULL"}</td>{/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

{#if expanded !== null}
  <div class="m3-scrim" role="presentation" onclick={() => (expanded = null)}>
    <pre class="value" role="presentation" onclick={(e) => e.stopPropagation()}>{expanded}</pre>
  </div>
{/if}

<style>
  .wrap { overflow: auto; overscroll-behavior: contain; border-radius: var(--md-shape-lg); background: var(--md-surface-container); }
  table { border-collapse: separate; border-spacing: 0; min-width: 100%; }
  th { position: sticky; top: 0; z-index: 1; background: var(--md-surface-container-high); text-align: left; }
  th button, .head { display: flex; align-items: baseline; gap: 6px; padding: 12px 14px; border: none; background: none; width: 100%; text-align: left; white-space: nowrap; font: var(--md-label-large); color: var(--md-on-surface); }
  @media (hover: hover) { th button:hover { background: color-mix(in srgb, var(--md-on-surface) 8%, transparent); } }
  th button.sorted { color: var(--md-primary); }
  .type { font: var(--md-label-small); color: var(--md-on-surface-variant); }
  td { padding: 8px 14px; border-top: 1px solid var(--md-outline-variant); font: 12.5px/1.5 var(--md-mono); max-width: 360px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  tr:active td { background: color-mix(in srgb, var(--md-on-surface) 8%, transparent); }
  @media (hover: hover) { tr:hover td { background: color-mix(in srgb, var(--md-on-surface) 5%, transparent); } }
  td.null { color: var(--md-outline); font-style: italic; }
  .value { margin: 0; max-width: min(900px, 90vw); max-height: 80vh; overflow: auto; padding: 20px 24px; border-radius: var(--md-shape-xl); background: var(--md-surface-container-high); font: 13px/1.6 var(--md-mono); white-space: pre-wrap; word-break: break-word; }
</style>
