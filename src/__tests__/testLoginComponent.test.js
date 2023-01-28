/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import MatchMediaMock from "jest-matchmedia-mock";
import { act } from "react-dom/test-utils";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms || 1000));
}

test("use jsdom in this test file", () => {
  const element = document.createElement("div");
  expect(element).not.toBeNull();
});

let matchMedia;
describe("Test TaskMaster Client Configurations", () => {
  beforeAll(() => {
    matchMedia = new MatchMediaMock();
  });

  afterEach(() => {
    matchMedia.clear();
  });
  test("should render form inputs", async () => {
    const { Application } = require("../src/Application");

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

  test("pass invalid login infos should show error", async () => {
    const { Application } = require("../src/Application");

    let app = new Application();
    app.start();
    const invalidNoEmployee = "64389917853";
    const invalidPassword = "Jgodsgj53286";

    await userEvent.click(document.querySelector("a[href='/login']"));

    const inputNo = document.getElementById("noLogin");
    const inputPassword = document.getElementById("passwordLogin");
    userEvent.type(inputNo, invalidNoEmployee);
    userEvent.type(inputPassword, invalidPassword);
    const submitBtn = document.querySelector("button[type='submit']");
    userEvent.click(submitBtn);
    expect(inputNo).toHaveValue(invalidNoEmployee);
    expect(inputPassword).toHaveValue(invalidPassword);
    expect(screen.queryByTestId("loginErrorMsg")).toHaveErrorMessage();
  });
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
