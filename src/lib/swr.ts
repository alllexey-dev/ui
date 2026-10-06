const store = new Map<string, unknown>();

/**
 * Stale-while-revalidate: hands the cached value to onData at once (if any), then the fresh one.
 * Pair it with LoadingOverlay: show the overlay only while there is nothing cached for the key.
 */
export async function revalidate<T>(key: string, load: () => Promise<T>, onData: (data: T, fresh: boolean) => void): Promise<void> {
  if (store.has(key)) onData(store.get(key) as T, false);
  const data = await load();
  store.set(key, data);
  onData(data, true);
}

export function cached(key: string): boolean {
  return store.has(key);
}

export function forget(prefix = ""): void {
  for (const key of store.keys()) if (key.startsWith(prefix)) store.delete(key);
}
