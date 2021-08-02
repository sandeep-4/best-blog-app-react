import React from "react";
import { Link } from "react-router-dom";

export default () => (
  <div>
    {/*Main jumbotron for a primary marketing message or call to action*/}
    <div className="jumbotron">
      <h1 className="display-3">Welcome!</h1>
      <p>Dwaggg !!!</p>
      <p>
        <Link className="btn btn-primary btn-lg" to="/posts" role="button">
          Look the blog posts &raquo;
        </Link>
      </p>
    </div>

    {/*Example row of columns*/}
    <div className="row text-justify">
      <div className="col-md-4">
        <h2>NBA</h2>
        <p>
          The National Basketball Association is a professional basketball
          league in North America. The league is composed of 30 teams and is one
          of the four major professional sports leagues in the United States and
          Canada. It is the premier men's professional basketball league in the
          world
        </p>
      </div>
      <div className="col-md-4">
        <h2>Lebron James</h2>
        <p>
          LeBron Raymone James Sr. is an American professional basketball player
          for the Los Angeles Lakers of the National Basketball Association.
          Widely considered one of the best players in NBA history, James is
          frequently compared to Michael Jordan in debates over the greatest
          basketball player eve
        </p>
      </div>
      <div className="col-md-4">
        <h2>4 times NBA champ </h2>
        <p>
          LeBron Raymone James Sr. is an American professional basketball player
          for the Los Angeles Lakers of the National Basketball Association.
          Widely considered one of the best players in NBA history, James is
          frequently compared to Michael Jordan in debates over the greatest
          basketball player eve
        </p>
      </div>
    </div>
  </div>
);
