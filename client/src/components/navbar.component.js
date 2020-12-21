import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser,loginUser} from '../actions/authActions';

class Navbar extends Component {
	onLogoutClick = (e) => {
		e.preventDefault();
		this.props.logoutUser();
	};

	logInDemo =(e)=>{
		e.preventDefault();
		const User ={
			email:"JohnDoe@email.com",
            password:"12345678",
		}
		this.props.loginUser(User);
		
	}

	render() {
		const isLoggedIn = this.props.auth.isAuthenticated;

		return (
			<nav className="navbar navbar-dark bg-dark navbar-expand-lg">
				<Link to="/" className="navbar-brand">
					RideBuddies
				</Link>
				<div className="collpase navbar-collapse">
					<ul className="navbar-nav mr-auto">
						<li className="navbar-item">
							<Link to="/rides" className="nav-link">
								Find Rides
							</Link>
						</li>
						{isLoggedIn ? (
							<li className="navbar-item">
								<Link to="/rides/add" className="nav-link">
									Create Rides
								</Link>
							</li>
						) : (
							''
						)}

						{isLoggedIn ? (
							<li className="navbar-item">
								<Link to="/rides/myRides" className="nav-link">
									My Rides
								</Link>
							</li>
						) : (
							''
						)}

						<li className="navbar-item">
							<Link to="/map" className="nav-link">
								Ride Map
							</Link>
						</li>
					</ul>

					<ul className="navbar-nav navbar-right">
						<li>
							{isLoggedIn ? (
								<Link
									to="/"
									onClick={this.onLogoutClick}
									className="btn btn-danger btn-small btn-nav navbar-right"
								>
									Log out
								</Link>
							) : (
								<Link
									to="/login"
									type="button"
									className="btn btn-primary btn-small btn-nav navbar-right"
									style={{marginRight:"1em"}}
								>
									Log In
								</Link>
							)}

							{!isLoggedIn ? (
								<Link
									to="/"
									onClick={this.logInDemo}
									className="btn btn-danger btn-small btn-nav navbar-right"
								>
									Demo
								</Link>
							) : ""}
						</li>
					</ul>
				</div>
			</nav>
		);
	}
}

Navbar.propTypes = {
	logoutUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, { logoutUser,loginUser })(Navbar);
