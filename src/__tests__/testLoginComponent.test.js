/**
 * @jest-environment jsdom
 */

import { } from "@testing-library/react/dist/fire-event"
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import MatchMediaMock from "jest-matchmedia-mock";
import { act } from "react-dom/test-utils";
import { constants } from "../src/engine/Constants";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms || 1000));
}

let matchMedia;
describe("Tests LoginComponent", () => {
  const onSubmit = jest.fn();
  beforeEach(() => {
    //window._virtualConsole.emit = jest.fn();
    let hidden = true;
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get() {
        return hidden;
      },
      set(bool) {
        hidden = Boolean(bool);
      },
    });
  });
  beforeAll(() => {
    matchMedia = new MatchMediaMock();
  });

  afterEach(() => {
    matchMedia.clear();
  });
  test("should render form inputs", async () => {
    const { Application } = require("../src/Application");

    act(() => {
      let app = new Application();
      app.start();
    });

    const user = userEvent.setup();

    await user.click(document.querySelector("a[href='/login']"));

    const inputNo = document.getElementById("noLogin");
    const inputPassword = document.getElementById("passwordLogin");

    document.dispatchEvent(new Event("visibilitychange"));

    expect(inputNo).not.toBeNull();
    expect(inputPassword).not.toBeNull();
    expect(inputPassword).toHaveAttribute("type", "password");
  });

  test("Empty employee number should show error", async () => {
    const { Application } = require("../src/Application");
    const validPassword = "Jfihsdgsd";

    onSubmit.mockImplementation((event) => {
      event.preventDefault();
    });

    act(() => {
      let app = new Application();
      app.start();
    });

    const user = userEvent.setup();

    await user.click(document.querySelector("a[href='/login']"));

    const inputNo = document.getElementById("noLogin");
    const inputPassword = document.getElementById("passwordLogin");

    await user.clear(inputNo);
    await user.type(inputPassword, validPassword);

    await user.click(document.querySelector("button[type='submit']"));

    const errorMessage = await findByText(constants.errorRequiredEmployeeNo);

    expect(inputNo.value).toBe("");
    expect(inputPassword.value).toBe(validPassword);
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(
      document.querySelector("form").classList.contains("was-validated")
    ).toBeTruthy();
    expect(errorMessage).toBeInTheDocument();
  });

  test("Empty password should show error", async () => {
    const { Application } = require("../src/Application");
    const validNoEmployee = "523869632";

    act(() => {
      let app = new Application();
      app.start();
    });

    const user = userEvent.setup();

    await user.click(document.querySelector("a[href='/login']"));

    const inputNo = document.getElementById("noLogin");
    const inputPassword = document.getElementById("passwordLogin");

    await user.clear(inputPassword);
    await user.type(inputNo, validNoEmployee);

    await user.click(document.querySelector("button[type='submit']"));

    expect(inputNo.value).toBe(validNoEmployee);
    expect(inputPassword.value).toBe("");
    expect(
      document.querySelector("form").classList.contains("was-validated")
    ).toBeTruthy();
    expect(document.getElementById("invalidLoginNoEmployee")).toHaveStyle(
      "display: none;"
    );
    /*     expect(
      window.getComputedStyle(document.getElementById("invalidLoginNoEmployee"))
        .display
    ).toBe("block");
    expect(
      window.getComputedStyle(document.getElementById("invalidLoginPassword"))
        .display
    ).toBe("none"); */
  });

  test("Valid employee number and password should submit form", async () => {
    const { Application } = require("../src/Application");
    const validNoEmployee = "523869632";
    const validPassword = "Jfihsdgsd";

    act(() => {
      let app = new Application();
      app.start();
    });

    const user = userEvent.setup();

    await user.click(document.querySelector("a[href='/login']"));

    const inputNo = document.getElementById("noLogin");
    const inputPassword = document.getElementById("passwordLogin");

    await user.clear(inputPassword);
    await user.clear(inputNo);
    await user.type(inputNo, validNoEmployee);
    await user.type(inputPassword, validPassword);

    //fireEvent.submit(document.querySelector("button[type='submit']"));
    await user.click(document.querySelector("button[type='submit']"));

    expect(inputNo.value).toBe(validNoEmployee);
    expect(inputPassword.value).toBe(validPassword);
    expect(
      document.querySelector("form").classList.contains("was-validated")
    ).toBeTruthy();
    expect(
      window.getComputedStyle(document.getElementById("invalidLoginNoEmployee"))
        .display
    ).toBe("none");
    expect(
      window.getComputedStyle(document.getElementById("invalidLoginPassword"))
        .display
    ).toBe("none");
  });
});
