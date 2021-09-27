import React, { Component } from 'react';
import Adapter from '../Adapter';
import TVShowList from './TVShowList';
import Nav from './Nav';
import SelectedShowContainer from './SelectedShowContainer';
import { Grid } from 'semantic-ui-react';



class App extends Component {
  state = {
    shows: [],
    searchTerm: "",
    selectedShow: "",
    episodes: [],
    filterByRating: 0,
    pagesLoaded: 1,
    toggle: true,
  }

  componentDidMount = () => {
    this.handleScroll()
    Adapter.getShows(this.state.pagesLoaded).then(shows => {
      this.setState({shows})})
    
  }
  
  handleScroll = () => {
    document.addEventListener('scroll', () => {
      if (window.pageYOffset >= ((document.documentElement.scrollHeight - document.documentElement.clientHeight)) && this.state.toggle) {

        this.setState(prevState => {
          return {
           pagesLoaded: this.state.pagesLoaded >= 3 ? 1 : prevState.pagesLoaded + 1,
           toggle: !prevState.toggle
        }},() => Adapter.getShows(this.state.pagesLoaded).then(shows => {

          this.setState({shows})}))
        
      }
      else if(!this.state.toggle && window.pageYOffset <= (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 0.5) {this.setState(prevState => {return{toggle: !prevState.toggle}})}
      
     })
  }
  componentDidUpdate = () => {
    window.scrollTo(0, 0)
    
  }

  handleSearch = (e) =>{
    
    this.setState({ searchTerm: e.target.value.toLowerCase() })
  }

  handleFilter = (e) => {
    console.log(e.target.value)
    e.target.value === "No Filter" ? this.setState({ filterByRating:"" }) : this.setState({ filterByRating: e.target.value})
  }

  selectShow = (show) => {
  
    Adapter.getShowEpisodes(show.id)
    .then((episodes) => this.setState({
      selectedShow: show,
      episodes
    }))
  }

  displayShows = () => {
    console.log(this.state.filterByRating)
    if (this.state.filterByRating){
      return this.state.shows.filter((s)=> {
        return s.rating.average >= this.state.filterByRating
      })
    } else {
      return this.state.shows
    }
  }

  render (){
    return (
      <div>
        <Nav handleFilter={this.handleFilter} handleSearch={this.handleSearch} searchTerm={this.state.searchTerm}/>
        <Grid celled>
          <Grid.Column width={5}>
            {!!this.state.selectedShow ? <SelectedShowContainer selectedShow={this.state.selectedShow} episodes={this.state.episodes}/> : <div/>}
          </Grid.Column>
          <Grid.Column  width={11}>
            <TVShowList shows={this.displayShows()} selectShow={this.selectShow} searchTerm={this.state.searchTerm}/>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default App;
