/**
 * @jest-environment jsdom
 */

import "@testing-library/react/dist/fire-event";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import MatchMediaMock from "jest-matchmedia-mock";
import { act } from "react-dom/test-utils";
import { constants } from "../src/engine/Constants";
import {
  cleanup,
  findByText,
  fireEvent,
} from "@testing-library/react";
import { LoginFormErrorType } from "../src/engine/errors/LoginFormErrorType";

let matchMedia;
let user;

const validPassword = "JfihsdEEgsd";
const validNoEmployee = "523869632";

describe("Tests LoginComponent", () => {
  let app;
  beforeEach(async () => {
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
      const { Application } = require("../src/Application");

      app = new Application();
      app.start();

      document.dispatchEvent(new Event("visibilitychange"));
    });
  });

  test("should render form inputs", async () => {
    await user.click(document.querySelector("a[href='/login']"));

    const inputNo = document.getElementById("noLogin");
    const inputPassword = document.getElementById("passwordLogin");

    expect(inputNo).not.toBeNull();
    expect(inputPassword).not.toBeNull();
    expect(inputPassword).toHaveAttribute("type", "password");
  });

  test("Empty employee number should show error", async () => {
    await user.click(document.querySelector("a[href='/login']"));

    let formElem = document.getElementById("loginForm");
    const inputNo = document.getElementById("noLogin");
    const inputPassword = document.getElementById("passwordLogin");

    await user.clear(inputNo);
    await user.type(inputPassword, validPassword);

    fireEvent.submit(formElem);

    let loginDiv = document.getElementById("loginDiv");

    const errorMessage = await findByText(
      app.rootElement,
      constants.errorRequiredEmployeeNo
    );

    expect(inputNo.value).toBe("");
    expect(inputPassword.value).toBe(validPassword);

    expect(
      document.querySelector("form").classList.contains("was-validated")
    ).toBeTruthy();

    expect(errorMessage).toBeInTheDocument();
    expect(loginDiv.dataset.error).toBe(LoginFormErrorType.INVALID_FORM);
  });

  test("Empty password should show error", async () => {
    await user.click(document.querySelector("a[href='/login']"));

    let formElem = document.getElementById("loginForm");
    const inputNo = document.getElementById("noLogin");
    const inputPassword = document.getElementById("passwordLogin");

    await user.clear(inputPassword);
    await user.type(inputNo, validNoEmployee);

    fireEvent.submit(formElem);

    let loginDiv = document.getElementById("loginDiv");

    expect(inputNo.value).toBe(validNoEmployee);
    expect(inputPassword.value).toBe("");
    expect(
      document.querySelector("form").classList.contains("was-validated")
    ).toBeTruthy();

    expect(loginDiv.dataset.error).toBe(LoginFormErrorType.INVALID_FORM);
  });

  test("Valid employee number and password should submit form", async () => {
    let loginPageButton = document.getElementById("loginLink");
    await user.click(loginPageButton);

    let loginDiv = document.getElementById("loginDiv");
    let formElem = document.getElementById("loginForm");

    const inputNo = document.getElementById("noLogin");
    const inputPassword = document.getElementById("passwordLogin");

    await user.clear(inputPassword);
    await user.clear(inputNo);
    await user.type(inputNo, validNoEmployee);
    await user.type(inputPassword, validPassword);

    fireEvent.submit(formElem);

    expect(inputNo.value).toBe(validNoEmployee);
    expect(inputPassword.value).toBe(validPassword);
    expect(
      document.querySelector("form").classList.contains("was-validated")
    ).toBeTruthy();

    expect(loginDiv.dataset.error).toBe(LoginFormErrorType.NO_ERROR);
  });
});
