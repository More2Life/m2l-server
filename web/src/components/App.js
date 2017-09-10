import React, {Component} from 'react';
import FeedItemsList from './FeedItemsList.js';

class App extends Component {
    // Initialize state
    state = {
        feeditems: []
    }

    // Fetch feeditems after first mount
    componentDidMount() {
        this.getFeeditems();
    }

    getFeeditems = () => {
        // Get the feeditems and store them in state
        fetch('/api/feeditems')
          .then(res => res.json())
          .then(feeditems => this.setState({ feeditems }));
    }

    render() {
        const {feeditems} = this.state;
        console.log('render these feeditems', feeditems);
        return (
            <div className="App container">
                <FeedItemsList feeditems={feeditems} />
            </div>
        );
    }
}

export default App;
