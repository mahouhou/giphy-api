import React, {Component} from 'react';
import Gif from './Gif'
//Import loader image to use in UserHint component
import loader from './images/loader.svg'
//Import close button image
import clearButton from './images/close-icon.svg'

//Function that will be used to choose a random gif
//from the array of data
const randomChoice = arr => {
	const randIndex = Math.floor(Math.random() * arr.length);
	return arr[randIndex];
};

//Pass clearSearch and hasResults props
const Header = ({clearSearch, hasResults}) => (
	<div className="header grid">
		{/* If hasResults is true i.e. contains data, show Clear button,
		otherwise display title */}
		{hasResults ? (
			<button onClick={clearSearch}>
				<img src={clearButton} alt="Clear"/>
			</button>) : (
		 	<h1 className="title">Jiffy</h1>)}
	</div>
);

const UserHint = ({loading, hintText}) => (
	<div className="user-hint">
		{/* Check loading state.
		If true, load the spinner, if not, load hintText. */}
		{loading ? 
			<img className="block mx-auto" src={loader} alt="Loading" /> : 
			hintText}
	</div>
	)

class App extends Component {
	//Set up state with the constructor
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			searchTerm: '',
			hintText: '',
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
				throw new Error(`Nothing found for ${searchTerm}`)
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
				//Turn off loading spinner
				loading: false,
				//hintText will be equal to the message inside the error object
				hintText: error.message
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
			//Get all of the previous state
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

	//Called when user hits Clear button
	clearSearch = () => {
		//this refers to App state
		//Reset states to default values
		this.setState((prevState, props) => ({
			...prevState,
			searchTerm: '',
			hintText: '',
			gifs: []
		}));
		//this refers to App textInput
		//Focus cursor back on text input
		this.textInput.focus();
	};

	render() {
		//Go and get states of searchTerm and gif
		const {searchTerm, gifs} = this.state;
		//hasResults tells us how many gifs we have inside the gifs state array
		const hasResults = gifs.length;

		return(
			<div className="page">
				{/* Pass individual props to Header component.
				clearSearch is a function and hasResults is a constant. */}
				<Header clearSearch={this.clearSearch} hasResults={hasResults} />
				<div className="search grid">
					{/* Our stack of gif images */}
					{/* Only display video if there is a gif in the state.*/}
					{/* Get video source from gif state */}
					{/* Here we loop over our array of gif images, using map()
					and create multiple video elements from it */}
					{this.state.gifs.map(gif => (
						//Insert Gif component and spread out properties
						<Gif {...gif} />
					))}
					<input
						className="input grid-item"
						placeholder="Type something"
						onChange={this.handleChange}
						onKeyPress={this.handleKeyPress}
						value={searchTerm}
						ref={input => {this.textInput = input;}}
					/>
				</div>
				{/* Spread state onto UserHint as attributes and value pairs. */}
				<UserHint {...this.state} />
			</div>
			)
	}
}

export default App;