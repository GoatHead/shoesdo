import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import WriteBox from "../WriteBox/WriteBox";
import {memoWriteBtnToggle} from '../../actions/memo'
import {connect} from "react-redux";

const propTypes = {};

const defaultProps = {
    memoWrite: () => console.log("memoWrite 없음")
};

class Header extends Component {
    constructor(props) {
        super(props);
        this.handleMemoExpired = this.handleMemoExpired.bind(this)
    }

    /*
        상단의 알람버튼을 핸들링하여 기능을 구현한 함수입니다.
    */
    handleMemoExpired() {
        const expiredList = this.props.memoExpired();
        if (!Array.isArray(expiredList)) {
            return;
        }
        if (expiredList.length > 0) {
            let resStr = "[마감 TODO 체크]\n";
            for (let record of expiredList) {
                resStr += `제목: ${record.title}는 마감되었습니다. 마감시간: ${record.notifyDate}\n`;
            }
            alert(resStr);
        }
    }

    render() {
        return (
            <div>
                <nav>
                    <div className="nav-wrapper teal darken-1">
                        <label><Link to="/" className="brand-logo center">SHOESDO</Link></label>

                        <ul>
                            <li><a
                                onClick={this.handleMemoExpired}
                            ><i className="material-icons">notifications</i></a></li>
                        </ul>

                        <div className="right">
                            <ul>
                                <li><a onClick={this.props.onTest}>데이터 생성</a></li>
                                <li><a onClick={this.props.onSortingRandom}>포스트잇 섞기</a></li>
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