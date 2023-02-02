import React from "react";
import ReactDOM from "react-dom/client";

import { Engine } from "./engine/Engine";

import { WebsocketManager } from "./engine/networking/WebsocketManager";

export class Application {
    private rootElem: HTMLElement | null = null;
    private root: ReactDOM.Root | null = null;

    private websocketManager: WebsocketManager = new WebsocketManager();

    constructor() {

    }
    
    private defineRoot(): void {
        if(this.rootElem === null || !this.rootElem) {
            this.rootElem = document.createElement("div");
            this.rootElem.id = "root";

            document.body.appendChild(this.rootElem);
        }
    }

    private registerEvents() {
        this.renderCore();
        if (!this.isNode()) {
            this.websocketManager.init();
        }
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
        this.defineRoot();
        
        if (this.rootElem !== null && this.rootElem) {
            this.root = ReactDOM.createRoot(this.rootElem);

            this.root.render(
                <React.StrictMode>
                    <Engine />
                </React.StrictMode>
            );
        } else {
            console.error("Root element is null or undefined!");
        }
    }

    public start() {
        this.registerEvents();
    }
}