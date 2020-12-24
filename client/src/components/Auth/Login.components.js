import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";

class Login extends Component{
    constructor(){
        super();
        this.state={
            username:"",
            email:"",
            password:"",
            errors:{}
        };
    }

    componentDidMount() {
        // If logged in and user navigates to Login page,
        // should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
          this.props.history.push("/dashboard");
        }
      }

    componentWillReceiveProps(nextProps){
        
        //Display errors if there is set errors if there is any errors
        if(nextProps.auth.isAuthenticated){
            this.props.history.push("/dashboard");
        }

        if(nextProps.errors){
            this.setState({
                errors:nextProps.errors
            });
        }
    }

    //Change state of email and password
    onChange = e =>{
        this.setState({[e.target.id]:e.target.value});
    };

    //Submits the form to Login user
    onSubmit = e => {
        e.preventDefault();
        const User = {
            email:this.state.email,
            password:this.state.password,
        };
        this.props.loginUser(User);
    };


    render(){
        const {errors} =this.state;

        return( 
            <div>
                <br />
                <div className="container">
                        <div style={{ paddingLeft: "11.250px" }}>
                            <h4><b>Sign In</b></h4>
                            <p className="grey-text text-darken-1">
                            Don't have an account? <Link to="/register">Sign Up</Link>
                            </p>
                        </div>
                        <form noValidate onSubmit={this.onSubmit}>
                         
                            {/* Email Field */}
                            <div className="form-group col s12">
                                <label>Email</label>
                                <input
                                    onChange={this.onChange}
                                    value={this.state.email}
                                    error={errors.email}
                                    className={classnames("form-control", {
                                        invalid: errors.email||errors.emailnotfound
                                      })}
                                    id="email"
                                    type="text"
                              
                                />
                                <p className="text-danger">
                                    {errors.email}
                                    {errors.emailnotfound}
                                </p>
                            </div>
                            
                            {/* Password Field */}
                            <div className="form-group col s12">
                                <label>Password</label>
                                <input
                                    onChange={this.onChange}
                                    value={this.state.password}
                                    error={errors.password}
                                    className={classnames("form-control", {
                                        invalid: errors.password||errors.passwordincorrect
                                      })}
                                    id="password"
                                    type="password"
                         
                                />
                                 <p className="text-danger">
                                    {errors.password}
                                    {errors.passwordincorrect}
                                </p>
                            </div>
                            
                            {/* Login button*/}
                            <div style={{ paddingLeft: "11.250px" }}>
                                <button
                                    style={{
                                        width: "150px",
                                        borderRadius: "5px",
                                        letterSpacing: "1.5px",
                                        marginTop: "1rem"
                                    }}
                                    type="submit"
                                    className="form-group btn btn-primary btn-block">
                                    Log In
                                </button>
                                <Link to="/">Back to Home Page</Link>
                            </div>
                        </form>
                </div>
               

            </div>
            
        )
    }
} 

Login.propTypes = {
    loginUser:PropTypes.func.isRequired,
    auth:PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

//Maps the state of the components to props
const mapStateToProps = state =>({
    auth:state.auth,
    errors:state.errors
});

export default connect(
    mapStateToProps,
    {loginUser}
)(Login);