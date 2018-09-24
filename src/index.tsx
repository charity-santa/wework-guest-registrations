import * as React from 'react';
import * as ReactDOM from 'react-dom';

class Index extends React.Component {
    render() {
        return (
            <div className="container-fluid">
                <h3>Quick Guest Invitation</h3>
            </div>
        );
    }
}

ReactDOM.render(
    <Index />,
    document.getElementById('js-application-mountpoint')
);