<script lang="ts">
  import WavyProgress from "./WavyProgress.svelte";

  // Compact flat progress for tables and lists; the wavy one is for headline numbers. `tone` marks a level
  // that needs attention.
  let { value, max = 100, tone }: { value: number; max?: number; tone?: "warn" | "bad" } = $props();
</script>

<WavyProgress {value} {max} wave={false} thickness={4} tone={tone === "bad" ? "error" : tone === "warn" ? "warning" : "primary"} />
