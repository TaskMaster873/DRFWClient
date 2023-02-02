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
        } else {
            this.error("Root element is null or undefined!");
        }
    }

    public start() {
        this.log("Starting application...");

        this.registerEvents();
    }
}