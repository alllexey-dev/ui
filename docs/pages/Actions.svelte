<script lang="ts">
  import { ButtonGroup, Chips, ConfirmDialog, FileDrop, Icon, PageHeader, Search, Switch, Tabs, TextField, VoteButtons, type VoteValue } from "../../src/lib/index.js";

  let period = $state("24h");
  let view = $state("list");
  let on = $state(true);
  let danger = $state(false);
  let query = $state("");
  let tab = $state("all");
  let status = $state<"" | "running" | "unhealthy" | "stopped">("running");
  let kinds = $state(["bug"]);
  let kind = $state("idea");
  let write = $state(false);
  let askWrite = $state(false);
  let name = $state("");
  let nameTouched = $state(false);
  let about = $state("");
  let files = $state<File[]>([]);
  let vote = $state<VoteValue>(0);
</script>

<PageHeader title="Действия" text="Кнопки становятся квадратнее при нажатии, группы перетекают одним движением.">
  {#snippet actions()}<button class="m3-btn tonal"><Icon name="refresh" />Обновить</button><button class="m3-btn"><Icon name="add" />Создать</button>{/snippet}
</PageHeader>

<section class="m3-card">
  <h2 class="m3-section-title">Кнопки</h2>
  <div class="row">
    <button class="m3-btn">Основная</button>
    <button class="m3-btn tonal">Тональная</button>
    <button class="m3-btn tertiary">Третичная</button>
    <button class="m3-btn outlined">Контурная</button>
    <button class="m3-btn text">Текстовая</button>
    <button class="m3-btn elevated">Приподнятая</button>
    <button class="m3-btn danger"><Icon name="delete" />Удалить</button>
    <button class="m3-btn danger-tonal">Опасная тональная</button>
    <button class="m3-btn" disabled>Недоступна</button>
  </div>
  <div class="row">
    <button class="m3-btn small">Маленькая</button>
    <button class="m3-btn large"><Icon name="rocket_launch" />Большая</button>
    <button class="m3-icon-btn"><Icon name="more_vert" /></button>
    <button class="m3-icon-btn tonal"><Icon name="favorite" /></button>
    <button class="m3-icon-btn filled"><Icon name="add" /></button>
    <button class="m3-icon-btn outlined"><Icon name="download" /></button>
    <button class="m3-fab"><Icon name="add" />Новый стек</button>
  </div>
</section>

<section class="m3-card">
  <h2 class="m3-section-title">Группы, вкладки, чипы</h2>
  <div class="row">
    <ButtonGroup bind:value={period} label="Период" options={[{ value: "1h", label: "1 ч" }, { value: "24h", label: "24 ч" }, { value: "7d", label: "7 д" }, { value: "30d", label: "30 д" }]} />
    <ButtonGroup small bind:value={view} options={[{ value: "list", label: "Список", icon: "menu" }, { value: "grid", label: "Плитка", icon: "dashboard" }]} />
  </div>
  <div class="narrow">
    <ButtonGroup fill bind:value={kind} label="Тип" options={[{ value: "idea", label: "Идея", icon: "favorite" }, { value: "bug", label: "Ошибка", icon: "warning" }, { value: "other", label: "Другое" }]} />
  </div>
  <Tabs bind:value={tab} label="Стеки" options={[{ value: "all", label: "Все" }, { value: "running", label: "Работают" }, { value: "failing", label: "С ошибками", badge: 2 }, { value: "stopped", label: "Остановлены" }]} />
  <Chips bind:value={status} label="Состояние" options={[{ value: "running", label: "Работают", count: 12 }, { value: "unhealthy", label: "С ошибками", count: 1 }, { value: "stopped", label: "Остановлены", count: 3 }]} />
  <Chips bind:values={kinds} label="Тип" options={[{ value: "bug", label: "Ошибки" }, { value: "idea", label: "Идеи" }, { value: "question", label: "Вопросы" }]} />
  <div class="row">
    <span class="m3-pill ok">в норме</span><span class="m3-pill warn">медленно</span><span class="m3-pill bad">упал</span><span class="m3-pill neutral">выключен</span>
  </div>
</section>

<section class="m3-card">
  <h2 class="m3-section-title">Поля и переключатели</h2>
  <div class="row">
    <div class="grow"><Search bind:value={query} label="Поиск по стекам" /></div>
    <div class="grow"><Search compact bind:value={query} label="Фильтр" /></div>
  </div>
  <div class="row">
    <input class="m3-field" placeholder="Обычное поле" />
    <input class="m3-field compact m3-mono" placeholder="compact mono" />
  </div>
  <div class="row">
    <Switch bind:checked={on}>Автообновление</Switch>
    <Switch danger checked={write} onchange={(next) => (next ? ((askWrite = true), false) : (write = false))}>Разрешить запись</Switch>
    <Switch disabled checked>Недоступен</Switch>
  </div>
</section>

<section class="m3-card">
  <h2 class="m3-section-title">Формы</h2>
  <div class="form">
    <TextField label="Название" bind:value={name} placeholder="Например: backend" error={nameTouched && name.trim().length < 3 ? "Не короче 3 символов" : ""} onblur={() => (nameTouched = true)} />
    <TextField label="Описание" bind:value={about} multiline optional placeholder="Что делает сервис" hint="Покажется в списке стеков" />
    <FileDrop bind:files accept="image/*,video/*" maxFiles={3} maxSize={(f) => (f.type.startsWith("video/") ? 50 * 1024 * 1024 : 10 * 1024 * 1024)} title="Добавить скриншоты" hint="До 3 файлов: картинки до 10 МБ, видео до 50 МБ" icon="image" />
  </div>
  <div class="row">
    <VoteButtons up={12 + (vote === 1 ? 1 : 0)} down={3 + (vote === -1 ? 1 : 0)} bind:value={vote} />
    <VoteButtons up={12} down={3} value={1} large />
    <VoteButtons up={12} value={-1} />
    <VoteButtons value={1} />
  </div>
</section>

{#if askWrite}
  <ConfirmDialog title="Разрешить запись?" text="Запросы смогут менять данные в базе." confirmLabel="Разрешить" danger onconfirm={() => ((write = true), (askWrite = false))} oncancel={() => (askWrite = false)} />
{/if}

<style>
  section { margin-bottom: 16px; display: flex; flex-direction: column; gap: 16px; }
  .row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
  .grow { flex: 1; min-width: 240px; }
  .form { display: flex; flex-direction: column; gap: 16px; max-width: 560px; }
  .narrow { max-width: 420px; }
</style>
