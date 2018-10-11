import React, { Component } from 'react';
import  Concerts  from './Concerts.js';
import './App.css';
import Spotify from 'spotify-web-api-js';
const spotifyWebApi = new Spotify();
var tempHistory = [];


class App extends Component {
    constructor(){
        super();
        const params = this.getHashParams();

        const token = params.access_token;
        if (token) {
            spotifyWebApi.setAccessToken(token);
        }
        this.state = {
         favArtists: [],
         initialLoading: true,
         inputValue: "",
         foundArtists: [],
         foundArtistsLi: [],
         favArtistsLi: [],
         error: false,
         errorReport: "",
         searchrequest: false,
         executingOnce: true,
         showSearchResults: false,
         showConcerts: false,
         artistForUpcoming: "",
         latestRequests:  []

        }


    }

////////////////////////////////////////////
//// GET complete search history  (Todo: add restrictions if needed)
fetchHistory(){
    fetch('/concertfinder/')
        .then(res => res.json())//response type
        .then((data) => {
            tempHistory = data;
        })
        setTimeout(() => {
            this.mapHistory();
        }, 200);
}
mapHistory(){
    this.setState({latestRequests: tempHistory.slice(tempHistory.length-7, tempHistory.length)});
}


////////////////////////////////////////////
//// POST the search request to the database
saveRequest(){
   fetch('/concertfinder/', {
       method:'POST',
       headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json'
       },
       body: JSON.stringify({
           "name": this.state.inputValue
       }),
    //this.state.inputValue
   }).then(response => {
       console.log(response);
   });
    // setTimeout(() => {
    //     this.fetchHistory();
    // }, 200);
}


////////////////////////////////////////////
//// UPDATES input value for search request
updateInputValue(evt) {
        this.setState({
            inputValue: evt.target.value
        });
}

componentDidUpdate(){
    if(this.state.favArtists[0].length > 0 && this.state.initialLoading){
        this.printFavArtists();
    }
    if(this.state.searchrequest){
    if(this.state.foundArtists[0].length > 0 &&this.state.executingOnce) {
        this.printSearchedArtists();
    }
    }
}

componentDidMount(){
    this.getFavArtists();
    setTimeout(() => {this.fetchHistory();}, 200)


}

////////////////////////////////////////////
//// -
toggleConcertPage(name){
    this.setState({showConcerts: true, artistForUpcoming: name});
}
////////////////////////////////////////////
//// SAVES fetched data from search to an array that will be mapped to the html
printSearchedArtists(err){
    let temp = [];
    for(let i=0; i<this.state.foundArtists[0].length; i++){
        temp =this.state.foundArtists[0];
    }
    this.setState({foundArtistsLi: temp, searchrequest: false, executingOnce: false});
    setTimeout(() => {this.setState({showSearchResults: true});}, 1200)
}
printFavArtists(){
    let temp = []
    for(let i=0; i<19; i++) {
         temp = this.state.favArtists[0];
    }
    this.setState({favArtistsLi: temp, initialLoading: false});
}

////////////////////////////////////////////////////////////////////////
//get the data from the spotify api
getFavArtists(){
    spotifyWebApi.getMyTopArtists()
.then((response) => {
    this.setState(prevState => ({
        favArtists:[response.items],
}));
})
}


searchArtist(){
    spotifyWebApi.searchArtists(this.state.inputValue)
        .then((response) => {
            this.setState(prevState => ({
                foundArtists: [response.artists.items],
            }));
        }, function(err) {
            this.setState({error: true});
        });

    setTimeout(() => {
        this.setState({searchrequest: true, executingOnce:true});
        if(this.state.foundArtists[0].length <=1){ this.setState({error: true});}
    }, 100);
    setTimeout(() => {
        this.saveRequest();
    }, 200);
}

////////////////////////////////////////////////////////////////////////
//get hash for access (see app.js in main root)
getHashParams() {
            var hashParams = {};
            var e, r = /([^&;=]+)=?([^&;]*)/g,
                q = window.location.hash.substring(1);
            e = r.exec(q)
            while (e) {
                hashParams[e[1]] = decodeURIComponent(e[2]);
                e = r.exec(q);
            }
            return hashParams;
        }
_handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            setTimeout(() => {
                this.searchArtist();
            }, 100);

        }
}
  render() {
    return (
      <div className="App">

              <a href="http://localhost:8888">
                 <button><p className={"text-login"}>Login with Spotify</p></button>
              </a>

          {!this.state.showConcerts &&
          <div id="main">
              {/*SEARCH for an artist or group*/}
              <input value={this.state.inputValue} onChange={evt => this.updateInputValue(evt)} onKeyPress={this._handleKeyPress}/>
              <button onClick={() => this.searchArtist()}>start!</button>



              {this.state.error &&
                  <h2>unfortunately there are no artists or groups listed under this name!</h2>
              }
              {/* MAP THE SEARCH RESULTS ON TOP OF THE LIST*/}
              {this.state.showSearchResults &&
              this.state.foundArtistsLi.map((item, i) => <li key={i} onClick={() => this.toggleConcertPage(item.name)}className="searchPerClick"><img
                  alt={item.name} src={item.images[2] ? item.images[2].url : ""}/>
                  <button>{item.name}</button>
              </li>)
              }
              {this.state.latestRequests[0] &&
              <div>
              <h3>latest requests:</h3>
                {this.state.latestRequests.map((item, i) => <li key={i} onClick={() => this.toggleConcertPage(item.name)}className="searchPerClick">
                <button>{item.name}</button>
                </li>)}
               </div>
              }
              <br/>
              <h3>favorite artists:</h3>
              {this.state.favArtistsLi.map((item, i) => <li key={i} onClick={() => this.toggleConcertPage(item.name)}className="searchPerClick"><img
                  alt={item.name} src={item.images[2] ? item.images[2].url : ""}/>
                  <button>{item.name}</button>
              </li>)}
          </div>
          }
          {this.state.showConcerts &&
          <Concerts artist={this.state.artistForUpcoming}></Concerts>
          }

      </div>
    );
  }
}



export default App;
