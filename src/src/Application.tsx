import React from "react";
import ReactDOM from "react-dom/client";

import { Engine } from "./engine/Engine";

export class Application {
    private rootElem: HTMLElement | null = null;
    private root: ReactDOM.Root | null = null;
    
    public start() {
        this.registerEvents();
    }

    private registerEvents() {
        this.renderCore();
    }

    private defineRoot(): void {
        if(this.rootElem === null || !this.rootElem) {
            this.rootElem = document.createElement("div");
            this.rootElem.style.width = "100%";
            this.rootElem.style.height = "100vh";
            this.rootElem.id = "root";

            document.body.appendChild(this.rootElem);
        }
    }
    
    private renderCore(): void {
        this.defineRoot();
        
        if (this.rootElem !== null && this.rootElem) {
            this.root = ReactDOM.createRoot(this.rootElem);

            this.root.render(
                <Engine />
            );
        } else {
            console.error("Root element is null or undefined!");
        }
    }

    private elementExists(element: any): boolean {
        return element !== null && element !== undefined;
    }

    public unmount(): void {
        if (this.elementExists(this.root)) {
            this.root?.unmount();
        }
    }

}
