import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as moment from 'moment';
import * as ReactGA from 'react-ga'

import { HostRepository, GuestRepository, StoredHost } from './lib';


interface State {
    notice: string
    error: string
    host: {
        encryptedUserId: string,
        locationId: string,
        locationName: string,
        userName: string,
    },
    guest: {
        firstName: string,
        lastName: string,
        email: string,
        dateOfVisit: string,
    },
    isValidGuest: boolean,
    noSession: boolean,
};

class Index extends React.Component<{}, State>{
    private hostRepository: HostRepository;
    private guestRepository: GuestRepository;

    constructor(props: any) {
        super(props);


        const defaultTimeStr = moment().add(1, 'days').format('YYYY/MM/DD HH:00');
        this.state = {
            notice: "",
            error: "",
            host: {
                encryptedUserId: "",
                locationId: "",
                locationName: "",
                userName: "",
            },
            guest: {
                firstName: "",
                lastName: "",
                email: "",
                dateOfVisit: defaultTimeStr
            },
            isValidGuest: false,
            noSession: true,
        };

        //TODO injection
        this.hostRepository = new HostRepository();
        this.guestRepository = new GuestRepository();


        //https://qiita.com/konojunya/items/fc0cfa6a56821e709065
        this.handleChange = this.handleChange.bind(this);
        this.registerGuest = this.registerGuest.bind(this);
    }
    componentDidMount() {
        ReactGA.initialize('UA-121866338-3');
        const ga = ReactGA.ga();
        ga('send', 'pageview', 'popup.html');

        this.hostRepository.get()
            .then((host: StoredHost) => {
                this.setState({
                    host: {
                        encryptedUserId: host.euuid,
                        locationId: host.locationId,
                        locationName: host.locationName,
                        userName: host.userName
                    },
                    noSession: false,
                    notice: 'Hi, ' + host.userName + '@' + host.locationName
                })
            }).catch(() => {
                //login failure
            });
    }

    registerGuest() {
        ReactGA.event({
            category: 'Social',
            action: 'Rated an App',
            value: 3
        });

        const h = this.state.host;
        const g = this.state.guest;
        const result = this.guestRepository.put(
            h.encryptedUserId,
            h.locationId,
            g.firstName,
            g.lastName,
            g.email,
            moment(g.dateOfVisit, 'YYYY/MM/DD HH:mm').toString()
        );

        result.then((_response) => {
            const g = this.state.guest;
            const name = this.state.guest.firstName;
            g.firstName = '';
            g.lastName = '';
            g.email = '';

            this.setState({
                guest: g,
                notice: 'Completed sending invitation to ' + name,
                error: '', //flush, message
            })
        }).catch((_err) => {
            console.error(_err);
            this.setState({
                error: 'Oops! Something went wrong...',
                notice: '', //flush, message
            })
        });
    }

    handleChange(e: any) {
        let guest = this.state.guest;

        switch (e.target.name) {
            case "firstName":
                guest.firstName = e.target.value;
                break;
            case "lastName":
                guest.lastName = e.target.value;
                break;
            case "email":
                guest.email = e.target.value;
                break;
            case "dateOfVisit":
                guest.dateOfVisit = e.target.value;
                break;
        }

        this.setState({
            guest: guest,
            isValidGuest: this.isValidGuest(guest)
        });
    }

    isValidGuest(g: any): boolean {
        return g.firstName && g.lastName && g.dateOfVisit;
    }

    render() {
        const message = (this.state.notice !== "") ? <p className="alert alert-success">{this.state.notice}</p> : <div />;
        const error = (this.state.error !== "") ? <p className="alert alert-danger">{this.state.error}</p> : <div />;

        return (
            <div className="container-fluid">
                <h3>Quick Guest Invitation</h3>
                {message}
                {error}

                {(() => {
                    if (this.state.noSession) {
                        return (
                            <div>
                                <p className="alert alert-danger">Please Login. <a href="https://members.wework.com">https://members.wework.com</a></p>
                            </div>
                        );
                    }

                    return (
                        <div>
                            <h4>Guest Information</h4>
                            <p><span style={{ color: 'red', fontSize: '15px' }}>{'※'}</span> means requirement</p>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">
                                    FirstName<span style={{ color: 'red', fontSize: '15px' }}>{'※'}</span>
                                </label>
                                <div className="col-sm-10">
                                    <input type="text" name="firstName" onChange={this.handleChange} value={this.state.guest.firstName} className="form-control" />
                                </div>
                            </div>

                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">
                                    LastName<span style={{ color: 'red', fontSize: '15px' }}>{'※'}</span>
                                </label>
                                <div className="col-sm-10">
                                    <input type="text" name="lastName" onChange={this.handleChange} value={this.state.guest.lastName} className="form-control" />
                                </div>
                            </div>

                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Email</label>
                                <div className="col-sm-10">
                                    <input type="text" name="email" onChange={this.handleChange} value={this.state.guest.email} className="form-control" />
                                </div>
                            </div>

                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">
                                    ArrivalTime<span style={{ color: 'red', fontSize: '15px' }}>{'※'}</span>
                                </label>
                                <div className="col-sm-10">
                                    <input type="text" name="dateOfVisit" onChange={this.handleChange} value={this.state.guest.dateOfVisit} className="form-control" />
                                </div>
                            </div>

                            <br />
                            <button type="button" disabled={!this.state.isValidGuest} onClick={this.registerGuest} className="btn btn-lg btn-danger" id="updateGuestInfoButton">Sent Invitation</button>
                        </div>
                    );
                })()}

                <a href="https://form.run/@feedback">　feedback?</a>
            </div>
        );
    }
}

ReactDOM.render(
    <Index />,
    document.getElementById('js-application-mountpoint')
);