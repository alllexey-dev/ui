<script lang="ts" generics="T">
  import type { Snippet } from "svelte";
  import type { Resource } from "../resource.svelte.js";
  import EmptyState from "./EmptyState.svelte";
  import LoadingIndicator from "./LoadingIndicator.svelte";
  import LoadingOverlay from "./LoadingOverlay.svelte";

  // The states of a screen with data (UX.md "Состояния") for one Resource: the loading indicator until the
  // first data, the error with "Повторить" (or the app's own `failed` snippet), and the data, faded while it
  // reloads. The empty state is the app's: it knows what "nothing" means.
  let {
    resource,
    errorTitle = "Не удалось загрузить",
    errorText = "Проверьте соединение и попробуйте ещё раз",
    loadingLabel = "",
    children,
    failed,
  }: {
    resource: Resource<T>;
    errorTitle?: string;
    errorText?: string;
    loadingLabel?: string;
    children: Snippet<[T]>;
    failed?: Snippet<[unknown]>;
  } = $props();
</script>

{#if resource.data !== undefined}
  <LoadingOverlay loading={resource.loading}>{@render children(resource.data)}</LoadingOverlay>
{:else if resource.error}
  {#if failed}
    {@render failed(resource.error)}
  {:else}
    <EmptyState error title={errorTitle} text={errorText}>
      <button type="button" class="m3-btn tonal" onclick={() => resource.load()}>Повторить</button>
    </EmptyState>
  {/if}
{:else}
  <LoadingIndicator block label={loadingLabel} />
{/if}
