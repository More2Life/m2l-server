import React, {Component} from 'react';
import './App.css';

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
            <div className="App">
                {feeditems.length
                    ? (
                        <div>
                            <h1>Feeditems.</h1>
                            <ul className="feeditems">
                                {feeditems.map((feeditem, index) => <li key={index}>{feeditem.title}</li>)}
                            </ul>
                            <button className="more" onClick={this.getFeeditems}>Get More</button>
                        </div>
                    )
                    : (
                        <div>
                            <h1>No feeditems</h1>
                            <button className="more" onClick={this.getFeeditems}>Try Again?</button>
                        </div>
                    )}
            </div>
        );
    }
}

export default App;
