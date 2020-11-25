import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import background from "../../img/landing.jpg"



class Landing extends Component{

    constructor(){
        super();
        this.state={
        };
    }

    componentDidMount() {
        // If logged in and user navigates to Login page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
          this.props.history.push("/dashboard");
        }
      }

    render(){
        const button_style = {
            width: "140px",
            letterSpacing: "1.5px",
            borderRadius:"5px",
            margin: "5px"
            }
        return( 
                <div className="bg" style={{backgroundImage:`url(${background})`}} >
                    <div className="container text-center p-5"> 
                        <h1>Welcome</h1>
                        <h5>Welcome to RideBuddies. Here you can organize and find a rides that you need.</h5>
                        <p>
                            <Link 
                                to="/register" 
                                style={button_style}
                                className="btn btn-primary my-2">Register</Link>


                            <Link 
                                to="/login" 
                                style={button_style}
                                className="btn btn-secondary my-2">Login</Link>
                        </p>
                    </div>
                </div>
             
                
            
           
        )
    }
} 


Landing.propTypes = {
    auth:PropTypes.object.isRequired
}

const mapStateToProps = state =>({
    auth:state.auth
});

export default connect(
    mapStateToProps
)(Landing);