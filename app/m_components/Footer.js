import React from 'react';
import {
    IndexLink
    } from 'react-router';
class Footer extends React.Component {
    componentDidMount() {
        /*$(".footer-nav .navbar").headroom({
            tolerance: 0,
            offset: 0,
            classes: {
                initial: "animated",
                pinned: "slideInUp",
                unpinned: "slideOutDown"
            }
        });*/

    }
    render() {
        return (<div className="footer-nav">
            <nav className="navbar navbar-default navbar-fixed-bottom" role="navigation">
                <div className="container-fluid">
                    <div className="nav-tab">
                            <IndexLink  to={'/'} className="tab-item" activeClassName="tab-item-active">
                                <div className="glyphicon glyphicon-inbox"></div>
                                <div>快阅</div>
                            </IndexLink>
                            <IndexLink  to={'/page/1'}  className="tab-item"  activeClassName="tab-item-active">
                                <div className="glyphicon glyphicon-th-list"></div>
                                <div>资讯</div>
                            </IndexLink>
                            <IndexLink  to={'/hotdot'} className="tab-item hide" activeClassName="tab-item-active">
                                <div className="glyphicon glyphicon-signal"></div>
                                <div>趋势</div>
                            </IndexLink>
                            <IndexLink to={'/sports'} className="tab-item hide" activeClassName="tab-item-active">
                                <div className="glyphicon glyphicon-globe"></div>
                                <div>专家</div>
                            </IndexLink>
                            <IndexLink to={'/myInfo'} className="tab-item" activeClassName="tab-item-active">
                                <div className="glyphicon glyphicon-user"></div>
                                <div>我的</div>
                            </IndexLink>
                    </div>
                </div>
            </nav>
        </div> );
    }
}

export default Footer;