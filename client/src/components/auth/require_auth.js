// An higher-order component to make sure user has logged in
import React, { Component } from "react";
// import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

export default function (ComposedComponent) {
  class Authentication extends Component {
    static contextTypes = {
      router: PropTypes.object,
    };

    componentWillMount() {
      if (!this.props.authenticated) {
        //   this.context.router.history.replace("/signin", {
        //     time: new Date().toLocaleString(),
        //     message: "Please sign in first.",
        //   });
        window.location.href = "/signin";
      }
    }

    componentWillUpdate(nextProps) {
      if (!nextProps.authenticated) {
        // this.context.router.history.replace("/signin", {
        //   time: new Date().toLocaleString(),
        //   message: "Please sign in first.",
        // });
        window.location.href = "/signin";
        // history.push("/sigin");
      }
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    return { authenticated: state.auth.authenticated };
  }

  return connect(mapStateToProps)(Authentication);
}
