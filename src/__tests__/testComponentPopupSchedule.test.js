/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import MatchMediaMock from "jest-matchmedia-mock";
import { fireEvent, render } from "@testing-library/react";
import { FormErrorType } from "../src/engine/messages/FormMessages";
import testConstants from "../Constants/testConstants";
import userEvent from "@testing-library/user-event";
import {MemoryRouter} from "react-router-dom";

let user;
let matchMedia;

describe("Test TaskMaster Client component", () => {
  beforeAll(() => {
    matchMedia = new MatchMediaMock();
  });

  afterEach(() => {
    matchMedia.clear();
  });
  test("jsdom is Initialized", () => {
    const element = document.createElement("div");
    expect(element).not.toBeNull();
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

  test("Render app without crashing", async () => {
    const { Application } = require("../src/Application");

    let app = new Application();
    app.start();
  });

  test("test all are not rendered when isShowing is false", async () => {
    const {ComponentPopupSchedule} = require("../src/engine/components/ComponentPopupSchedule");
    user = userEvent.setup();
    render(<ComponentPopupSchedule isShowing={false}/>);

    const { form, inputName, inputColor } = getFields();

    expect(form).toBeNull();

    expect(inputName).toBeNull();
    expect(inputColor).toBeNull();
  });
  test("test all are rendered when isShowing is true", async () => {
    const {ComponentPopupSchedule} = require("../src/engine/components/ComponentPopupSchedule");
    user = userEvent.setup();
    render(<ComponentPopupSchedule isShowing={true}/>);

    const { form, inputName, inputColor } = getFields();

    expect(form).not.toBeNull();

    expect(inputName).not.toBeNull();
    expect(inputColor).not.toBeNull();
  });

  test("test user add a name in the input for the name, should change de value of the input", async () => {
    const {ComponentPopupSchedule} = require("../src/engine/components/ComponentPopupSchedule");
    user = userEvent.setup();
    render(<ComponentPopupSchedule isShowing={true}/>);

    const { form, inputName, inputColor } = getFields();

    await user.type(inputName, testConstants.validName);

    expect(inputName.value).toBe(testConstants.validName);
  });

  test("test user add a different color in the color input, should change de value of the input", async () => {
    const {ComponentPopupSchedule} = require("../src/engine/components/ComponentPopupSchedule");
    user = userEvent.setup();
    render(<ComponentPopupSchedule isShowing={true}/>);

    const { form, inputName, inputColor } = getFields();
    console.log("input",inputColor.value);
    await user.pointer(inputColor.value, testConstants.validRGBColor);

    expect(inputColor).toBe(testConstants.validRGBColor);
  });
});

function getFields() {
  const form = document.querySelector("form");
  const inputName = document.getElementById("nameOfEvent");
  const inputColor = document.getElementById("colorOfEvent");
  return {
    form,
    inputName,
    inputColor,
  };
}
