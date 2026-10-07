import { describe, expect, it } from "vitest";
import { accepts, fileSize, isVideo } from "../src/lib/files";

describe("accepts", () => {
  it("matches wildcards, exact types and extensions", () => {
    expect(accepts("image/*,video/*", { name: "a.png", type: "image/png" })).toBe(true);
    expect(accepts("application/pdf", { name: "a.pdf", type: "application/pdf" })).toBe(true);
    expect(accepts("image/*,.heic", { name: "IMG_1.HEIC", type: "" })).toBe(true);
  });

  it("refuses what is not listed", () => {
    expect(accepts("image/*,video/*", { name: "notes.txt", type: "text/plain" })).toBe(false);
  });

  it("accepts anything when the list is empty", () => {
    expect(accepts("", { name: "x.bin", type: "" })).toBe(true);
  });
});

describe("isVideo", () => {
  it("recognises a screen recording without a type by its extension", () => {
    expect(isVideo({ name: "ScreenRecording.MOV", type: "" })).toBe(true);
  });
});

describe("fileSize", () => {
  it("uses a decimal comma", () => {
    expect(fileSize(1.5 * 1024 * 1024)).toBe("1,5 МБ");
    expect(fileSize(100 * 1024 * 1024)).toBe("100 МБ");
  });
});
