export class HostRepository {
    get() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get('QUICKINVITATION', (values) => {
                //{} is empty? (if not login => {})
                if (Object.keys(values).length === 0) {
                    reject();
                };
                resolve(values['QUICKINVITATION']);
            });
        });
    }
}

export class GuestRepository {
    put(
        encryptedUserId: string,
        location: string,
        firstName: string,
        lastName: string,
        email: string,
        dateOfVisit: string
    ): Promise<Response> {
        const invitation = {
            first_name: firstName,
            last_name: lastName,
            location_uuid: location,
            email: email,
            date_of_visit: dateOfVisit,
        };

        const url = 'https://guest.wework.com/api/v4/guests';
        const option = {
            method: 'POST',
            headers: {
                'ENCRYPTED_USER_UUID': encryptedUserId,
                'Accept': 'application/json, text-plain,*/*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(invitation)
        }

        //TODO 雑handling改善
        return fetch(url, option);
    }
}