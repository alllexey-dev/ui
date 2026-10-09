export interface Snack {
  id: number;
  text: string;
  error: boolean;
  action?: { label: string; run: () => void };
}

export interface SnackOptions {
  error?: boolean;
  action?: Snack["action"];
  /** Milliseconds; errors and snacks with an action stay longer by default. */
  duration?: number;
}

class Snackbars {
  items = $state<Snack[]>([]);
  #next = 1;

  show(text: string, { error = false, action, duration }: SnackOptions = {}): number {
    const id = this.#next++;
    this.items = [...this.items.slice(-2), { id, text, error, action }];
    setTimeout(() => this.dismiss(id), duration ?? (error || action ? 8000 : 4000));
    return id;
  }

  error(text: string): number {
    return this.show(text, { error: true });
  }

  dismiss(id: number): void {
    this.items = this.items.filter((s) => s.id !== id);
  }

  /** Removes every snackbar (sign-out, tests). */
  clear(): void {
    this.items = [];
  }
}

/** App-wide snackbar queue; render it once with <Snackbars />. At most three are visible. */
export const snackbars = new Snackbars();
