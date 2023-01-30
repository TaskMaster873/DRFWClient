/**
 * @jest-environment jsdom
 */

import "@testing-library/react/dist/fire-event";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import MatchMediaMock from "jest-matchmedia-mock";
import { act } from "react-dom/test-utils";
import { constants } from "../src/engine/Constants";
import { cleanup, findByText, fireEvent } from "@testing-library/react";
import { LoginFormErrorType } from "../src/engine/errors/LoginFormErrorType";

let matchMedia;
let user;

const validNoEmployee = "523696";
const validPassword = "JfihsdEEgsd";

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

  const { inputPassword, form, inputNo } = getFields();

  expect(form).not.toBeNull();
  expect(inputNo).not.toBeNull();
  expect(inputPassword).not.toBeNull();
  expect(inputNo).toHaveAttribute("type", "number");
  expect(inputPassword).toHaveAttribute("type", "password");
});

describe("Empty Fields Login Tests", () => {
  test("Empty employee number should show error", async () => {
    await user.click(document.querySelector("a[href='/login']"));

    const { inputPassword, form, inputNo } = getFields();

    await user.type(inputPassword, validPassword);

    fireEvent.submit(form);

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
    expect(form.dataset.error).toBe(LoginFormErrorType.INVALID_FORM);
  });

  test("Empty password should show error", async () => {
    await user.click(document.querySelector("a[href='/login']"));

    const { inputPassword, form, inputNo } = getFields();

    await user.type(inputNo, validNoEmployee);

    fireEvent.submit(form);

    const errorMessage = await findByText(
      app.rootElement,
      constants.errorRequiredPassword
    );

    expect(inputNo.value).toBe(validNoEmployee);
    expect(inputPassword.value).toBe("");
    expect(form.classList.contains("was-validated")).toBeTruthy();

    expect(errorMessage).toBeInTheDocument();
    expect(form.dataset.error).toBe(LoginFormErrorType.INVALID_FORM);
  });
});

test("Valid employee number and password should submit form", async () => {
  await user.click(document.querySelector("a[href='/login']"));

  const { inputPassword, form, inputNo } = getFields();

  await user.type(inputNo, validNoEmployee);
  await user.type(inputPassword, validPassword);

  fireEvent.submit(form);

  expect(inputNo.value).toBe(validNoEmployee);
  expect(inputPassword.value).toBe(validPassword);
  expect(form.classList.contains("was-validated")).toBeTruthy();

  expect(form.dataset.error).toBe(LoginFormErrorType.NO_ERROR);
});
function getFields() {
  const form = document.querySelector("form");
  const inputNo = document.getElementById("noLogin");
  const inputPassword = document.getElementById("passwordLogin");
  return { inputPassword, form, inputNo };
}
