import React from 'react';
import {
	Link
} from 'react-router';

import Home from './Home';

class Header extends React.Component {

	componentDidMount() {
		$(".header-nav .navbar").headroom({
			tolerance: 2,
			offset: 50,
			classes: {
				initial: "animated",
				pinned: "slideInDown",
				unpinned: "slideOutUp"
			}
		});
		$(".return-btn").on("touchend",function(){
			/*location.href = "/#/home";*/
            history.go(-1);
		});
	}
	render() {
		return (
          <div className="header-nav">
			<div className="navbar navbar-inverse navbar-fixed-top">
				<div className="container">
	       			<div className="navbar-header">
						<span className="return-btn glyphicon glyphicon-chevron-left"></span>
						<a href="/#/home" className="navbar-brand hidden-sm">七只狸猫</a>
	        		</div>
      			</div>
    		</div>
		  </div>
		);
	}
}


export default Header;