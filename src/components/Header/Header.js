import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import WriteBox from "../WriteBox/WriteBox";
import { memoWriteBtnToggle } from '../../actions/memo'
import {connect} from "react-redux";

const propTypes = {};

const defaultProps = {
    memoWrite: () => console.log("memoWrite 없음")
};

class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <nav>
                    <div className="nav-wrapper teal darken-1">
                        <label><Link to="/" className="brand-logo center">SHOESDO</Link></label>

                        <ul>
                            <li><a><i className="material-icons">notifications</i></a></li>
                        </ul>

                        <div className="right">
                            <ul>
                                <li><a onClick={this.props.onTest}>테스트</a></li>
                                <li><a onClick={this.props.onWrite}><i className="material-icons">create</i></a></li>
                                <li><a onClick={this.props.onClear}><i className="material-icons">clear_all</i></a></li>
                                {/*<li><a><i className="material-icons">vpn_key</i></a></li>*/}
                                {/*<li><a><i className="material-icons">lock_open</i></a></li>*/}
                            </ul>
                        </div>
                    </div>
                </nav>
                <WriteBox
                    memoWrite={this.props.memoWrite}
                />
            </div>
        );
    }
}

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

const mapDispatchToProps = (dispatch) => {
    return {
        onWrite: () => {
            return dispatch(memoWriteBtnToggle());
        }
    }
};
export default connect(undefined, mapDispatchToProps)(Header);