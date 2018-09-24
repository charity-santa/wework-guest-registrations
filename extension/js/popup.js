class HostRepository {
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

class GuestRepository {
    put(encryptedUserId, location, firstName, lastName, email, dateOfVisit) {
        return new Promise((resolve, reject) => {
            const invitation =  {
                first_name: firstName,
                last_name: lastName,
                location_uuid: location,
                email: email,
                date_of_visit: dateOfVisit,
            };
            const body = JSON.stringify(invitation);

            const url = 'https://guest.wework.com/api/v4/guests';
            $.ajax({
                type: "post",
                url: url,
                data: body,
                contentType: 'application/json',
                dataType: "json",
                headers: {
                    'ENCRYPTED_USER_UUID': encryptedUserId,
                    'Accept': 'application/json, text-plain,*/*',
                }, success: function () {
                    resolve();
                },
                error: function (xhr) {
                    reject(xhr.responseText);
                },
            });
        });
    }
}

window.onload = () => {
    function displayError($dom, message) {
        $dom.hide()
            .removeClass('alert-success')
            .addClass('alert-danger')
            .text(message)
            .show();
    }

    function displaySuccess($dom, message) {
        $dom.hide()
            .removeClass('alert-danger')
            .addClass('alert-success')
            .text(message)
            .show();
    }

    function updateGuestInfo() {
        const location = $hostForm.find('#location').val();
        const encryptedUserId = $hostForm.find('#encryptedUserId').val();
        const $firstName = $guestForm.find('#firstName');
        const firstName = $firstName.val();

        const $lastName = $guestForm.find('#lastName');
        const lastName = $lastName.val();

        const $email = $guestForm.find('#email');
        const email = $email.val();

        const dateOfVisit = $guestForm.find('#dateOfVisit').val();

        //email is optinal
        if (!location || !encryptedUserId || !firstName || !lastName || !dateOfVisit) {
            displayError($message, 'you should fill in guest information');
            return;
        }
        const now = moment(dateOfVisit, 'YYYY/MM/DD HH:mm').toString();

        const res = guestRepository.put(
            encryptedUserId,
            location,
            firstName,
            lastName,
            email,
            now
        );
        res.then(() => {
            displaySuccess($message, 'completed sending invitation to ' + firstName);
            $firstName.val('');
            $lastName.val('');
            $email.val('');
        }).catch((err) => {
            displayError($message, 'Oops.Something went wrong...').show();
        });
    }

    // function updateBulkGuestInfo() {
    //     const val= $('#js-bulk-guest-form').val();

    //     const rows = val.split("\n");
    //     const guests = [];

    //     rows.map((row) => {
    //         guests.push(createGuest(row));
    //     });


    //     console.log(guests);
    // }

    // function createGuest(inputRowString) {
    //     //TSVのみサポート
    //     const r = inputRowString.split('\t');
    //     return {
    //         "firstName": r[0],
    //         "lastName": r[1],
    //         "email": r[2],
    //     }
    // }

    function initializeForm($hostForm, $guestForm, hostRepository, $bulkForm) {
        const storedValues = hostRepository.get();
        storedValues.then((values) => {
            $hostForm.find('#location').val(values.locationId)
            $hostForm.find('#encryptedUserId').val(values.euuid)
            $guestForm.show();
            $helloMessage.text('Hi, ' + values.userName + '@' + values.locationName).show();
        }).catch(() => {
            displayError($message, 'Please login at https://members.wework.com');
        });

        const now = moment();
        const defaultTime = now.add(1, 'days');
        $guestForm.find('#dateOfVisit').val(defaultTime.format("YYYY/MM/DD HH:00"));
    }

    const hostRepository = new HostRepository();
    const guestRepository = new GuestRepository();
    const $hostForm = $('#js-host-form-app');
    const $guestForm = $('#js-guest-form-app');
    const $message = $('#js-message');
    const $helloMessage = $('#js-hello-message');
    const $bulkForm = $('#js-bulk-guest-form');

    $('#updateGuestInfoButton').click(updateGuestInfo);
    // $('#updateBulkGuestInfoButton').click(updateBulkGuestInfo);

    initializeForm($hostForm, $guestForm, hostRepository, $bulkForm);
}