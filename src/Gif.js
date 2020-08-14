import React, {Component} from 'react';

class Gif extends Component {
	//Set the 'loaded' state for Gif as false by default
	constructor(props) {
		super(props)
		this.state = {
			loaded: false
		}
	}

	render() {
		const {images} = this.props;
		const {loaded} = this.state;
		return(
			<video
				//When the gif has loaded, we give it class 'loaded'
				//We use CSS to style the transition
				className={`grid-item video ${loaded && 'loaded'}`}
				autoPlay
				loop
				src={images.original.mp4}
				//This checks if the gif has loaded yet and sets the state to true when it has
				onLoadedData={() => this.setState({loaded: true})}
			/>
			)
	}
}

//Make this file available to other files that import it
export default Gif;