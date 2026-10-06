<script lang="ts">
  import { theme } from "./theme.js";
  import { Account, AppShell, Page, Snackbars, snackbars } from "../src/lib/index.js";
  import Foundations from "./pages/Foundations.svelte";
  import Actions from "./pages/Actions.svelte";
  import Expressive from "./pages/Expressive.svelte";
  import Feedback from "./pages/Feedback.svelte";
  import Data from "./pages/Data.svelte";
  import Elements from "./pages/Elements.svelte";

  const pages = [
    { key: "", label: "Основа", icon: "palette", page: Foundations },
    { key: "actions", label: "Действия", icon: "touch_app", page: Actions },
    { key: "expressive", label: "Формы", icon: "interests", page: Expressive },
    { key: "feedback", label: "Отклик", icon: "notifications", page: Feedback },
    { key: "data", label: "Данные", icon: "monitoring", page: Data },
    { key: "elements", label: "Без Svelte", icon: "code", page: Elements },
  ];

  let hash = $state(location.hash.slice(2));
  const current = $derived(pages.find((p) => p.key === hash) ?? pages[0]);
  const items = $derived(pages.map((p) => ({ href: `#/${p.key}`, label: p.label, icon: p.icon, active: p === current, badge: p.key === "feedback" ? 3 : undefined })));
</script>

<svelte:window onhashchange={() => (hash = location.hash.slice(2))} />

<AppShell brand="@alllexey/ui" brandHref="#/" {items} {theme} fab={{ label: "Главное действие", icon: "add", onclick: () => snackbars.show("FAB - для главного действия приложения") }}>
  {#snippet account()}<Account name="alllexey" status="на связи" tone="ok" />{/snippet}
  {#key current.key}
    <Page><current.page /></Page>
  {/key}
</AppShell>
<Snackbars />
