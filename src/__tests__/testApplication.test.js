/**
 * @jest-environment jsdom
 */
import MatchMediaMock from 'jest-matchmedia-mock';

let matchMedia;
describe('Test TaskMaster Client Configurations', () => {
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
        const { Application } = require('../src/Application')

        let app = new Application();
        app.start();
    });
});
