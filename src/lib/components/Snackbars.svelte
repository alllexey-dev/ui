<script lang="ts">
  import { snackbars } from "../snackbar.svelte.js";
</script>

<div class="m3-snackbars" role="status" aria-live="polite">
  {#each snackbars.items as snack (snack.id)}
    <div class="m3-snackbar" class:error={snack.error}>
      <span>{snack.text}</span>
      {#if snack.action}
        {@const action = snack.action}
        <button onclick={() => (action.run(), snackbars.dismiss(snack.id))}>{action.label}</button>
      {/if}
    </div>
  {/each}
</div>
