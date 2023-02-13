import { CSSProperties } from "react";
import { BeatLoader } from "react-spinners";

const override: CSSProperties = {
    display: 'flex',
    alignSelf: 'center',
    margin: '0 auto',
};

export function ComponentLoading() {
    return (<div style={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
    <BeatLoader
        color={"#A020F0"}
        loading={true}
        size={25}
        cssOverride={override}
        aria-label="Loading Spinner"
        data-testid="loader"
    />
</div>)
}