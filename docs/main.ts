import { mount } from "svelte";
import "../src/lib/styles/ui.css";
import "../src/lib/elements/index.js";
import App from "./App.svelte";

mount(App, { target: document.getElementById("app")! });
