import { cleanup } from "@testing-library/react";
import MatchMediaMock from "jest-matchmedia-mock";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";

global.IS_REACT_ACT_ENVIRONMENT = true;

// In your test setup file
// eslint-disable-next-line no-undef
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let matchMedia;
let user;
let app;

let assignMock;


async function beforeEachTests() {
    user = userEvent.setup();
    if (matchMedia) {
        await matchMedia.clear();
    }

    cleanup();

    if (app !== null && app) {
        act(() => {
            app.unmount();
        });

        document.body.innerHTML = "";
        app = null;
    }

    matchMedia = new MatchMediaMock();

    act(() => {
        const {Application} = require("../src/Application");

        app = new Application();
        app.start();

        document.dispatchEvent(new Event("visibilitychange"));
    });
}

export {beforeEachTests, matchMedia, user, assignMock};