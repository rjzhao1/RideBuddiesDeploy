import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
const Ride = (props) => (
	<tr>
		<td>{props.rides.group_Name}</td>
		<td>{props.rides.host_email}</td>
		<td>{props.rides.pickup}</td>
		<td>{props.rides.location}</td>
		<td>{props.rides.date.substring(0, 10) + ' ' + props.rides.time}</td>
		<td>{props.rides.seats}</td>
		{/* Shows delete button if user is host, otherwise show join button */}
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
				<button
					className="btn btn-primary btn-small mr-1"
					onClick={() => {
						props.joinRide(props.rides._id);
					}}
				>
					Join
				</button>
			)}
		</td>
	</tr>
);
class RidesList extends Component {
	constructor(props) {
		super(props);

		this.deleteRides = this.deleteRides.bind(this);
		this.joinRide = this.joinRide.bind(this);
		this.rideList = this.rideList.bind(this);
		const { user } = this.props.auth;

		this.state = {
			rides: [],
			user: user,
		};
	}

	// Getting all avalible rides from database
	componentDidMount() {
		axios
			.get('/api/rides')
			.then((response) => {
				this.setState({ rides: response.data });
			})
			.catch((error) => console.log(error));
	}

	// Function to delete a ride
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
	// Fuction to join a ride
	joinRide(id) {
		if (!this.props.auth.isAuthenticated) {
			window.location = '/login';
		} else {
			const passenger = {
				passenger: this.state.user.username,
				passenger_email: this.state.user.email,
			};
			axios
				.post('/api/rides/join/' + id, passenger)
				.then((res) => {
					window.alert(res.data);
					window.location = '/rides/myRides';
				})
				.catch((err) => window.alert(err.response.data));
		}
	}

	// Function that maps each ride to a Ride Element to display 
	// on the page
	rideList() {
		return this.state.rides.map((currRide) => {
			if (currRide) {
				return (
					<Ride
						rides={currRide}
						user={this.state.user}
						deleteRides={this.deleteRides}
						joinRide={this.joinRide}
						key={currRide._id}
					/>
				);
			} else {
				return '';
			}
		});
	}

	render() {
		return (
			<div>
				<Link to="/">Back to Home</Link>
				<h3>Rides Available</h3>
				<table className="table">
					<thead className="thead-light">
						<tr>
							<th>Group Name</th>
							<th>Host Email</th>
							<th>Pickup</th>
							<th>Location</th>
							<th>Date</th>
							<th>Seats Available</th>
							<th></th>
						</tr>
					</thead>
					<tbody>{this.rideList()}</tbody>
				</table>
			</div>
		);
	}
}

RidesList.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps)(RidesList);
