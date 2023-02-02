import {render} from "@testing-library/react";
import {AddEmployee} from "../src/engine/pages/addEmployee";
import userEvent from "@testing-library/user-event";
import {MemoryRouter} from "react-router-dom";

let user;
beforeEach(async () => {
    user = userEvent.setup();
    render(<MemoryRouter><AddEmployee /></MemoryRouter>);
});

test("should render form", async () => {
    const form = document.querySelector("form");

    expect(form).not.toBeNull();
});