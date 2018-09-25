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
    ) {
        // return new Promise((resolve, reject) => {
        //     const invitation = {
        //         first_name: firstName,
        //         last_name: lastName,
        //         location_uuid: location,
        //         email: email,
        //         date_of_visit: dateOfVisit,
        //     };
        //     const body = JSON.stringify(invitation);

        //     const url = 'https://guest.wework.com/api/v4/guests';
        //     $.ajax({
        //         type: "post",
        //         url: url,
        //         data: body,
        //         contentType: 'application/json',
        //         dataType: "json",
        //         headers: {
        //             'ENCRYPTED_USER_UUID': encryptedUserId,
        //             'Accept': 'application/json, text-plain,*/*',
        //         }, success: function () {
        //             resolve();
        //         },
        //         error: function (xhr: any) {
        //             reject(xhr.responseText);
        //         },
        //     });
        // });
    }
}