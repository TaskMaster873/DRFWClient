import { Application } from "./src/Application";

let app = new Application();
app.start();

// @ts-ignore
window.app = app;