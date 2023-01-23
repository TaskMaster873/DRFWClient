
import React from 'react';
import ReactDOM from 'react-dom/client';

import { Logger } from "./engine/Logger";
import { Engine } from './engine/Engine';
import reportWebVitals from './engine/analytics/reportWebVitals';

export class Application extends Logger {
    public moduleName: string = 'Application';
    public logColor: string = `#20dbf6`;

    private rootElem: HTMLElement | null = null;
    private root: ReactDOM.Root | null = null;

    constructor() {
        super();
    }

    private onReportStatistics(objective: any) : void {
        //console.log(objective); wasssssup
    }

    private registerEvents() : void {
        reportWebVitals(this.onReportStatistics.bind(this));

        window.addEventListener('DOMContentLoaded', async (event) => {
            let start = Date.now();
            await this.waitForRoot();

            this.log(`Took ${Date.now() - start}ms to initialize...`);
        });
    }

    private renderCore() : void {
        if(this.rootElem !== null && this.rootElem) {
            this.root = ReactDOM.createRoot(this.rootElem);

            this.root.render(
                <React.StrictMode>
                    <Engine />
                </React.StrictMode>
            );
        } else {
            this.error('Root element is null or undefined!');
        }
    }

    private getDocumentRoot(selector: string) : HTMLElement | null {
        let elem = document.getElementById(selector);

        return elem;
    }

    private awaitForHtmlElement(selector: string) : Promise<HTMLElement> {
        return new Promise((resolve: (value: HTMLElement | PromiseLike<HTMLElement>) => void, reject: (reason?: any) => void) => {
            let elem = this.getDocumentRoot(selector);

            if(elem !== null && elem) {
                resolve(elem);
            } else {
                let waitInterval = setInterval(() => {
                    elem = this.getDocumentRoot(selector);
                    if(elem !== null && elem) {
                        clearInterval(waitInterval);
                        resolve(elem);
                    }
                }, 250);
            }
        });
    }

    private async waitForRoot() : Promise<void> {
        this.rootElem = await this.awaitForHtmlElement('root');
        this.renderCore();
    }

    public async start() : Promise<void> {
        this.log('Starting application...');

        this.registerEvents();
    }
}

