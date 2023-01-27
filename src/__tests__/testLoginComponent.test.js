/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { ComponentLogin } from "../src/engine/components/ComponentLogin";

test("render form inputs", () => {
  render(<ComponentLogin />);

  const inputs = screen.getAllByRole("input");
  const inputEmail = screen.getByTestId("noLogin");
  const inputPassword = screen.getByTestId("passwordLogin");
  expect(inputEmail).toBeInTheDocument();
  expect(inputPassword).toBeInTheDocument();
  expect(inputs).toHaveLength(2);
  expect(inputPassword).toHaveAttribute("type", "password");
});

test("pass invalid login infos should show error", () => {
  render(<ComponentLogin />);

  const invalidNoEmployee = "64389917853";
  const invalidPassword = "Jgodsgj53286";
  const inputNoLogin = screen.getByTestId("noLogin");
  userEvent.type(inputNoLogin, invalidNoEmployee);
  const inputPasswordLogin = screen.getByTestId("passwordLogin");
  userEvent.type(inputPasswordLogin, invalidPassword);
  const submitBtn = screen.getByTestId("submitLogin");
  userEvent.click(submitBtn);

  expect(inputNoLogin).toHaveValue(invalidNoEmployee);
  expect(inputPasswordLogin).toHaveValue(invalidPassword);
  expect(screen.queryByTestId("loginErrorMsg")).toHaveErrorMessage();
});

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

let matchMedia;
describe("Test TaskMaster Client Configurations", () => {
  beforeAll(() => {
    matchMedia = new MatchMediaMock();
  });

  afterEach(() => {
    matchMedia.clear();
  });

  test("Test if match media is defined", () => {
    const mediaQuery = "(prefers-color-scheme: light)";
    const firstListener = jest.fn();
    const secondListener = jest.fn();
    const mql = window.matchMedia(mediaQuery);

    mql.addListener((ev) => ev.matches && firstListener());
    mql.addListener((ev) => ev.matches && secondListener());

    matchMedia.useMediaQuery(mediaQuery);

    expect(firstListener).toBeCalledTimes(1);
    expect(secondListener).toBeCalledTimes(1);
  });

  test("Render app without crashing", () => {
    const { Application } = require("../src/Application");

    let app = new Application();
    app.start();
  });
});
