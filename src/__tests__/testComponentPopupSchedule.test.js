/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import MatchMediaMock from "jest-matchmedia-mock";
import { render } from "@testing-library/react";
import {testConstants} from "../Constants/testConstants";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

let user;
let matchMedia;

describe("Test TaskMaster Client component", () => {
  beforeAll(() => {
    matchMedia = new MatchMediaMock();
  });

  beforeEach(async() => {
    user = userEvent.setup();
    /*const { ComponentPopupSchedule } = require("../src/engine/components/ComponentPopupSchedule");
     render(<MemoryRouter><ComponentPopupSchedule isShowing={true} /></MemoryRouter>);*/
  })
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

  test("test all are not rendered when isShowing is false", async () => {
    const { ComponentPopupSchedule } = require("../src/engine/components/ComponentPopupSchedule");
    render(<MemoryRouter><ComponentPopupSchedule isShown={false} /></MemoryRouter>);
    const { form, inputStart, inputEnd } = getFields();

    expect(form).toBeNull();

    expect(inputStart).toBeNull();
    expect(inputEnd).toBeNull();
 });

  test("test all are rendered when isShowing is true", async () => {
    const { ComponentPopupSchedule } = require("../src/engine/components/ComponentPopupSchedule");
    render(<MemoryRouter><ComponentPopupSchedule isShown={true} /></MemoryRouter>);
    const { form, inputStart, inputEnd } = getFields();

    expect(form).not.toBeNull();

    expect(inputStart).not.toBeNull();
    expect(inputEnd).not.toBeNull();
  });
});
function getFields() {
  const form = document.querySelector("form");
  const inputStart = document.getElementById("start");
  const inputEnd = document.getElementById("end");
  return {
    form,
    inputStart,
    inputEnd,
  };
}
