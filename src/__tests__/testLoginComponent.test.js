/**
 * @jest-environment jsdom
 */

import { screen, render, waitFor, fireEvent } from "@testing-library/react";
import Form from "react-bootstrap/Form";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import MatchMediaMock from "jest-matchmedia-mock";
import { act } from "react-dom/test-utils";
import { constants } from "../src/engine/Constants";

let matchMedia;
describe("Tests LoginComponent", () => {
  beforeEach(() => {
    window._virtualConsole.emit = jest.fn();
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

    expect(inputNo).not.toBeNull();
    expect(inputPassword).not.toBeNull();
    expect(inputPassword).toHaveAttribute("type", "password");
  });

  test("Empty employee number should show error", async () => {
    const { Application } = require("../src/Application");
    const validPassword = "Jfihsdgsd";

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

    //fireEvent.submit(document.querySelector("button[type='submit']"));
    await user.click(document.querySelector("button[type='submit']"));

    expect(inputNo.value).toBe("");
    expect(inputPassword.value).toBe(validPassword);
    expect(
      document.querySelector("form").classList.contains("was-validated")
    ).toBeTruthy();
    /*     expect(
      document.getElementById("invalidLoginNoEmployee").style.display
    ).toBe("block"); */
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
    /*     expect(document.getElementById("invalidLoginPassword").hidden).toBeFalsy();
    expect(
      document.getElementById("invalidLoginNoEmployee").hidden
    ).toBeFalsy(); */
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
    /*     expect(
      document.getElementById("invalidLoginNoEmployee").style.display
    ).toBe("");
    expect(document.getElementById("invalidLoginPassword").style.display).toBe(
      ""
    ); */
  });
});
