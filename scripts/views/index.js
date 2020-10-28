let app = {
    github: null,

    init: function () {
        app.loadConfig();
    },

    config: null,

    loadConfig: function () {
        $.ajax({
            dataType: 'json',
            type: 'GET',
            url: './config.json',
            success: function (data) {
                app.loadConfigCallback(data);
            }
        });
    },

    loadConfigCallback: function (data) {
        this.config = data.config;

        app.getGistsInfo();
        app.getReposInfo();
    },

    getGistsInfo: function () {
        github.getUserGists(this.config.username, app.getGistsInfoCallback);
    },

    getGistsInfoCallback: function (data) {

    },

    getReposInfo: function () {
        github.getUserRepos(this.config.username, app.getReposInfoCallback);
    },

    getReposInfoCallback: function (data) {
        let dataLength = data.length;

        let html = '';

        if (dataLength > 0) {
            for (let i = 0; i < data.length; i++) {
                let currentRepo = data[i];

                let id = currentRepo.id;
                let name = currentRepo.name;
                let description = currentRepo.description;
                let html_url = currentRepo.html_url;
                let updated_at = new Date(currentRepo.updated_at);

                let yyyy_mm_dd = updated_at.getFullYear() + '/' + (updated_at.getMonth() + 1) + '/' + updated_at.getDate();

                if (i % 3 == 0) {
                    html += '<div class=\'section group\' data-repo=\'' + id + '\'>';
                }

                html += '<div class=\'col span_1_of_3\'>';
                html += '<div class=\'repo-info\'>';
                html += '<h3>' + '<a href=\'' + html_url + '\' rel=\'follow\'>' + name + '</a>' + '</h3>';
                html += '<p>' + 'Last modified: ' + yyyy_mm_dd + '</p>';

                if (description) {
                    html += '<p>' + description + '</p>';
                } else {
                    html += '<p>' + 'No description' + '</p>';
                }

                html += '<a href=\'' + html_url + '\' rel=\'follow\' target=\'_blank\'>View on GitHub</a>';
                html += '</div>';
                html += '</div>';

                if ((i + 1) % 3 == 0) {
                    html += '</div>';
                }
            }

            // If the number of elements isn't multiple of 3, fix the missing </div> in the end.

            if (dataLength % 3 != 0) {
                let newLength = dataLength;

                do {
                    newLength++;
                }
                while (newLength % 3 != 0);

                for (let i = dataLength; i < newLength; i++) {
                    if (i % 3 == 0) {
                        html += '<div class=\'section group\'>';
                    }

                    html += '<div class=\'col span_1_of_3\'></div>';

                    if ((i + 1) % 3 == 0) {
                        html += '</div>';
                    }
                }
            }

            $('#repositories-body').append(html);
        }
    }
};
