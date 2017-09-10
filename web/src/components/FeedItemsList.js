import React, {Component} from 'react';

class FeedItemsList extends Component {
    render() {
        return (
            <div className="FeedItemsList">
                <ul className="feeditems list-group">
                    {this.props.feeditems.map((item) => <FeedItemCell key={item._id} feeditem={item}/>)}
                </ul>
            </div>
        );
    }
}

class FeedItemCell extends Component {
    render() {
        const fi = this.props.feeditem;
        return (
            <li className="list-group-item">
                <h1>{fi.title}</h1>
                <img className="img-fluid" src={fi.feedImageUrl} alt={fi.feedImageUrl}/>
            </li>
        );
    }
}

export default FeedItemsList;
