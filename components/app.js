var GIPHY_API_URL = 'https://api.giphy.com';
var GIPHY_PUB_KEY = 'PSrjuieMUbB6xaWavXNEEZUpKPAYJqcx'
App = React.createClass({
    getInitialState() {
        return {
            loading: false,
            searchingText: '',
            gif: {},
            error: '',
            initialized: false
        };
    },

    handleSearch: function (searchingText) {
        this.setState({
            loading: true
        });
        this.getGif(searchingText, function (gif) {
            if (gif) {
                this.setState({
                    loading: false,
                    gif: gif,
                    searchingText: searchingText,
                    error: '',
                    initialized: true
                });
            } else {
                this.setState({
                    loading: false,
                    error: 'Something went wrong..... Try Again',
                    initialized: true
                });
            }
        }.bind(this));
    },

    getGif: (searchingText, callback) => {
        var url = GIPHY_API_URL + '/v1/gifs/random?api_key=' + GIPHY_PUB_KEY + '&tag=' + searchingText;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onload = function () {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText).data;
                var gif = {
                    url: data.fixed_width_downsampled_url,
                    sourceUrl: data.url
                };
                callback(gif);
            }
        };
        xhr.onerror = function () {
            callback(null);
        }
        xhr.send();
    },

    render: function () {
        var styles = {
            margin: '0 auto',
            textAlign: 'center',
            width: '90%'
        };

        return (
            <div style={styles}>
                <h1>GIF Search Engine!</h1>
                <p>Found Gif on <a href='http://giphy.com'>giphy</a>. Click ENTER, To Download Next GIF.</p>
                <Search onSearch={this.handleSearch} />
                <Gif
                    loading={this.state.loading}
                    url={this.state.gif.url}
                    sourceUrl={this.state.gif.sourceUrl}
                    error={this.state.error}
                />
                {this.state.error ? <p className="error-message">{this.state.error}</p> : null}
                {!this.state.gif.url && this.state.initialized ? <p className="error-message">Nothing found... Put Correct Name of Gif</p> : null}
            </div >
        );
    }
});