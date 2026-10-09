import { revalidate } from "./swr.js";

/**
 * Data of one request for a screen (UX.md "Состояния"). The cached copy shows at once, a fresh one replaces
 * it quietly, the last data stays while a new request runs, and answers of a replaced request are dropped.
 * Render it with <Loadable>, or read `data`, `error` and `loading` directly.
 */
export class Resource<T> {
  data = $state<T | undefined>(undefined);
  error = $state<unknown>(null);
  /** A request is running; false during quiet polling. */
  loading = $state(false);
  #key: string;
  #fetch: () => Promise<T>;
  #generation = 0;

  constructor(key: string, fetch: () => Promise<T>) {
    this.#key = key;
    this.#fetch = fetch;
  }

  /** Loads again, or switches to another request (a new filter or page) when given one. */
  load(key: string = this.#key, fetch: () => Promise<T> = this.#fetch): Promise<void> {
    this.#key = key;
    this.#fetch = fetch;
    return this.#run(false);
  }

  /**
   * Reloads every `ms` without the loading state: live data updates without indicators. Returns the stop
   * function, so `$effect(() => resource.poll(5000))` stops with the component.
   */
  poll(ms: number): () => void {
    const timer = setInterval(() => {
      // a tick does not replace a load that is still running
      if (!this.loading) void this.#run(true);
    }, ms);
    return () => clearInterval(timer);
  }

  #run(quiet: boolean): Promise<void> {
    const generation = ++this.#generation;
    const current = () => generation === this.#generation;
    if (!quiet) {
      this.loading = true;
      this.error = null;
    }
    return revalidate(this.#key, this.#fetch, (data, fresh) => {
      if (!current()) return;
      this.data = data;
      if (fresh) {
        this.loading = false;
        this.error = null;
      }
    }).catch((error: unknown) => {
      if (!current()) return;
      this.error = error;
      this.loading = false;
    });
  }
}
