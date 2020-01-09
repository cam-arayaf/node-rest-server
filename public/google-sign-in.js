function onSignIn(googleUser) {
    let profile = googleUser.getBasicProfile();
    console.log(`ID: ${ profile.getId() }`);
    console.log(`Name: ${ profile.getName() }`);
    console.log(`Image URL: ${ profile.getImageUrl() }`);
    console.log(`Email: ${ profile.getEmail() }`);
    let id_token = googleUser.getAuthResponse().id_token;
    console.log(`Token: ${ id_token }`);
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/google');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = () => console.log(`Signed in as: ${ xhr.responseText }`);
    xhr.send('idtoken=' + id_token);
}

const signOut = () => {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => console.log('User signed out'));
    auth2.disconnect();
}