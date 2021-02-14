let github = {
    userGistsEndpoint: 'https://api.github.com/users/{USERNAME}/gists',

    userReposEndpoint: 'https://api.github.com/users/{USERNAME}/repos?per_page=100',

    getUserGistsEndpoint: function (username) {
        let endpointURL = github.userGistsEndpoint;

        let result = endpointURL.replace('{USERNAME}', username);

        return result;
    },

    getUserReposEndpoint: function (username) {
        let endpointURL = github.userReposEndpoint;

        let result = endpointURL.replace('{USERNAME}', username);

        return result;
    },

    getUserGists: function (username, callback) {
        $.ajax({
            dataType: 'json',
            type: 'GET',
            url: github.getUserGistsEndpoint(username),
            success: function (data) {
                if (callback) {
                    callback(data);
                } else {
                    // @todo
                }
            }
        });
    },

    getUserRepos: function (username, callback) {
        $.ajax({
            dataType: 'json',
            type: 'GET',
            url: github.getUserReposEndpoint(username),
            success: function (data) {
                if (callback) {
                    callback(data);
                } else {
                    // @todo
                }
            }
        });
    }
};
