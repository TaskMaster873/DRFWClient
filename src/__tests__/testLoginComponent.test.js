/**
 * @jest-environment jsdom
 */

import "@testing-library/react/dist/fire-event";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import MatchMediaMock from "jest-matchmedia-mock";
import { act } from "react-dom/test-utils";
import { cleanup, fireEvent } from "@testing-library/react";
import { LoginFormErrorType } from "../src/engine/errors/LoginFormErrorType";
import testConstants from "../Constants/testConstants";

global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
};

let matchMedia;
let user;

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
  await user.click(document.querySelector("a[href='/login']"));
});

test("should render form inputs", async () => {
  const { inputPassword, form, inputNo } = getFields();

  expect(form).not.toBeNull();
  expect(inputNo).not.toBeNull();
  expect(inputPassword).not.toBeNull();
  expect(inputNo).toHaveAttribute("type", "number");
  expect(inputPassword).toHaveAttribute("type", "password");
});

describe("Empty Fields Login Tests", () => {
  test("Empty employee number should show error", async () => {
    const { inputPassword, form, inputNo } = getFields();

    await user.type(inputPassword, testConstants.validPassword);

    fireEvent.submit(form);

    expect(inputNo.value).toBe("");
    expect(inputPassword.value).toBe(testConstants.validPassword);
    expect(form.classList.contains("was-validated")).toBeTruthy();
    expect(form.dataset.error).toBe(LoginFormErrorType.INVALID_FORM);
  });

  test("Empty password should show error", async () => {
    const { inputPassword, form, inputNo } = getFields();

    await user.type(inputNo, testConstants.validNoEmployee);

    fireEvent.submit(form);

    expect(inputNo.value).toBe(testConstants.validNoEmployee);
    expect(inputPassword.value).toBe("");
    expect(form.classList.contains("was-validated")).toBeTruthy();
    expect(form.dataset.error).toBe(LoginFormErrorType.INVALID_FORM);
  });
});

test("Valid employee number and password should submit form", async () => {
  const { inputPassword, form, inputNo } = getFields();

  await user.type(inputNo, testConstants.validNoEmployee);
  await user.type(inputPassword, testConstants.validPassword);

  fireEvent.submit(form);

  expect(inputNo.value).toBe(testConstants.validNoEmployee);
  expect(inputPassword.value).toBe(testConstants.validPassword);
  expect(form.classList.contains("was-validated")).toBeTruthy();
  expect(form.dataset.error).toBe(LoginFormErrorType.NO_ERROR);
});
function getFields() {
  const form = document.querySelector("form");
  const inputNo = document.getElementById("noLogin");
  const inputPassword = document.getElementById("passwordLogin");
  return { inputPassword, form, inputNo };
}
