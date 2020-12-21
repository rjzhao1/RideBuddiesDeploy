import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";

class Register extends Component{
    constructor(){
        super();
        this.state={
            username:"",
            email:"",
            password:"",
            password2:"",
            errors:{}
        };
    }

    componentDidMount() {
        // If logged in and user navigates to Register page, 
        // should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
          this.props.history.push("/dashboard");
        }
      }

    componentWillReceiveProps(nextProps){
        
        //Display errors if there is set errors if there is any errors
        if(nextProps.errors){
            this.setState({
                errors:nextProps.errors
            });
        }

    }

    onChange = e =>{
        this.setState({[e.target.id]:e.target.value});
    };

    //Submits the form to Register a new User
    onSubmit = e => {
        e.preventDefault();
        const newUser = {
            username: this.state.username,
            email:this.state.email,
            password:this.state.password,
            password2: this.state.password2
        };
        this.props.registerUser(newUser,this.props.history);
    };

    render(){
        const {errors} =this.state;

        return( 
            <div>
                <br />
                <div className="container">
                        <div style={{ paddingLeft: "11.250px" }}>
                            <h4><b>Register</b> below</h4>
                            <p className="grey-text text-darken-1">
                            Already have an account? <Link to="/login">Log in</Link>
                            </p>
                        </div>
                        <form noValidate onSubmit={this.onSubmit}>
                            <div className="form-group col s12">
                                <label>Username</label>
                                <input
                                    onChange={this.onChange}
                                    value={this.state.username}
                                    error={errors.username}
                                    className={classnames("form-control", {
                                        invalid: errors.username
                                      })}
                                    id="username"
                                    type="text"
                                />
                                <p className="text-danger">{errors.username}</p>
                            </div>
                            

                            <div className="form-group col s12">
                                <label>Email</label>
                                <input
                                    onChange={this.onChange}
                                    value={this.state.email}
                                    error={errors.email}
                                    className={classnames("form-control", {
                                        invalid: errors.email
                                      })}
                                    id="email"
                                    type="text"
                              
                                />
                                <p className="text-danger">{errors.email}</p>
                            </div>

                            <div className="form-group col s12">
                                <label>Password</label>
                                <input
                                    onChange={this.onChange}
                                    value={this.state.password}
                                    error={errors.password}
                                    className={classnames("form-control", {
                                        invalid: errors.password
                                      })}
                                    id="password"
                                    type="password"
                                />
                                <p className="text-danger">{errors.password}</p>
                            </div>
                            
                            
                            <div className="form-group col s12">
                                <label>Confirm Password</label>
                                <input
                                    onChange={this.onChange}
                                    value={this.state.password2}
                                    error={errors.password2}
                                    className={classnames("form-control", {
                                        invalid: errors.password2
                                      })}
                                    id="password2"
                                    type="password"
                            
                                />
                                <p className="text-danger">{errors.password2}</p>
                            </div>

                            <div style={{ paddingLeft: "11.250px" }}>
                                <button
                                style={{
                                    width: "150px",
                                    borderRadius: "5px",
                                    letterSpacing: "1.5px",
                                    marginTop: "1rem"
                                }}
                                type="submit"
                                className="form-group btn btn-primary btn-block"
                                >
                                    Sign up
                                </button>
                            </div>
                        </form>
                        
                </div>
            </div>
            
        )
    }
} 

Register.propTypes ={
    registerUser: PropTypes.func.isRequired,
    auth:PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state=>({
    auth:state.auth,
    errors:state.errors
});

export default connect(mapStateToProps,{registerUser})(withRouter(Register));
