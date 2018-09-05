const myeuuid = localStorage.getItem('ls.euuid');
const userDataString = localStorage.getItem('ls.userData');


if (myeuuid && userDataString) {
    const userData = JSON.parse(userDataString);
    const userName = userData.profile.name;
    const locationName = userData.location.description;
    const locationId = userData.location.uuid;

    const values = {
        euuid: myeuuid,
        userName: userName,
        locationName: locationName,
        locationId: locationId
    };

    chrome.storage.local.set({'QUICKINVITATION': values});
}