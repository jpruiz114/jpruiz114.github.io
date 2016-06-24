var github = {
    /**
     *
     */
    userGistsEndpoint: "https://api.github.com/users/{USERNAME}/gists",

    /**
     *
     */
    userReposEndpoint: "https://api.github.com/users/{USERNAME}/repos",

    /**
     *
     * @param username
     * @returns {string}
     */
    getUserGistsEndpoint: function(username) {
        var endpointURL = github.userGistsEndpoint;

        var result = endpointURL.replace("{USERNAME}", username);

        return result;
    },

    /**
     *
     * @param username
     * @returns {string}
     */
    getUserReposEndpoint: function(username) {
        var endpointURL = github.userReposEndpoint;

        var result = endpointURL.replace("{USERNAME}", username);

        return result;
    },

    /**
     *
     * @param username
     * @param callback
     */
    getUserGists: function(username, callback) {
        $.ajax({
            dataType: "json",
            type: "GET",
            url: github.getUserGistsEndpoint(username),
            success: function(data) {
                if (callback) {
                    callback(data);
                } else {
                    // @todo
                }
            }
        });
    },

    /**
     *
     * @param username
     * @param callback
     */
    getUserRepos: function(username, callback) {
        $.ajax({
            dataType: "json",
            type: "GET",
            url: github.getUserReposEndpoint(username),
            success: function(data) {
                if (callback) {
                    callback(data);
                } else {
                    // @todo
                }
            }
        });
    }
};
