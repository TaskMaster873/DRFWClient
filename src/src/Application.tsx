import React from "react";
import ReactDOM from "react-dom/client";

import { Logger } from "./engine/Logger";
import { Engine } from "./engine/Engine";
import reportWebVitals from "./engine/analytics/reportWebVitals";
import { WebsocketManager } from "./engine/networking/WebsocketManager";

export class Application extends Logger {
  public moduleName: string = "Application";
  public logColor: string = `#20dbf6`;

  private rootElem: HTMLElement | null = null;
  private root: ReactDOM.Root | null = null;

  private websocketManager: WebsocketManager = new WebsocketManager();

  constructor() {
    super();
  }

  private onReportStatistics(objective: any): void {}

  get rootElement(): HTMLElement | null {
    return this.rootElem;
  }

  private registerEvents() {
    let start = Date.now();

    reportWebVitals(this.onReportStatistics.bind(this));
    this.rootElem = document.createElement("div");
    this.rootElem.id = "root";
    document.body.appendChild(this.rootElem);

    this.renderCore();
    if (!this.isNode()) {
      this.websocketManager.init();
    }

    this.log(`Took ${Date.now() - start}ms to initialize...`);
  }

  private isNode() {
    let isNode = false;
    try {
      isNode = process != undefined;
    } catch (e) {}
    return isNode;
  }

  private elementExists(element: any): boolean {
    return element !== null && element !== undefined;
  }

  public unmount(): void {
    if (this.elementExists(this.root)) {
      this.root?.unmount();
    }
  }

  private renderCore(): void {
    if (this.rootElem !== null && this.rootElem) {
      this.root = ReactDOM.createRoot(this.rootElem);

      this.root.render(
        <React.StrictMode>
          <Engine />
        </React.StrictMode>
      );

      //ReactDOM.render(<Engine />, this.rootElem);
    } else {
      this.error("Root element is null or undefined!");
    }
  }

  public start() {
    this.log("Starting application...");

    this.registerEvents();
  }
}
/*
 import React from "react";
import ReactDOM from "react-dom/client";

import { Logger } from "./engine/Logger";
import { Engine } from "./engine/Engine";
import reportWebVitals from "./engine/analytics/reportWebVitals";

export class Application extends Logger {
  public moduleName: string = "Application";
  public logColor: string = `#20dbf6`;

  private rootElem: HTMLElement | null = null;
  private root: ReactDOM.Root | null = null;

  constructor() {
    super();
  }

  private onReportStatistics(objective: any): void {
    //console.log(objective); wasssusp
  }

  private registerEvents(): Promise<void> {
    return new Promise((resolve: any) => {
      reportWebVitals(this.onReportStatistics.bind(this));
      document.onload = () => console.log("tests");
      window.addEventListener("DOMContentLoaded", async (event) => {

        let start = Date.now();
        await this.waitForRoot();

        this.log(`Took ${Date.now() - start}ms to initialize...`);
        resolve();
      });
    });
  }

  private renderCore(): void {
    if (this.rootElem !== null && this.rootElem) {
      this.root = ReactDOM.createRoot(this.rootElem);

      this.root.render(
        <React.StrictMode>
          <Engine />
        </React.StrictMode>
      );

      //ReactDOM.render(<Engine />, this.rootElem);
    } else {
      this.error("Root element is null or undefined!");
    }
  }

  private getDocumentRoot(selector: string): HTMLElement | null {
    let elem = document.getElementById(selector);

    return elem;
  }

  private awaitForHtmlElement(selector: string): Promise<HTMLElement> {
    return new Promise(
      (
        resolve: (value: HTMLElement | PromiseLike<HTMLElement>) => void,
        reject: (reason?: any) => void
      ) => {
        let elem = this.getDocumentRoot(selector);

        if (elem !== null && elem) {
          resolve(elem);
        } else {
          let waitInterval = setInterval(() => {
            elem = this.getDocumentRoot(selector);
            if (elem !== null && elem) {
              clearInterval(waitInterval);
              resolve(elem);
            }
          }, 250);
        }
      }
    );
  }

  private async waitForRoot(): Promise<void> {
    this.rootElem = await this.awaitForHtmlElement("root");
    this.renderCore();
  }

  public async start(): Promise<void> {
    this.log("Starting application...");

    await this.registerEvents();
  }
}
*/
