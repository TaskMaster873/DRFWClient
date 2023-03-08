/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import MatchMediaMock from "jest-matchmedia-mock";
import {fireEvent, render} from "@testing-library/react";
import {employeesWithIds, employeeWithId, testConstants} from "../Constants/testConstants";
import {EventManipulationType} from "../src/engine/types/StatesForDaypilot";
import userEvent from "@testing-library/user-event";
import {MemoryRouter} from "react-router-dom";

let user;
let matchMedia;

describe("Test TaskMaster Client component", () => {
    beforeAll(() => {
        matchMedia = new MatchMediaMock();
    });

    beforeEach(async () => {
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

    test("test all are not rendered when modal is not shown", async () => {
        const {ComponentPopupSchedule} = require("../src/engine/components/ComponentPopupSchedule");
        render(
            <MemoryRouter>
                <ComponentPopupSchedule
                    eventAdd={() => {
                    }}
                    eventEdit={() => {
                    }}
                    hideModal={() => {
                    }}
                    isShown={false}
                    id={"..."}
                    start={"2022-10-10T00:00:00"}
                    end={"2022-10-10T02:00:00"}
                    resource={employeeWithId.id}
                    taskType={EventManipulationType.CREATE}
                    employees={employeesWithIds}
                />
            </MemoryRouter>
        );
        const {form, inputAssignedEmployee, inputStart, inputEnd} = getFields();

        expect(form).toBeNull();
        expect(inputAssignedEmployee).toBeNull();
        expect(inputStart).toBeNull();
        expect(inputEnd).toBeNull();
    });

    test("test all are rendered when modal is shown", async () => {
        const {ComponentPopupSchedule} = require("../src/engine/components/ComponentPopupSchedule");
        render(
            <MemoryRouter>
                <ComponentPopupSchedule
                    eventAdd={() => {
                    }}
                    eventEdit={() => {
                    }}
                    hideModal={() => {
                    }}
                    isShown={true}
                    id={"..."}
                    start={"2022-10-10T00:00:00"}
                    end={"2022-10-10T02:00:00"}
                    resource={employeeWithId.id}
                    taskType={EventManipulationType.CREATE}
                    employees={employeesWithIds}
                />
            </MemoryRouter>
        );
        const {form, inputAssignedEmployee, inputStart, inputEnd} = getFields();

        expect(form).not.toBeNull();
        expect(inputAssignedEmployee).not.toBeNull();
        expect(inputStart).not.toBeNull();
        expect(inputEnd).not.toBeNull();
    });

    test("test submit sends Create event when set to do so", async () => {
        let eventAddCalls = 0;
        let eventEditCalls = 0;
        const {ComponentPopupSchedule} = require("../src/engine/components/ComponentPopupSchedule");
        render(
            <MemoryRouter>
                <ComponentPopupSchedule
                    eventAdd={() => {
                        eventAddCalls += 1
                    }}
                    eventEdit={() => {
                        eventEditCalls += 1
                    }}
                    hideModal={() => {
                    }}
                    isShown={true}
                    id={""}
                    start={testConstants.validStartDate}
                    end={testConstants.validEndDate}
                    resource={employeeWithId.id}
                    taskType={EventManipulationType.CREATE}
                    employees={employeesWithIds}
                />
            </MemoryRouter>
        );
        const {form} = getFields();
        fireEvent.submit(form);
        expect(eventAddCalls).toBe(1);
        expect(eventEditCalls).toBe(0);
    });

    test("test submit sends Edit event when set to do so", async () => {
        let eventAddCalls = 0;
        let eventEditCalls = 0;
        const {ComponentPopupSchedule} = require("../src/engine/components/ComponentPopupSchedule");
        render(
            <MemoryRouter>
                <ComponentPopupSchedule
                    eventAdd={() => {
                        eventAddCalls += 1
                    }}
                    eventEdit={() => {
                        eventEditCalls += 1
                    }}
                    hideModal={() => {
                    }}
                    isShown={true}
                    id={testConstants.validId}
                    start={testConstants.validStartDate}
                    end={testConstants.validEndDate}
                    resource={employeeWithId.id}
                    taskType={EventManipulationType.EDIT}
                    employees={employeesWithIds}
                />
            </MemoryRouter>
        );
        const {form} = getFields();

        fireEvent.submit(form);

        expect(eventEditCalls).toBe(1);
        expect(eventAddCalls).toBe(0);
    });
});

function getFields() {
    const form = document.querySelector("form");
    const inputAssignedEmployee = document.getElementById("assignedEmployee")
    const inputStart = document.getElementById("start");
    const inputEnd = document.getElementById("end");
    return {
        form,
        inputAssignedEmployee,
        inputStart,
        inputEnd,
    };
}
