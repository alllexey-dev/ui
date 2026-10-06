import { mount } from "svelte";
import "../src/lib/styles/ui.css";
import { defineElements } from "../src/lib/elements/index.js";
import App from "./App.svelte";

// Called explicitly: a bare side-effect import of the elements module is tree-shaken in production builds.
defineElements();
mount(App, { target: document.getElementById("app")! });
