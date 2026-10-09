// Framework-free custom elements for pages without Svelte (cringetrader, static sites):
// <m3-shape>, <m3-loading-indicator> and <m3-progress>. Importing this module registers them.
import { animateLoading, restingClipPath } from "../loading.js";
import { createFollower, progressColors, progressGeometry } from "../progress.js";
import { clipPath, shapeNames, type ShapeName } from "../shapes.js";

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
    this.#indicator.style.clipPath = restingClipPath;
    this.#label = Object.assign(document.createElement("span"), { className: "label" });
    this.#box.append(this.#indicator);
    root.append(this.#box, this.#label);
  }

  connectedCallback() {
    this.setAttribute("role", "status");
    this.#render();
    this.#animation = animateLoading(this.#indicator);
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
  `;
  #svg: SVGSVGElement;
  #track: SVGLineElement;
  #stop: SVGCircleElement;
  #active: SVGPathElement;
  #resize: ResizeObserver;
  #follower = createFollower((shown) => this.#draw(shown));
  #shown = 0;

  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    root.adoptedStyleSheets = [sheet(M3Progress.css)];
    this.#resize = new ResizeObserver(() => this.#draw(this.#shown));
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
    this.#update();
  }

  disconnectedCallback() {
    this.#resize.disconnect();
    this.#follower.stop();
  }

  attributeChangedCallback() {
    this.#update();
  }

  #fraction(): number {
    const max = number(this.getAttribute("max"), 100);
    return max > 0 ? Math.min(1, Math.max(0, number(this.getAttribute("value"), 0) / max)) : 0;
  }

  #update() {
    const fraction = this.#fraction();
    this.setAttribute("aria-valuenow", String(Math.round(fraction * 100)));
    this.#follower.set(fraction);
    this.#draw(this.#shown);
  }

  #draw(shown: number) {
    this.#shown = shown;
    const width = this.clientWidth;
    const thickness = number(this.getAttribute("thickness"), 4);
    const g = progressGeometry(shown, width, thickness, !this.hasAttribute("flat"));
    const { indicator, track } = progressColors(this.getAttribute("tone") || "primary");
    this.style.height = `${g.height}px`;
    this.#svg.setAttribute("width", String(width));
    this.#svg.setAttribute("height", String(g.height));
    this.#track.style.display = this.#stop.style.display = g.track ? "" : "none";
    if (g.track) {
      for (const [k, v] of Object.entries({ x1: g.track.x1, x2: g.track.x2, y1: g.mid, y2: g.mid, stroke: track, "stroke-width": thickness })) this.#track.setAttribute(k, String(v));
      for (const [k, v] of Object.entries({ cx: g.track.x2, cy: g.mid, r: thickness / 2, fill: indicator })) this.#stop.setAttribute(k, String(v));
    }
    this.#active.style.display = g.active ? "" : "none";
    if (g.active) this.#active.setAttribute("d", g.active);
    this.#active.setAttribute("stroke", indicator);
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
