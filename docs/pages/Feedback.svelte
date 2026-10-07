<script lang="ts">
  import { ConfirmDialog, Dialog, EmptyState, LoadingOverlay, PageHeader, snackbars } from "../../src/lib/index.js";

  let confirm = $state<"" | "plain" | "danger">("");
  let info = $state(false);
  let details = $state(false);
  let nested = $state(false);
  let loading = $state(false);

  function reload() {
    loading = true;
    setTimeout(() => (loading = false), 1400);
  }
</script>

<PageHeader title="Отклик" text="Диалоги, снекбары, загрузка и пустые состояния. Правила их использования описаны в UX.md." />

<section class="m3-card">
  <h2 class="m3-section-title">Диалоги</h2>
  <div class="row">
    <button class="m3-btn tonal" onclick={() => (info = true)}>Обычный диалог</button>
    <button class="m3-btn tonal" onclick={() => (details = true)}>Диалог с подтверждением внутри</button>
    <button class="m3-btn" onclick={() => (confirm = "plain")}>Подтверждение</button>
    <button class="m3-btn danger" onclick={() => (confirm = "danger")}>Удаление с вводом имени</button>
  </div>
</section>

<section class="m3-card">
  <h2 class="m3-section-title">Снекбары</h2>
  <div class="row">
    <button class="m3-btn tonal" onclick={() => snackbars.show("Стек console перезапущен")}>Успех</button>
    <button class="m3-btn tonal" onclick={() => snackbars.error("Не удалось связаться с сервером")}>Ошибка</button>
    <button class="m3-btn tonal" onclick={() => snackbars.show("Запрос удалён", { action: { label: "Отменить", run: () => snackbars.show("Восстановлено") } })}>С действием</button>
  </div>
</section>

<section class="m3-card">
  <h2 class="m3-section-title">Загрузка поверх данных</h2>
  <p class="m3-body-medium m3-muted">Старые данные остаются на месте и тускнеют; индикатор появляется, только если ждать дольше 250 мс.</p>
  <div><button class="m3-btn tonal" onclick={reload} disabled={loading}>Обновить</button></div>
  <LoadingOverlay {loading}>
    <div class="m3-segmented">
      {#each ["console", "edge", "auth", "egress"] as name}
        <div class="m3-list-item"><div class="main"><span class="headline">{name}</span><span class="support">3 контейнера · работает</span></div><span class="trail m3-num">12 МБ</span></div>
      {/each}
    </div>
  </LoadingOverlay>
</section>

<section class="grid">
  <div class="m3-card"><EmptyState title="Пока пусто" text="Здесь появятся запросы, когда они будут." icon="inbox" /></div>
  <div class="m3-card"><EmptyState error title="Не удалось загрузить" text="Сервер не ответил за 10 секунд."><button class="m3-btn tonal" onclick={() => snackbars.show("Повторяем…")}>Повторить</button></EmptyState></div>
</section>

{#if info}
  <Dialog title="Сессия истекла" text="Войдите заново, чтобы продолжить." icon="lock" shape="sunny" tone="error" modal>
    {#snippet actions()}<button class="m3-btn" onclick={() => (info = false)}>Войти</button>{/snippet}
  </Dialog>
{/if}
{#if details}
  <Dialog title="Заявка #42" text="Escape закрывает только верхний диалог: подтверждение, а не эту карточку." icon="inbox" onclose={() => (details = false)}>
    {#snippet actions()}
      <button class="m3-btn text" onclick={() => (details = false)}>Закрыть</button>
      <button class="m3-btn danger-tonal" onclick={() => (nested = true)}>Удалить</button>
    {/snippet}
  </Dialog>
{/if}
{#if nested}
  <ConfirmDialog title="Удалить заявку?" text="Её нельзя будет восстановить." confirmLabel="Удалить" danger onconfirm={() => ((nested = false), (details = false), snackbars.show("Заявка удалена"))} oncancel={() => (nested = false)} />
{/if}
{#if confirm}
  <ConfirmDialog
    title={confirm === "danger" ? "Удалить базу?" : "Перезапустить стек?"}
    text={confirm === "danger" ? "Данные будут удалены безвозвратно." : "Сервис будет недоступен несколько секунд."}
    confirmLabel={confirm === "danger" ? "Удалить" : "Перезапустить"}
    danger={confirm === "danger"}
    requireText={confirm === "danger" ? "itmowidgets" : ""}
    onconfirm={() => ((confirm = ""), snackbars.show("Готово"))}
    oncancel={() => (confirm = "")}
  />
{/if}

<style>
  section { margin-bottom: 16px; display: flex; flex-direction: column; gap: 16px; }
  .row { display: flex; flex-wrap: wrap; gap: 12px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
</style>
