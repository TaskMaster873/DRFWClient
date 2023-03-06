import {ScaleLoader} from "react-spinners";
import React from "react";

/**
 * Component that display a loading bar
 * @class ComponentLoadingBarSpinner
 * @extends {React.Component<unknown, unknown>}
 */
export class ComponentLoadingBarSpinner extends React.Component<unknown, unknown> {
    public render(): JSX.Element {
        return (
            <div className='loadingBar'>
                <ScaleLoader
                    color={"#A020F0"}
                    loading={true}
                    cssOverride={{
                        display: 'flex',
                        alignSelf: 'center',
                        margin: '0 auto',
                    }}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            </div>
        );
    }
}
