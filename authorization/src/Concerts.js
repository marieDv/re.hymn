////////////////////////////////////////
//////// API ACCESS TO SONGKICK.COM


import React, { Component } from 'react';

class Concerts extends Component {
    constructor(props){
        super(props);
    }
    render () {
        return <div>{this.props.artist}</div>
    }
}

export default Concerts;
