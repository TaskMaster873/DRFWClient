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
describe("Test TaskMaster Client Configurations", () => {
  const onSubmit = jest.fn();
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

    const handleSubmitFn = jest.fn();
    render(<Form handlesubmit={handleSubmitFn} />);

    act(() => {
      let app = new Application();
      app.start();
    });

    const user = userEvent.setup();

    await user.click(document.querySelector("a[href='/login']"));

    const inputNo = document.getElementById("noLogin");
    const inputPassword = document.getElementById("passwordLogin");

    await user.type(inputPassword, validPassword);
    await user.clear(inputNo);

    fireEvent.submit(document.querySelector("button[type='submit']"));

    await waitFor(() => {
      expect(handleSubmitFn).toHaveBeenCalledTimes(0);
    });
    expect(inputNo.value).toBe("");
    expect(inputPassword.value).toBe(validPassword);
    expect(document.getElementById("invalidLoginNoEmployee").innerHTML).toBe(
      constants.errorRequiredEmployeeNo
    );
  });

  test("Empty password should show error", async () => {
    const { Application } = require("../src/Application");
    const validNoEmployee = "523869632";

    const handleSubmitFn = jest.fn();
    render(<Form handlesubmit={handleSubmitFn} />);

    act(() => {
      let app = new Application();
      app.start();
    });

    const user = userEvent.setup();

    await user.click(document.querySelector("a[href='/login']"));

    const inputNo = document.getElementById("noLogin");
    const inputPassword = document.getElementById("passwordLogin");

    await user.type(inputNo, validNoEmployee);
    await user.clear(inputPassword);

    fireEvent.submit(document.querySelector("button[type='submit']"));

    await waitFor(() => {
      expect(handleSubmitFn).toHaveBeenCalledTimes(0);
    });
    expect(inputNo.value).toBe(validNoEmployee);
    expect(inputPassword.value).toBe("");
    expect(document.getElementById("invalidLoginPassword").innerHTML).toBe(
      constants.errorRequiredPassword
    );
  });
});
