/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import MatchMediaMock from 'jest-matchmedia-mock';
import {act} from "react-dom/test-utils";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms || 1000));
}

test('use jsdom in this test file', () => {
  const element = document.createElement('div');
  expect(element).not.toBeNull();
});

let matchMedia;
describe('Test TaskMaster Client Configurations', () => {
  beforeAll(() => {
    matchMedia = new MatchMediaMock();
  });

  afterEach(() => {
    matchMedia.clear();
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
    await app.start();
  });

  test("should render form inputs", async () => {
    const { Application } = require('../src/Application')

    await act(() => {
      let app = new Application();
      app.start();
    });

    const user = userEvent.setup();

    console.log(document.getElementById("loginLink"));
    await user.click();
    await sleep(1000);

    const inputNo = document.getElementById("noLogin");
    const inputPassword = document.getElementById("passwordLogin");

    expect(inputNo).not.toBeNull();
    expect(inputPassword).not.toBeNull();
    expect(inputPassword).toHaveAttribute("type", "password");
  });
});

  /**/

  /*
  test("pass invalid login infos should show error", async () => {
    const { Application } = require("../src/Application");

    let app = new Application();
    app.start();

    const connexionBtn = await screen.getByRole("button", {
      name: "Connexion",
    });

    const invalidNoEmployee = "64389917853";
    const invalidPassword = "Jgodsgj53286";
    const inputNo = await screen.findByTestId("noLogin");
    userEvent.type(inputNo, invalidNoEmployee);
    const inputPasswordLogin = await screen.findByTestId("passwordLogin");
    userEvent.type(inputPasswordLogin, invalidPassword);
    const submitBtn = await screen.findByTestId("submitLogin");
    userEvent.click(submitBtn);

    expect(inputNoLogin).toHaveTextContent(invalidNoEmployee);
    expect(inputPasswordLogin).toHaveValue(invalidPassword);
    expect(screen.queryByTestId("loginErrorMsg")).toHaveErrorMessage();
  }); */

  /* test("pass valid login infos should not show error and send user to home page", () => {
    render(<ComponentLogin />);

    const validNoEmployee = "532988632";
    const validPassword = "jidosgsi532523";
    const inputNoLogin = screen.getByTestId("noLogin");
    userEvent.type(inputNoLogin, validNoEmployee);
    const inputPasswordLogin = screen.getByTestId("passwordLogin");
    userEvent.type(inputPasswordLogin, validPassword);
    const submitBtn = screen.getByTestId("submitLogin");
    userEvent.click(submitBtn);

    expect(inputNoLogin).toHaveValue(validNoEmployee);
    expect(inputPasswordLogin).toHaveValue(validPassword);
    expect(screen.queryByTestId("loginErrorMsg")).not.toHaveErrorMessage();
  }); */