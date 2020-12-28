import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Passenger Element that displays passenger's name and email
const Passenger = (props) => (
	<div className="row">
		<h5 className="col-md-2">
			<small>{props.passenger.passenger_name}</small>
		</h5>
		<h5 className="col-sm-3">
			<small>{props.passenger.passenger_email}</small>
		</h5>
	</div>
);

class RidesHost extends Component {
	constructor(props) {
		super(props);
		const { user } = this.props.auth;

		this.state = {
			rides: [],
			passenger: [],
			user: user,
		};
	}

	// Get the information of a a specific ride 
	componentDidMount() {
		const id = this.props.match.params.id;
		axios
			.get('/api/rides/view/' + id)
			.then((response) => {
				this.setState({
					rides: response.data,
					passenger: response.data.passenger,
				});
			})
			.catch((error) => console.log(error));
	}

	//Map all passengers to a Passenger Element
	passengerList() {
		return this.state.passenger.map((currpassenger) => {
			return <Passenger passenger={currpassenger} key={currpassenger._id} />;
		});
	}

	render() {
		console.log(this.state.passenger);

		return (
			<div className="container" style={{ minHeight: '00px' }}>
				<Link to="/">Back to Home</Link>
				{/* Card Showing all the information about a ride */}
				<div className="card mb-8 box-shadow">
					{/* Header of the card */}
					<div className="card-header">
						<h3>{this.state.rides.group_Name}</h3>
						<div className="row">
							<h5 className="col-md-2">Location: </h5>
							<h5 className="col-md-8">{this.state.rides.location}</h5>
						</div>

						<div className="row">
							<h5 className="col-md-2">Departure Date:</h5>
							<h5 className="col-md-3">
								{this.state.rides.date
									? this.state.rides.date.substring(0, 10)
									: ''}
								{' ' + this.state.rides.time}
							</h5>
						</div>
					</div>

					{/* Body of the card */}
					<div className="card-body">
						<h4>Passengers</h4>
						{this.passengerList()}
					</div>
				</div>
			</div>
		);
	}
}

RidesHost.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps)(RidesHost);
