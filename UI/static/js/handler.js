let path = 'http://localhost:5000/api/v1/'


class Handler {
    constructor () {

    }

    post (url, data) {
        let absPath = path + url        

        return fetch(absPath, {
            method: 'POST',
            headers: {
            'Content-type': 'application/json',
            'Acess-Control-Allow-Origin': '*',
            'Acess-Control-Request-Method': 'POST',
        },
        body : JSON.stringify(data)
    });
}