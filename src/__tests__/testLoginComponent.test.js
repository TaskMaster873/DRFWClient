/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Fetch from "./fetch";

test("loads and displays greeting", async () => {
  // ARRANGE
  render(<Fetch url="/login" />);

  // ACT
  await userEvent.click(screen.getByText());
  await screen.findByRole("heading");

  // ASSERT
  expect(screen.getByRole("heading")).toHaveTextContent("hello there");
  expect(screen.getByRole("button")).toBeDisabled();
});

let matchMedia;
describe("Test TaskMaster Client Configurations", () => {
  beforeAll(() => {
    matchMedia = new MatchMediaMock();
  });

  afterEach(() => {
    matchMedia.clear();
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

  test("Render app without crashing", () => {
    const { Application } = require("../src/Application");

    let app = new Application();
    app.start();
  });
});
