import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HostRepository, GuestRepository } from './lib';


interface State {
    notice: string
    error: string
    host: {
        encryptedUserId: string,
        locationId: string,
        locationName: string,
        userName: string,
    },
};

interface StoredHost {
    euuid: string;
    locationId: string;
    locationName: string;
    userName: string;
}

class Index extends React.Component<{}, State>{
    private hostRepository: HostRepository;
    private guestRepository: GuestRepository;

    constructor(props: any) {
        super(props);

        this.state = {
            notice: "",
            error: "",
            host: {
                encryptedUserId: "",
                locationId: "",
                locationName: "",
                userName: "",
            }
        };

        //TODO injection
        this.hostRepository = new HostRepository();
        this.guestRepository = new GuestRepository();
    }
    componentDidMount() {
        this.hostRepository.get().then((host: StoredHost) => {
            this.setState({
                host: {
                    encryptedUserId: host.euuid,
                    locationId: host.locationId,
                    locationName: host.locationName,
                    userName: host.userName
                }
            })
        }).catch(() => {
            this.setState({
                error: 'Please login at https://members.wework.com'
            });
        });
    }

    render() {
        const message = (this.state.notice !== "") ? <p className="alert alert-success">{this.state.notice}</p> : <div />;
        const error = (this.state.error !== "") ? <p className="alert alert-danger">{this.state.error}</p> : <div />;
        const hello = (this.state.host.userName !== "") ?
            <p>{'Hi, ' + this.state.host.userName + '@' + this.state.host.locationName}</p>
            : <div />;

        return (
            <div className="container-fluid">
                <h3>Quick Guest Invitation</h3>
                {message}
                {error}
                {hello}

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">FirstName</label>
                    <div className="col-sm-10">
                        <input type="text" id="firstName" name="firstName" className="form-control" />
                    </div>
                </div>

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">LastName</label>
                    <div className="col-sm-10">
                        <input type="text" id="lastName" name="lastName" className="form-control" />
                    </div>
                </div>

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">email</label>
                    <div className="col-sm-10">
                        <input type="text" id="email" name="email" className="form-control" />
                    </div>
                </div>

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">ArrivalTime</label>
                    <div className="col-sm-10">
                        <input type="text" id="dateOfVisit" name="dateOfVisit" className="form-control" />
                    </div>
                </div>

                <br />
                <button type="button" id="updateGuestInfoButton" className="btn btn-lg btn-danger">Sent Invitation</button>
                <a href="https://form.run/@feedback">　feedback?</a>
            </div>
        );
    }
}

ReactDOM.render(
    <Index />,
    document.getElementById('js-application-mountpoint')
);