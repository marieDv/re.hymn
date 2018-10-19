////////////////////////////////////////
//////// API ACCESS TO SONGKICK.COM


import React, { Component } from 'react';
class Concerts extends Component {
    constructor(props){
        super(props);
        this.state = {
            upcomingConcerts: [],
            artistId: "",
            currentPos: [],
            closeConcerts: [],
        }
        this.saveCurrentPosition = this.saveCurrentPosition.bind(this);

    }
    componentDidMount(){
        this.getArtistId();
    }

    removeRedundant(){
        let all = document.getElementsByClassName("upcomingName");
        for(let i=0; i<all.length; i++){
            for(let j=0; j<all.length; j++){
                if(all[i].innerHTML === all[j].innerHTML && !(j === i)){
                    all[j].style.color = "#a2a2a2";
                }
            }
        }
    }
    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.saveCurrentPosition);
        }
    }
    saveCurrentPosition(position) {

        this.setState({
            currentPos: {
                "lan": (position.coords.latitude).toFixed(2),
                "lng": (position.coords.longitude).toFixed(2)
            }
        })
        let temp=[];
        for (let i = 0; i < this.state.upcomingConcerts.length; i++){
            console.log(i);
            if (this.state.upcomingConcerts[i].location.city.includes("UK") ) {
                    console.log(this.state.upcomingConcerts[i].location.city);
                    temp[i] = this.state.upcomingConcerts[i];
            }
        }

        this.setState(prevState => ({
            closeConcerts: temp,
        }));
        setTimeout(() => {
            console.log(this.state.closeConcerts);
           this.removeRedundant();
        }, 200);
    }
///get closest events
    calculateClosestEvents(){
        // let temp = [{"lan": 0},{"lng": 0}];
        let tempLan = [];
        for(let i=0; i<this.state.upcomingConcerts.length; i++){
            console.log(this.state.upcomingConcerts);
            // temp[i]["lan"] = (this.state.upcomingConcerts[i].location.lat);
            // temp[i]["lng"]= (this.state.upcomingConcerts[i].location.lng);
            tempLan[i] = (this.state.upcomingConcerts[i].location.lat);
        }
        console.log(tempLan);
        console.log(this.state.currentPos.lan);
        console.log(this.closest(this.state.currentPos.lan, tempLan));
        // console.log(this.closest(this.state.currentPos.lan, temp));
    }
    closest (num, arr) {
        var curr = arr[0];
        var diff = Math.abs (num - curr);
        for (var val = 0; val < arr.length; val++) {
            var newdiff = Math.abs (num - arr[val]);
            if (newdiff < diff) {
                diff = newdiff;
                curr = arr[val];
            }
        }
        return curr;
    }

    getUpcomingConcerts(){
        if(this.state.artistId){
        let temp = this.state.artistId;
        fetch('https://api.songkick.com/api/3.0/artists/'+temp+'/calendar.json?apikey=4qVB9zk3XpWOwz8C')
            .then(res => res.json())
            .then((data) => {
                this.setState({upcomingConcerts: data.resultsPage.results.event})
            })
        }
        setTimeout(() => {
            if(this.state.upcomingConcerts){
                this.getLocation();
            }
        }, 500);
    }

    getArtistId(){
        let artist = this.props.artist;
        fetch('https://api.songkick.com/api/3.0/search/artists.json?apikey=4qVB9zk3XpWOwz8C&query='+artist)
            .then(res => res.json())
            .then((data) => {
                this.setState({artistId: data.resultsPage.results.artist[0].id})
            })
        setTimeout(() => {
            this.getUpcomingConcerts();
        }, 500);
    }
    render () {
        return <div>{this.props.artist}


            <div>
                {this.state.closeConcerts &&
                    <div>
                <h3>UK concerts:</h3>
                {this.state.closeConcerts.map((item, i) => <ul key={i} className="">
                    <li className={"upcomingName"}>{item.displayName}</li>
                    <li>{item.type}</li>
                    <li>{item.location.city}</li>
                    <li>{item.start.date}</li>
                </ul>)}
                    </div>
                }
                {this.state.upcomingConcerts &&
                <div>
                <h3>all upcoming concerts:</h3>
                {this.state.upcomingConcerts.map((item, i) => <li key={i} className="">
                    <span className={"upcomingName"}>{item.displayName}</span>
                    {/*{console.log(item)}*/}
                    <span>{item.location.city}</span>
                </li>)}
                </div>
                }
                {!this.state.upcomingConcerts &&
                    <h3>unfortunately this artist has no upcoming concerts :(</h3>
                }
            </div>


        </div>
    }
}

export default Concerts;
