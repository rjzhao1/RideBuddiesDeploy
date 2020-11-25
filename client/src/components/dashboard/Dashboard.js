import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import dashboard from "../../img/dashboard.jpg"
import { Link } from "react-router-dom";


class Dashboard extends Component{
    onLogoutClick = e =>{
        e.preventDefault();
        this.props.logoutUser();
    };
    render(){
        const {user} = this.props.auth;
        const button_style ={
            width: "150px",
            borderRadius: "3px",
            letterSpacing: "1.5px",
            marginTop: "1rem",
            marginLeft: "1rem"
        }
        return(    
          <div className="bg" style={{backgroundImage:`url(${dashboard})`}} >

              <div className="container text-center p-5"> 
              <h1>Hey {user.username.split(" ")[0]}</h1>
              <p className="lead text-muted">You are logged in RideBuddies! Start looking for Rides Today!</p>
              <div className="col">
                <Link to="/rides"
                  style={button_style}
                  className="btn btn-primary">
                  Find Rides
                </Link>

                <Link to="/rides/myRides"
                  style={button_style}
                  className="btn btn-secondary">
                  My Rides
                </Link>

              </div>
              

              <button
                style={button_style}
                onClick={this.onLogoutClick}
                className="btn btn-danger">
                Logout
              </button>

              </div>
            </div>
           
        )
    }

}

Dashboard.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  };

  const mapStateToProps = state => ({
    auth: state.auth
  });

  export default connect(
    mapStateToProps,
    { logoutUser }
  )(Dashboard);