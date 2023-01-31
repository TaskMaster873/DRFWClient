/**
 * @jest-environment jsdom
 */

import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import MatchMediaMock from "jest-matchmedia-mock";
import { act } from "react-dom/test-utils";
import { cleanup, fireEvent } from "@testing-library/react";
import { LoginFormErrorType } from "../src/engine/errors/LoginFormErrorType";
import testConstants from "../Constants/testConstants";

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
  await user.click(document.querySelector("a[href='/employees']"));
  await user.click(document.querySelector("a[href='/add-employee']"));
});

test("should render form inputs", async () => {
  const {
    form,
    inputNo,
    inputFirstName,
    inputName,
    inputPhoneNumber,
    inputInitialPassword,
  } = getFields();

  expect(form).not.toBeNull();
  expect(inputNo).not.toBeNull();
  expect(inputFirstName).not.toBeNull();
  expect(inputName).not.toBeNull();
  expect(inputPhoneNumber).not.toBeNull();
  expect(inputInitialPassword).not.toBeNull();
  expect(inputPhoneNumber).toHaveAttribute("type", "tel");
  expect(inputInitialPassword).toHaveAttribute("type", "password");
});

describe("Empty Fields Login Tests", () => {
  test("Empty employee number should show error", async () => {
    const {
      form,
      inputNo,
      inputFirstName,
      inputName,
      inputPhoneNumber,
      inputInitialPassword,
    } = getFields();

    await user.type(inputFirstName, testConstants.validFirstName);
    await user.type(inputName, testConstants.validName);
    await user.type(inputPhoneNumber, testConstants.validPhoneNumber);
    await user.type(inputInitialPassword, testConstants.validPassword);

    fireEvent.submit(form);

    expect(inputNo.value).toBe("");
    expect(inputFirstName.value).toBe(testConstants.validFirstName);
    expect(inputPhoneNumber.value).toBe(testConstants.validPhoneNumber);
    expect(inputInitialPassword.value).toBe(testConstants.validPassword);

    expect(form.classList.contains("was-validated")).toBeTruthy();

    expect(form.dataset.error).toBe(LoginFormErrorType.INVALID_FORM);
  });

  test("Empty first name should show error", async () => {
    const {
      form,
      inputNo,
      inputFirstName,
      inputName,
      inputPhoneNumber,
      inputInitialPassword,
    } = getFields();

    await user.type(inputNo, testConstants.validNoEmployee);
    await user.type(inputName, testConstants.validName);
    await user.type(inputPhoneNumber, testConstants.validPhoneNumber);
    await user.type(inputInitialPassword, testConstants.validPassword);

    fireEvent.submit(form);

    expect(inputNo.value).toBe(testConstants.validNoEmployee);
    expect(inputFirstName.value).toBe("");
    expect(inputName.value).toBe(testConstants.validName);
    expect(inputPhoneNumber.value).toBe(testConstants.validPhoneNumber);
    expect(inputInitialPassword.value).toBe(testConstants.validPassword);
    expect(form.classList.contains("was-validated")).toBeTruthy();
    expect(form.dataset.error).toBe(LoginFormErrorType.INVALID_FORM);
  });

  test("Empty name should show error", async () => {
    const {
      form,
      inputNo,
      inputFirstName,
      inputName,
      inputPhoneNumber,
      inputInitialPassword,
    } = getFields();

    await user.type(inputNo, testConstants.validNoEmployee);
    await user.type(inputFirstName, testConstants.validFirstName);
    await user.type(inputPhoneNumber, testConstants.validPhoneNumber);
    await user.type(inputInitialPassword, testConstants.validPassword);

    fireEvent.submit(form);

    expect(inputNo.value).toBe(testConstants.validNoEmployee);
    expect(inputFirstName.value).toBe(testConstants.validFirstName);
    expect(inputName.value).toBe("");
    expect(inputPhoneNumber.value).toBe(testConstants.validPhoneNumber);
    expect(inputInitialPassword.value).toBe(testConstants.validPassword);
    expect(form.classList.contains("was-validated")).toBeTruthy();
    expect(form.dataset.error).toBe(LoginFormErrorType.INVALID_FORM);
  });

  test("Empty phone number should show error", async () => {
    const {
      form,
      inputNo,
      inputFirstName,
      inputName,
      inputPhoneNumber,
      inputInitialPassword,
    } = getFields();

    await user.type(inputNo, testConstants.validNoEmployee);
    await user.type(inputFirstName, testConstants.validFirstName);
    await user.type(inputName, testConstants.validName);
    await user.type(inputInitialPassword, testConstants.validPassword);

    fireEvent.submit(form);

    expect(inputNo.value).toBe(testConstants.validNoEmployee);
    expect(inputFirstName.value).toBe(testConstants.validFirstName);
    expect(inputName.value).toBe(testConstants.validName);
    expect(inputPhoneNumber.value).toBe("");
    expect(inputInitialPassword.value).toBe(testConstants.validPassword);
    expect(form.classList.contains("was-validated")).toBeTruthy();
    expect(form.dataset.error).toBe(LoginFormErrorType.INVALID_FORM);
  });

  test("Empty initial password should show error", async () => {
    const {
      form,
      inputNo,
      inputFirstName,
      inputName,
      inputPhoneNumber,
      inputInitialPassword,
    } = getFields();

    await user.type(inputNo, testConstants.validNoEmployee);
    await user.type(inputFirstName, testConstants.validFirstName);
    await user.type(inputName, testConstants.validName);
    await user.type(inputPhoneNumber, testConstants.validPhoneNumber);

    fireEvent.submit(form);

    expect(inputNo.value).toBe(testConstants.validNoEmployee);
    expect(inputFirstName.value).toBe(testConstants.validFirstName);
    expect(inputName.value).toBe(testConstants.validName);
    expect(inputPhoneNumber.value).toBe(testConstants.validPhoneNumber);
    expect(inputInitialPassword.value).toBe("");
    expect(form.classList.contains("was-validated")).toBeTruthy();
    expect(form.dataset.error).toBe(LoginFormErrorType.INVALID_FORM);
  });
});

test("Invalid employee number regex should show error", async () => {
  const {
    form,
    inputNo,
    inputFirstName,
    inputName,
    inputPhoneNumber,
    inputInitialPassword,
  } = getFields();

  await user.type(inputNo, testConstants.invalidNoEmployee);
  await user.type(inputFirstName, testConstants.validFirstName);
  await user.type(inputName, testConstants.validName);
  await user.type(inputPhoneNumber, testConstants.validPhoneNumber);
  await user.type(inputInitialPassword, testConstants.validPassword);

  fireEvent.submit(form);

  expect(inputNo.value).toBe(testConstants.invalidNoEmployee);
  expect(inputFirstName.value).toBe(testConstants.validFirstName);
  expect(inputPhoneNumber.value).toBe(testConstants.validPhoneNumber);
  expect(inputInitialPassword.value).toBe(testConstants.validPassword);
  expect(form.classList.contains("was-validated")).toBeTruthy();
  expect(form.dataset.error).toBe(LoginFormErrorType.INVALID_FORM);
});

test("Invalid phone number regex should show error", async () => {
  const {
    form,
    inputNo,
    inputFirstName,
    inputName,
    inputPhoneNumber,
    inputInitialPassword,
  } = getFields();

  await user.type(inputNo, testConstants.validNoEmployee);
  await user.type(inputFirstName, testConstants.validFirstName);
  await user.type(inputName, testConstants.validName);
  await user.type(inputPhoneNumber, testConstants.invalidPhoneNumber);
  await user.type(inputInitialPassword, testConstants.validPassword);

  fireEvent.submit(form);

  expect(inputNo.value).toBe(testConstants.validNoEmployee);
  expect(inputFirstName.value).toBe(testConstants.validFirstName);
  expect(inputPhoneNumber.value).toBe(testConstants.invalidPhoneNumber);
  expect(inputInitialPassword.value).toBe(testConstants.validPassword);
  expect(form.classList.contains("was-validated")).toBeTruthy();
  expect(form.dataset.error).toBe(LoginFormErrorType.INVALID_FORM);
});

test("Invalid initial password regex should show error", async () => {
  const {
    form,
    inputNo,
    inputFirstName,
    inputName,
    inputPhoneNumber,
    inputInitialPassword,
  } = getFields();

  await user.type(inputNo, testConstants.validNoEmployee);
  await user.type(inputFirstName, testConstants.validFirstName);
  await user.type(inputName, testConstants.validName);
  await user.type(inputPhoneNumber, testConstants.validPhoneNumber);
  await user.type(inputInitialPassword, testConstants.invalidPassword);

  fireEvent.submit(form);

  expect(inputNo.value).toBe(testConstants.validNoEmployee);
  expect(inputFirstName.value).toBe(testConstants.validFirstName);
  expect(inputPhoneNumber.value).toBe(testConstants.validPhoneNumber);
  expect(inputInitialPassword.value).toBe(testConstants.invalidPassword);
  expect(form.classList.contains("was-validated")).toBeTruthy();
  expect(form.dataset.error).toBe(LoginFormErrorType.INVALID_FORM);
});

test("Valid employee number and password should submit form", async () => {
  const {
    form,
    inputNo,
    inputFirstName,
    inputName,
    inputPhoneNumber,
    inputInitialPassword,
  } = getFields();

  await user.type(inputNo, testConstants.validNoEmployee);
  await user.type(inputFirstName, testConstants.validFirstName);
  await user.type(inputName, testConstants.validName);
  await user.type(inputPhoneNumber, testConstants.validPhoneNumber);
  await user.type(inputInitialPassword, testConstants.validPassword);

  fireEvent.submit(form);

  expect(inputNo.value).toBe(testConstants.validNoEmployee);
  expect(inputFirstName.value).toBe(testConstants.validFirstName);
  expect(inputPhoneNumber.value).toBe(testConstants.validPhoneNumber);
  expect(inputInitialPassword.value).toBe(testConstants.validPassword);
  expect(form.classList.contains("was-validated")).toBeTruthy();
  expect(form.dataset.error).toBe(LoginFormErrorType.NO_ERROR);
});

function getFields() {
  const form = document.querySelector("form");
  const inputNo = document.getElementById("noAddEmployee");
  const inputFirstName = document.getElementById("firstNameAddEmployee");
  const inputName = document.getElementById("nameAddEmployee");
  const inputPhoneNumber = document.getElementById("phoneNumberAddEmployee");
  const inputInitialPassword = document.getElementById(
    "initialPasswordAddEmployee"
  );
  return {
    form,
    inputNo,
    inputFirstName,
    inputName,
    inputPhoneNumber,
    inputInitialPassword,
  };
}
