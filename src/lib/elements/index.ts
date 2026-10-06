// Framework-free custom elements for pages without Svelte (cringetrader, static sites):
// <m3-shape>, <m3-loading-indicator> and <m3-progress>. Importing this module registers them.
import { clipPath, shapeNames, type ShapeName } from "../shapes.js";
import { wavePath } from "../wave.js";

const isShape = (value: string | null): value is ShapeName => !!value && (shapeNames as string[]).includes(value);
const number = (value: string | null, fallback: number) => (value !== null && Number.isFinite(Number(value)) ? Number(value) : fallback);

// Safe to import during SSR or in Node: nothing touches the DOM until an element is created.
const Base = (typeof HTMLElement === "undefined" ? class {} : HTMLElement) as typeof HTMLElement;
const sheets = new Map<string, CSSStyleSheet>();

function sheet(css: string): CSSStyleSheet {
  let s = sheets.get(css);
  if (!s) {
    s = new CSSStyleSheet();
    s.replaceSync(css);
    sheets.set(css, s);
  }
  return s;
}

/** <m3-shape shape="cookie9" size="48" color="var(--md-primary-container)">icon or text</m3-shape> */
export class M3Shape extends Base {
  static observedAttributes = ["shape", "size", "color"];
  static css = `
    :host { position: relative; display: inline-grid; place-items: center; flex: none; color: var(--md-on-primary-container); }
    .fill { position: absolute; inset: 0; background: var(--md-primary-container); transition: clip-path 0.65s var(--md-spring-slow), background 0.3s; }
    .content { position: relative; display: grid; place-items: center; }
  `;
  #fill: HTMLSpanElement;

  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    root.adoptedStyleSheets = [sheet(M3Shape.css)];
    this.#fill = Object.assign(document.createElement("span"), { className: "fill" });
    const content = Object.assign(document.createElement("span"), { className: "content" });
    content.append(document.createElement("slot"));
    root.append(this.#fill, content);
  }

  connectedCallback() {
    this.#render();
  }

  attributeChangedCallback() {
    this.#render();
  }

  #render() {
    const shape = this.getAttribute("shape");
    const size = number(this.getAttribute("size"), 48);
    this.style.width = this.style.height = `${size}px`;
    this.#fill.style.clipPath = clipPath(isShape(shape) ? shape : "cookie9");
    this.#fill.style.background = this.getAttribute("color") ?? "";
  }
}

const sequence: ShapeName[] = ["softBurst", "cookie9", "pentagon", "pill", "sunny", "cookie4", "gem"];

/** <m3-loading-indicator size="48" contained label="Загрузка"></m3-loading-indicator> */
export class M3LoadingIndicator extends Base {
  static observedAttributes = ["size", "contained", "label"];
  static css = `
    :host { display: inline-flex; flex-direction: column; align-items: center; gap: 12px; }
    .box { display: grid; place-items: center; border-radius: 50%; }
    :host([contained]) .box { background: var(--md-primary-container); }
    .indicator { width: 72%; height: 72%; background: var(--md-primary); }
    :host([contained]) .indicator { background: var(--md-on-primary-container); width: 62%; height: 62%; }
    .label { font: var(--md-body-medium); color: var(--md-on-surface-variant); }
    .label:empty { display: none; }
  `;
  #box: HTMLSpanElement;
  #indicator: HTMLSpanElement;
  #label: HTMLSpanElement;
  #animation: Animation | null = null;

  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    root.adoptedStyleSheets = [sheet(M3LoadingIndicator.css)];
    this.#box = Object.assign(document.createElement("span"), { className: "box" });
    this.#indicator = Object.assign(document.createElement("span"), { className: "indicator" });
    this.#indicator.style.clipPath = clipPath(sequence[0]);
    this.#label = Object.assign(document.createElement("span"), { className: "label" });
    this.#box.append(this.#indicator);
    root.append(this.#box, this.#label);
  }

  connectedCallback() {
    this.setAttribute("role", "status");
    this.#render();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const frames = [...sequence, sequence[0]].map((shape, i) => ({ clipPath: clipPath(shape), rotate: `${i * 140}deg` }));
    this.#animation = this.#indicator.animate(frames, { duration: 650 * sequence.length, iterations: Infinity, easing: "cubic-bezier(0.38, 1.21, 0.22, 1)" });
  }

  disconnectedCallback() {
    this.#animation?.cancel();
    this.#animation = null;
  }

  attributeChangedCallback() {
    this.#render();
  }

  #render() {
    const size = number(this.getAttribute("size"), 48);
    this.#box.style.width = this.#box.style.height = `${size}px`;
    const label = this.getAttribute("label") ?? "";
    this.#label.textContent = label;
    this.setAttribute("aria-label", label || "Загрузка");
  }
}

const SVG = "http://www.w3.org/2000/svg";

/** <m3-progress value="40" max="100" tone="primary|warning|error|tertiary" flat></m3-progress> */
export class M3Progress extends Base {
  static observedAttributes = ["value", "max", "tone", "flat", "thickness"];
  static css = `
    :host { display: block; width: 100%; }
    svg { display: block; overflow: visible; }
    path { transition: d 0.5s var(--md-spring-default); }
  `;
  #svg: SVGSVGElement;
  #track: SVGLineElement;
  #stop: SVGCircleElement;
  #active: SVGPathElement;
  #resize: ResizeObserver;

  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    root.adoptedStyleSheets = [sheet(M3Progress.css)];
    this.#resize = new ResizeObserver(() => this.#render());
    this.#svg = document.createElementNS(SVG, "svg");
    this.#track = document.createElementNS(SVG, "line");
    this.#stop = document.createElementNS(SVG, "circle");
    this.#active = document.createElementNS(SVG, "path");
    this.#track.setAttribute("stroke-linecap", "round");
    for (const [k, v] of Object.entries({ fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" })) this.#active.setAttribute(k, v);
    this.#svg.append(this.#track, this.#stop, this.#active);
    root.append(this.#svg);
  }

  connectedCallback() {
    this.setAttribute("role", "progressbar");
    this.setAttribute("aria-valuemin", "0");
    this.setAttribute("aria-valuemax", "100");
    this.#resize.observe(this);
    this.#render();
  }

  disconnectedCallback() {
    this.#resize.disconnect();
  }

  attributeChangedCallback() {
    this.#render();
  }

  #render() {
    const width = this.clientWidth;
    const max = number(this.getAttribute("max"), 100);
    const fraction = max > 0 ? Math.min(1, Math.max(0, number(this.getAttribute("value"), 0) / max)) : 0;
    const wave = !this.hasAttribute("flat");
    const thickness = number(this.getAttribute("thickness"), 4);
    const height = thickness + (wave ? 8 : 0);
    const mid = height / 2;
    const tone = this.getAttribute("tone") || "primary";
    const color = `var(--md-${tone})`;
    const trackColor = tone === "primary" ? "var(--md-secondary-container)" : `var(--md-${tone}-container)`;
    this.setAttribute("aria-valuenow", String(Math.round(fraction * 100)));
    this.style.height = `${height}px`;
    this.#svg.setAttribute("width", String(width));
    this.#svg.setAttribute("height", String(height));
    if (!width) return;

    const activeEnd = fraction * width;
    const trackStart = fraction > 0 ? activeEnd + 4 + thickness / 2 : thickness / 2;
    const showTrack = trackStart < width - thickness / 2;
    this.#track.style.display = this.#stop.style.display = showTrack ? "" : "none";
    for (const [k, v] of Object.entries({ x1: trackStart, x2: width - thickness / 2, y1: mid, y2: mid, stroke: trackColor, "stroke-width": thickness })) this.#track.setAttribute(k, String(v));
    for (const [k, v] of Object.entries({ cx: width - thickness / 2, cy: mid, r: thickness / 2, fill: color })) this.#stop.setAttribute(k, String(v));
    const d = activeEnd >= thickness ? wavePath(thickness / 2, activeEnd - thickness / 2, mid, wave ? 3 : 0) : "";
    this.#active.style.display = d ? "" : "none";
    if (d) this.#active.setAttribute("d", d);
    this.#active.setAttribute("stroke", color);
    this.#active.setAttribute("stroke-width", String(thickness));
  }
}

export function defineElements(): void {
  if (typeof customElements === "undefined") return;
  const all: [string, CustomElementConstructor][] = [
    ["m3-shape", M3Shape],
    ["m3-loading-indicator", M3LoadingIndicator],
    ["m3-progress", M3Progress],
  ];
  for (const [name, ctor] of all) if (!customElements.get(name)) customElements.define(name, ctor);
}

defineElements();
