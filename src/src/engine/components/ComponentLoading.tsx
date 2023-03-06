import {BeatLoader} from "react-spinners";

export function ComponentLoading(): JSX.Element {
    return (
        <div className='bigLoading'>
            <BeatLoader
                color={"#A020F0"}
                loading={true}
                size={25}
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
