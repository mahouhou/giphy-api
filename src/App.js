//Finished video 23

import React, {Component} from 'react';
//Import loader image to use in UserHint component
import loader from './images/loader.svg'
//Import Gif component
import Gif from './Gif'
//Import close button
import clearButton from './images/close-icon.svg'

//Function that will be used to choose a random gif
//from the array of data
const randomChoice = arr => {
	const randIndex = Math.floor(Math.random() * arr.length);
	return arr[randIndex];
};

//Pick up clearSearch and hasResults props
//We can pass functions as well as numbers, strings. arrays etc.
const Header = ({clearSearch, hasResults}) => (
	<div className="header grid">
		{/* If we have results inside gifs array, show close button
		otherwise display h1 Jiffy */}
		{hasResults ? (
			<button onClick={clearSearch}>
				<img src={clearButton} />
			</button>
		) : (
		 	<h1 className="title">Jiffy</h1>
		)}
	</div>
);

const UserHint = ({loading, hintText}) => (
	<div className="user-hint">
		{/* This is a ternary operator.
		Is it loading? If yes, load the spinner, if not, load the hintText. */}
		{loading ? <img className="block mx-auto" src={loader} /> : hintText}
	</div>
	)

class App extends Component {
	//Set up state with the constructor
	constructor(props) {
		super(props);
		this.state = {
			//Set default state for loading
			loading: false,
			//Default state is empty
			searchTerm: '',
			//Set state of hintText
			hintText: '',
			//An empty array
			gifs: []

		};
	}

	//Create a function that searches the Giphy API using fetch
	//dynamically inserting the search term into the query URL

	//Use asnyc/await to create asynchronous methods
	searchGiphy = async searchTerm => {
		this.setState({
			//Here we set our 'loading' state to be true
			//which will display the spinner
			//This starts before we start fetching our data
			loading : true
		})
		//First try our fetch
		try {
			//Use await to wait for our response to come back
			const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=mjtfKN8MvtF58EhlRaPKRe7u3QHpuH1q&q=${searchTerm}&limit=25&offset=0&rating=G&lang=en`);
			//Convert data into JSON data
			//const {data} gets the first key inside the response called data
			const {data} = await response.json();

			//Here we check if the array of results is empty
			//If it is, it will throw an error and stop the code from proceeding
			//It will instead be handled by the catch
			if (!data.length) {
				throw `Nothing found for ${searchTerm}`
			}
			
			//randomGif calls the randomChoice function
			//passing the data array and choosing a random gif from there
			const randomGif = randomChoice(data);
			console.log({randomGif})

			//Get all previous state and properties of gif
			this.setState((prevState, props) => ({
				...prevState,
				//Take all previous state i.e. the previously viewed gifs
				//and spread them out in the array.
				//Then add the new random gif on the end
				gifs: [...prevState.gifs, randomGif],
				//We must turn off the loading spinner again now that the gif has loaded
				loading: false,
				hintText: `Hit enter to see more ${searchTerm}`
			}));
		}
		//If it fails, catch the error here
		catch (error) {
			this.setState((prevState, props) => ({
				...prevState,
				//hintText will be equal to 'error'
				hintText: error,
				//Turn off loading spinner
				loading: false
			}))
			console.log(error);
		}
	};


	//With Create React App, we can write our methods as arrow functions
	//instead of using the constructor and bind
	handleChange = event => {
		//const value = event.target.value
		//'target' refers to the element the event is attached to
		//'value' refers to the result of the event
		const {value} = event.target;
		//By setting the searchTerm in our state
		//and also using that as the value on the input element
		//we have created a 'controlled input'
		//Get the previous state and properties
		this.setState((prevState, props) => ({
			//Spread them out?
			...prevState,
			//Overwrite the previous state with the new state
			//which is our search value
			searchTerm: value,
			//When value changes, state of hintText changes as well
			//Check if number of characters is more than 2
			//If so, search for value, if not, stay blank
			hintText: value.length > 2 ? `Hit enter to search ${value}` : ''
		}));
	};

	//We must use handleKeyPress because 'Enter' is not a character we can type out
	handleKeyPress = event => {
		const {value} = event.target;
		//When we have 2 or more characters in our search box
		//and have pressed enter, we want to run a search
		if (value.length > 2 && event.key === 'Enter') {
			//Here we call our searchGiphy function using the value
			this.searchGiphy(value);
		}
	};

	//Here we reset the states to their default values
	clearSearch = () => {
		this.setState((prevState, props) => ({
			...prevState,
			searchTerm: '',
			hintText: '',
			gifs: []
		}));
		//Here we focus the cursor back on the input
		this.textInput.focus();
	};

	render() {
		//Go and get states of searchTerm and gif
		const {searchTerm, gifs} = this.state;
		//Here we set up a variable to check if the gifs array has any results inside
		const hasResults = gifs.length;

		return(
			<div className="page">
				{/* I think we have to pass the state to the component using it
				This is how to pass properties individually as opposed to all with keyword props */}
				<Header clearSearch={this.clearSearch} hasResults={hasResults} />
				<div className="search grid">
					{/* Our stack of gif images */}
					{/* Only display video if there is a gif in the state.
					Apparently we can test for it by using &&.
					I'm confused why this isn't a ternary operator.
					How does just writing gif imply that there is something there? */}
					{/* Get video source from gif state */}
					{/*{gif && <video
						className="grid-item video"
						autoPlay
						loop
						src={gif.images.original.mp4}
					/>}*/}

					{/* Code above updated to code below.
					Here we loop over our array of gif images, using map()
					and create multiple videos from it */}
					{this.state.gifs.map(gif => (
						//Insert Gif component and spread out properties
						<Gif {...gif} />
					))}
					
					{/* Look up refs in React Docs */}
					<input
						className="input grid-item"
						placeholder="Type something"
						onChange={this.handleChange}
						onKeyPress={this.handleKeyPress}
						value={searchTerm}
						ref={input => {this.textInput = input;}}
					/>
				</div>
				{/* Get all state and 'spread it out'—I think this saves us passing each state individually. */}
				<UserHint {...this.state} />
			</div>
			)
	}
}

export default App;