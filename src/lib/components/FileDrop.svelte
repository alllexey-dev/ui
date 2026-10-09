<script lang="ts">
  import { accepts, fileSize, isImage, isVideo } from "../files.js";
  import Icon from "./Icon.svelte";
  import Shape from "./Shape.svelte";

  // File picker for forms: a drop zone that also opens the system dialog, and the picked files as tiles with
  // previews and a remove button. Files over the limits are refused with a message under the zone; `error`
  // shows the server's verdict there too. Call add() from the form's paste handler to accept Ctrl+V.
  let {
    files = $bindable([]),
    accept = "",
    maxFiles = 10,
    maxSize = Number.POSITIVE_INFINITY,
    title = "Добавить файлы",
    hint = "",
    icon = "attach_file",
    error = "",
  }: {
    files?: File[];
    accept?: string;
    maxFiles?: number;
    /** Bytes, or bytes per file (for example a larger limit for videos). */
    maxSize?: number | ((file: File) => number);
    title?: string;
    hint?: string;
    icon?: string;
    error?: string;
  } = $props();

  const id = $props.id();
  let input: HTMLInputElement;
  let over = $state(false);
  let problem = $state("");
  const previews = new Map<File, string>();

  const limitOf = (f: File) => (typeof maxSize === "function" ? maxSize(f) : maxSize);

  export function add(list: Iterable<File>) {
    problem = "";
    const next = [...files];
    for (const f of list) {
      if (next.length >= maxFiles) {
        problem = `Можно приложить не больше ${maxFiles}`;
        break;
      }
      if (!accepts(accept, f)) problem = `«${f.name}» — неподходящий тип файла`;
      else if (f.size > limitOf(f)) problem = `«${f.name}» больше ${fileSize(limitOf(f))}`;
      else next.push(f);
    }
    files = next;
  }

  function remove(f: File) {
    files = files.filter((x) => x !== f);
    problem = "";
  }

  function preview(f: File): string {
    let url = previews.get(f);
    if (!url) previews.set(f, (url = URL.createObjectURL(f)));
    return url;
  }

  // Release previews of files that left the list (removed or a form reset), and all of them on destroy.
  $effect(() => {
    for (const [f, url] of previews) {
      if (!files.includes(f)) {
        URL.revokeObjectURL(url);
        previews.delete(f);
      }
    }
  });
  $effect(() => () => previews.forEach((url) => URL.revokeObjectURL(url)));

  function drop(e: DragEvent) {
    e.preventDefault();
    over = false;
    if (e.dataTransfer?.files.length) add(e.dataTransfer.files);
  }

  const message = $derived(error || problem);
</script>

<div class="m3-file-drop">
  <button
    type="button"
    class="zone"
    class:over
    class:invalid={!!message}
    aria-describedby="{id}-hint"
    onclick={() => input.click()}
    ondragover={(e) => (e.preventDefault(), (over = true))}
    ondragleave={() => (over = false)}
    ondrop={drop}
  >
    <Shape shape={over ? "sunny" : "cookie6"} size={44} tone="secondary"><Icon name={icon} /></Shape>
    <span class="text">
      <span class="m3-title-small">{title}</span>
      <span class="m3-body-small m3-muted" id="{id}-hint">{hint || "Нажмите, перетащите или вставьте"}</span>
    </span>
  </button>
  <input
    bind:this={input}
    type="file"
    {accept}
    multiple={maxFiles > 1}
    hidden
    onchange={() => {
      if (input.files) add(input.files);
      input.value = "";
    }}
  />

  {#if files.length > 0}
    <ul class="tiles">
      {#each files as f (f)}
        <li class="tile">
          {#if isImage(f) && !/\.(heic|heif)$/i.test(f.name)}
            <img class="thumb" src={preview(f)} alt="" />
          {:else}
            <span class="thumb"><Icon name={isVideo(f) ? "videocam" : "description"} /></span>
          {/if}
          <span class="meta">
            <span class="m3-label-medium m3-clip" title={f.name}>{f.name}</span>
            <span class="m3-label-small m3-muted">{fileSize(f.size)}</span>
          </span>
          <button type="button" class="m3-icon-btn" aria-label="Убрать {f.name}" onclick={() => remove(f)}><Icon name="close" size={20} /></button>
        </li>
      {/each}
    </ul>
  {/if}
  {#if message}<p class="error m3-body-small" role="alert">{message}</p>{/if}
</div>

<style>
  .m3-file-drop { display: flex; flex-direction: column; gap: 12px; }
  .zone {
    display: flex; align-items: center; gap: 16px; width: 100%; padding: 16px; border: 1.5px dashed var(--md-outline-variant);
    border-radius: var(--md-shape-lg); background: transparent; color: var(--md-on-surface); font: inherit; text-align: left; cursor: pointer;
    transition: border-radius 0.4s var(--md-spring-default), background 0.2s var(--md-effects-default), border-color 0.2s;
  }
  @media (hover: hover) { .zone:hover { background: color-mix(in srgb, var(--md-on-surface) 4%, transparent); } }
  .zone.over { border-color: var(--md-primary); border-radius: var(--md-shape-xl); background: color-mix(in srgb, var(--md-primary) 8%, transparent); }
  .zone.invalid { border-color: var(--md-error); }
  .zone:focus-visible { outline: 3px solid var(--md-secondary); outline-offset: 2px; }
  .text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px; margin: 0; padding: 0; list-style: none; }
  .tile {
    display: flex; align-items: center; gap: 8px; min-width: 0; padding: 6px; border-radius: var(--md-shape-md);
    background: var(--md-surface-container-high); animation: m3-pop 0.4s var(--md-spring-default);
  }
  .thumb {
    flex: none; display: grid; place-items: center; width: 44px; height: 44px; border-radius: var(--md-shape-sm);
    object-fit: cover; background: var(--md-surface-container-highest); color: var(--md-on-surface-variant);
  }
  .meta { flex: 1; display: flex; flex-direction: column; min-width: 0; }
  .error { margin: 0; color: var(--md-error); }
</style>
