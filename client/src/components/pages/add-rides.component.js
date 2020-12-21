import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import { TimePicker } from 'antd';
import 'react-datepicker/dist/react-datepicker.css';
import 'antd/dist/antd.css';

import usePlacesAutocomplete, {
	getGeocode,
	getLatLng,
} from 'use-places-autocomplete';

import {
	Combobox,
	ComboboxInput,
	ComboboxPopover,
	ComboboxList,
	ComboboxOption,
} from '@reach/combobox';
import '@reach/combobox/styles.css';

import { LoadScript } from '@react-google-maps/api';

const libraries = ['places'];

const PlacesAutocomplete = (props) => {
	const {
		ready,
		value,
		suggestions: { status, data },
		setValue,
		clearSuggestions,
	} = usePlacesAutocomplete({
		requestOptions: {
			location: { lat: () => 37.774929, lng: () => -122.419418 },
			radius: 200 * 1000,
		},
	});
	return (
		<div className="pickup">
			<Combobox
				onSelect={async (address) => {
					setValue(address, false);
					clearSuggestions();

					try {
						const results = await getGeocode({ address });
						const { lat, lng } = await getLatLng(results[0]);
						props.onChangePickup(address, lat, lng);
					} catch (err) {
						console.log(err);
					}
				}}
			>
				<ComboboxInput
					value={value}
					onChange={(e) => {
						setValue(e.target.value);
					}}
					disabled={!ready}
					placeholder="Enter an address"
				/>
				<ComboboxPopover>
					<ComboboxList>
						{status === 'OK' &&
							data.map(({ id, description }) => (
								<ComboboxOption key={id} value={description} />
							))}
					</ComboboxList>
				</ComboboxPopover>
			</Combobox>
		</div>
	);
};

class AddRide extends Component {
	constructor(props) {
		super(props);

		this.onChangeGroupName = this.onChangeGroupName.bind(this);
		this.onChangeSeats = this.onChangeSeats.bind(this);
		this.onChangeLocation = this.onChangeLocation.bind(this);
		this.onChangeDate = this.onChangeDate.bind(this);
		this.onChangePickup = this.onChangePickup.bind(this);
		this.onChangeTime = this.onChangeTime.bind(this);
		this.onSubmit = this.onSubmit.bind(this);

		this.state = {
			seats: 0,
			group_Name: '',
			pickup: '',
			pick_lat: 0,
			pick_lng: 0,
			location: '',
			date: new Date(),
			time: '',
			errors: {},
		};
	}

	onChangeSeats(e) {
		this.setState({
			seats: e.target.value,
		});
	}
	onChangeGroupName(e) {
		this.setState({
			group_Name: e.target.value,
		});
	}

	onChangePickup(address, lat, lng) {
		this.setState({
			pickup: address,
			pick_lat: lat,
			pick_lng: lng,
		});
	}
	onChangeLocation(e) {
		this.setState({
			location: e.target.value,
		});
	}

	onChangeDate(date) {
		this.setState({
			date: date,
		});
	}

	onChangeTime(time, timeString) {
		this.setState({
			time: timeString,
		});
	}

	onSubmit(e) {
		e.preventDefault();
		const { user } = this.props.auth;
		console.log(user);

		const ride = {
			host_email: user.email,
			seats: this.state.seats,
			group_Name: this.state.group_Name,
			pickup: this.state.pickup,
			pick_lat: this.state.pick_lat,
			pick_lng: this.state.pick_lng,
			location: this.state.location,
			date: this.state.date,
			time: this.state.time,
		};

		axios
			.post('/api/rides/add', ride)
			.then(() => {
				window.alert('Ride created');
				window.location = '/';
			})
			.catch((err) => this.setState({ errors: err.response.data }));
	}

	render() {
		const { errors } = this.state;

		return (
			<div className="container">
				<br />
				<h3>Create Ride Groups!</h3>
				<form onSubmit={this.onSubmit}>
					<div className="form-group">
						<label>Group Name: </label>
						<input
							type="text"
							className="form-control"
							value={this.state.group_Name}
							onChange={this.onChangeGroupName}
						/>
						<p className="text-danger">{errors.group_Name}</p>
					</div>

					<div className="form-group">
						<label>Seats: </label>
						<input
							type="text"
							className="form-control"
							value={this.state.seats}
							onChange={this.onChangeSeats}
						/>
						<p className="text-danger">
							{errors.seats}
							{errors.noSeats}
						</p>
					</div>

					<div className="form-group">
						<label>Destination: </label>
						<input
							type="text"
							className="form-control"
							value={this.state.location}
							onChange={this.onChangeLocation}
						/>
						<p className="text-danger">{errors.location}</p>
					</div>

					<div className="form-group">
						<label>Pickup: </label>
						{/* <input 
                        type = "text"
                        className="form-control"
                        value = {this.state.pickup}
                        onChange={this.onChangePickup}
                        /> */}

						<LoadScript
							googleMapsApiKey={process.env.REACT_APP_GOOGLE_KEY}
							libraries={libraries}
						>
							<PlacesAutocomplete onChangePickup={this.onChangePickup} />
						</LoadScript>
						<p className="text-danger">{errors.pickup}</p>
					</div>

					<div className="form-group">
						<label>Date: </label>
						<div>
							<DatePicker
								selected={this.state.date}
								onChange={this.onChangeDate}
							/>
						</div>
						<p className="text-danger">{errors.date}</p>
					</div>

					<div className="form-group">
						<label>Time: </label>
						<div>
							<TimePicker
								use12Hours
								format="h:mm A"
								selected={this.state.time}
								onChange={this.onChangeTime}
							/>
							<p className="text-danger">{errors.time}</p>
						</div>
					</div>

					<div className="form-group">
						<input
							type="submit"
							value="Create Ride"
							className="btn btn-primary"
						/>
					</div>
				</form>
			</div>
		);
	}
}

AddRide.propTypes = {
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	errors: state.errors,
});

export default connect(mapStateToProps)(AddRide);
