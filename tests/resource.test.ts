import { beforeEach, describe, expect, it, vi } from "vitest";
import { Resource } from "../src/lib/resource.svelte.js";
import { forget } from "../src/lib/swr.js";

// A request the test answers by hand.
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((res, rej) => ((resolve = res), (reject = rej)));
  return { promise, resolve, reject };
}

describe("Resource", () => {
  beforeEach(() => forget());

  it("loads, and keeps the data while it reloads", async () => {
    const first = deferred<string>();
    const resource = new Resource("a", () => first.promise);
    const loading = resource.load();
    expect(resource.loading).toBe(true);
    first.resolve("one");
    await loading;
    expect(resource.data).toBe("one");
    expect(resource.loading).toBe(false);

    const second = deferred<string>();
    const reloading = resource.load("a", () => second.promise);
    expect(resource.data).toBe("one");
    second.reject(new Error("offline"));
    await reloading;
    expect(resource.data).toBe("one");
    expect(resource.error).toBeInstanceOf(Error);
  });

  it("drops the answer of a request that was replaced", async () => {
    const slow = deferred<string>();
    const resource = new Resource("page/1", () => slow.promise);
    const old = resource.load();
    await resource.load("page/2", async () => "two");
    slow.resolve("one");
    await old;
    expect(resource.data).toBe("two");
  });

  it("shows the cached copy of a key at once", async () => {
    await new Resource("shared", async () => "cached").load();
    const next = deferred<string>();
    const resource = new Resource("shared", () => next.promise);
    void resource.load();
    expect(resource.data).toBe("cached");
    expect(resource.loading).toBe(true);
  });

  it("polls without the loading state", async () => {
    vi.useFakeTimers();
    let n = 0;
    const resource = new Resource("live", async () => ++n);
    await resource.load();
    const stop = resource.poll(1000);
    await vi.advanceTimersByTimeAsync(1000);
    expect(resource.data).toBe(2);
    expect(resource.loading).toBe(false);
    stop();
    await vi.advanceTimersByTimeAsync(5000);
    expect(resource.data).toBe(2);
    vi.useRealTimers();
  });
});

describe("Resource.poll", () => {
  beforeEach(() => forget());

  it("skips a tick while a load is running", async () => {
    vi.useFakeTimers();
    const slow = deferred<string>();
    let calls = 0;
    // the first request is slow, any later one fails
    const resource = new Resource("busy", () => (++calls === 1 ? slow.promise : Promise.reject(new Error("offline"))));
    const loading = resource.load();
    const stop = resource.poll(1000);
    await vi.advanceTimersByTimeAsync(1000);
    slow.resolve("answer");
    await loading;
    expect(resource.data).toBe("answer");
    expect(resource.error).toBeNull();
    expect(calls).toBe(1);
    stop();
    vi.useRealTimers();
  });
});
