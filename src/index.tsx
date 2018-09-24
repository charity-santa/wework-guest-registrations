import * as React from 'react';
import * as ReactDOM from 'react-dom';

class Index extends React.Component {
    render() {
        return (
            <div className="container">
                <p>OK</p>
            </div>
        );
    }
}

ReactDOM.render(
    <Index />,
    document.getElementById('js-application-mountpoint')
);