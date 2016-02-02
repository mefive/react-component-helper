import React from 'react';
import Slider from '../src/Slider';

const SliderTest = React.createClass({
    render() {
        return (
            <div className="slider-test">
                <h1>Slider</h1>
                <div className="col5">
                    <Slider value={20} />
                </div>
                <div className="col5">
                    <Slider
                        value={10}
                        orientation="vertical"
                        className="slider vertical"
                    />
                </div>
            </div>
        );
    }
});

export default SliderTest;
