import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './WriteBox.css';
import {connect} from 'react-redux';
import {memoWriteBtnToggle} from '../../actions/memo'

const propTypes = {};

const defaultProps = {
    memoWrite: (inputObj, isDateExist = false) => console.log("memoWrite 없음")
};

class WriteBox extends Component {
    constructor(props) {
        super(props);
        this.handleWrite = this.handleWrite.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.clear = this.clear.bind(this);
        this.state = {
            title: "",
            content: "",
            notifyTime: ""
        };
    }

    handleChange = (e) => {
        const {name, value} = e.target;
        this.setState({
            [name]: value
        });
    };

    clear() {
        this.setState({
            title: "",
            content: "",
            notifyTime: ""
        });
    };

/*
    글쓰기 기능을 담당하는 함수입니다.
    실제 구현은 App.js에 되어있고, 이 함수에서는 입력되는 데이터들이 타당한지를 검사하는게 주기능입니다.
 */
    handleWrite() {
        const regEx = /^\d{4}-\d{2}-\d{2}$/;
        const now = new Date().toISOString().substring(0, 10);
        const notifyTime = this.state.notifyTime;
        let isDateExist = false;
        // 제목 타당 검사
        if (this.state.title === "") {
            alert('제목을 채워주세요.');
            return
        } else if (this.state.title.length >= 20) { // 20자 이상은 X
            alert('제목은 20자 이하로 작성해주세요.');
            return
        }
        // 내용 타당 검사
        if (this.state.content === "") {
            alert('내용을 채워주세요.');
            return
        }
        // 날짜 타당 검사
        if (notifyTime === "") { // 날짜가 비었을 때
            isDateExist = false;
        } else if (notifyTime.match(regEx)) { // 날짜 문자열일 시
            if (isNaN(Date.parse(notifyTime))) { // 형식은 맞지만 올바른 날짜가 아님
                this.setState({
                    notifyTime: ""
                });
                alert('올바른 날짜가 아닙니다.');
                return
            }
            isDateExist = true;
        } else { // 그 외 이상한 문자열일 경우
            this.setState({
                notifyTime: ""
            });
            alert('올바른 날짜가 아닙니다.\n 2002-02-02 형식으로 입력해주세요.');
            return;
        }

        const inputObj = {
            title: this.state.title,
            content: this.state.content,
            modifyDate: now,
            notifyDate: notifyTime,
        };
        this.props.memoWrite(inputObj, isDateExist);
        this.props.onCancel();
        this.clear();
    }

    render() {
        const {isWriting} = this.props;
        if (!isWriting) return null;
        return (
            <div className="WriteBoxWrapper">
                <div className="WriteBox">
                    <div className="input-field">
                        <input
                            id="title"
                            type="text"
                            name="title"
                            value={this.state.title}
                            onChange={this.handleChange}
                        />
                        <label htmlFor="title">제목(20자 이하)</label>
                    </div>
                    <div className="input-field">
                    <textarea
                        id="content"
                        className="materialize-textarea"
                        name="content"
                        value={this.state.content}
                        onChange={this.handleChange}
                    />
                        <label htmlFor="content">내용</label>
                    </div>
                    <div className="input-field col s6">
                        <i className="material-icons prefix">date_range</i>
                        <input
                            id="icon_prefix"
                            type="text"
                            name="notifyTime"
                            className="validate"
                            value={this.state.notifyTime}
                            onChange={this.handleChange}
                        />
                        <label htmlFor="icon_prefix">마감 예정 날짜(yyyy-mm-dd)</label>
                    </div>
                    <button className="btn right" onClick={this.props.onCancel}>취소</button>
                    <button className="btn right" onClick={this.handleWrite}>글 작성</button>
                </div>
            </div>
        );
    }
}

WriteBox.propTypes = propTypes;
WriteBox.defaultProps = defaultProps;

const mapStateToProps = (state) => {
    return {
        isWriting: state.memo.isWriting
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onCancel: () => {
            return dispatch(memoWriteBtnToggle());
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(WriteBox);