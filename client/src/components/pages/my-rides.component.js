import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Custom Ride Element that display all the information of 
// A ride on a row of a table
const Ride = (props) => (
	<tr>
		<td>
			<Link to={'/rides/view/' + props.rides._id}>
				{props.rides.group_Name}
			</Link>
		</td>
		<td>{props.rides.host_email}</td>
		<td>{props.rides.pickup}</td>
		<td>{props.rides.location}</td>
		<td>{props.rides.date.substring(0, 10) + ' ' + props.rides.time}</td>
		<td>{props.rides.seats}</td>
		<td>{props.user.email === props.rides.host_email ? 'Yes' : 'No'}</td>
		{/* if the user is the hows show a delete button */}
		<td>
			{props.user.email === props.rides.host_email ? (
				<button
					className="btn btn-danger btn-small mr-1"
					onClick={() => {
						props.deleteRides(props.rides._id);
					}}
				>
					delete
				</button>
			) : (
				''
			)}
		</td>
	</tr>
);

class MyRidesList extends Component {
	constructor(props) {
		super(props);
		const { user } = this.props.auth;
		this.deleteRides = this.deleteRides.bind(this);

		this.state = {
			rides: [],
			user: user,
		};
	}

	// Take the list of rides and filter the rides the users
	// are in 
	componentDidMount() {
		const { user } = this.props.auth;
	
		axios
			.get('/api/rides/myRides')
			.then((response) => {
				this.setState({
					rides: response.data.filter(
						(rl) =>
							rl.passenger.some(
								(passengers) => passengers.passenger_email === user.email
							) || rl.host_email === user.email
					),
				});
			})
			.catch((error) => console.log(error));
	}

	// Function to delete rides
	deleteRides(id) {
		axios
			.delete('/api/rides/' + id, {
				data: { host_email: this.state.user.email },
			})
			.then((res) => console.log(res.data))
			.catch((err) => console.log(err));

		this.setState({
			rides: this.state.rides.filter((rl) => rl._id !== id),
		});
	}

	// Map each rides to a Ride element
	rideList() {
		return this.state.rides.map((currRide) => {
			return (
				<Ride
					rides={currRide}
					user={this.state.user}
					deleteRides={this.deleteRides}
					key={currRide._id}
				/>
			);
		});
	}

	render() {
		return (
			<div>
				<Link to="/">Back to Home</Link>
				<h3>Your Rides</h3>
				<table className="table">
					{/* Heading of the table */}
					<thead className="thead-light">
						<tr>
							<th>Group Name</th>
							<th>Host Email</th>
							<th>Pickup</th>
							<th>Location</th>
							<th>Date</th>
							<th>Seats Available</th>
							<th>Host ?</th>
							<th></th>
						</tr>
					</thead>
					{/* Body of table */}
					<tbody>{this.rideList()}</tbody>
				</table>
			</div>
		);
	}
}

MyRidesList.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps)(MyRidesList);
