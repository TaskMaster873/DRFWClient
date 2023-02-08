/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import MatchMediaMock from "jest-matchmedia-mock";
import { fireEvent, render } from "@testing-library/react";
import { FormErrorType } from "../src/engine/messages/FormMessages";
import testConstants from "../Constants/testConstants";
import userEvent from "@testing-library/user-event";


let user;
let matchMedia;

describe('Test TaskMaster Client component', () => {
    beforeAll(() => {
        matchMedia = new MatchMediaMock();
    });

    afterEach(() => {
        matchMedia.clear();
    });
    test('jsdom is Initialized', () => {
        const element = document.createElement('div');
        expect(element).not.toBeNull();
    });

    test('Test if match media is defined', () => {
        const mediaQuery = '(prefers-color-scheme: light)';
        const firstListener = jest.fn();
        const secondListener = jest.fn();
        const mql = window.matchMedia(mediaQuery);

        mql.addListener(ev => ev.matches && firstListener());
        mql.addListener(ev => ev.matches && secondListener());

        matchMedia.useMediaQuery(mediaQuery);

        expect(firstListener).toBeCalledTimes(1);
        expect(secondListener).toBeCalledTimes(1);
    });

    test('Render app without crashing', async () => {
        const {Application} = require('../src/Application')

        let app = new Application();
        app.start();
    });

    test('test dfsojsd', async () => {
        const {ComponentPopupSchedule} = require("../src/engine/components/ComponentPopupSchedule");
        expect(true);
    })
});
