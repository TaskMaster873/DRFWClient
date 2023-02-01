/**
 * @jest-environment jsdom
 */

import {beforeEachTests, user} from "../test_setup_files/setup";
import "@testing-library/react/dist/fire-event";
import "@testing-library/jest-dom";
import { fireEvent } from "@testing-library/react";
import { LoginFormErrorType } from "../src/engine/errors/LoginFormErrorType";
import testConstants from "../Constants/testConstants";

beforeEach(async () => {
  await beforeEachTests();
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
