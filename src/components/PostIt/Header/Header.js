import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Header.css';

const propTypes = {};

const defaultProps = {
    title: "",
    onToggleEditmode: () => console.log("에러"),
    memoDelete: (id, isDateExist) => console.log("에러"),
    isEditing: false,
};

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleMemoDelete = this.handleMemoDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleCanDragAlram = this.handleCanDragAlram .bind(this);
    }

    handleCanDragAlram = () => {
        alert('포스트잇을 드래그하면 우선순위를 조절할 수 있어요!');
    }

    handleMemoDelete = () => {
        const id = this.props.id;
        const isDateExist = (this.props.notifyDate !== "");
        this.props.memoDelete(id, isDateExist);
    };

    handleChange = (e) => {
        const {name, value} = e.target;
        this.setState({
            [name]: value
        });
    };
    checkInputValidate = (title, content ,notifyTime) => {
        const regEx = /^\d{4}-\d{2}-\d{2}$/;
        if (title === "") {
            alert('제목을 채워주세요.');
            return false
        } else if (title.length >= 20) { // 20자 이상은 X
            alert('제목은 20자 이하로 작성해주세요.');
            return false
        }
        // 내용 타당 검사
        if (content === "") {
            alert('내용을 채워주세요.');
            return false
        }
        // 날짜 타당 검사
        if (notifyTime === "") { // 날짜가 비었을 때

        } else if (notifyTime.match(regEx)) { // 날짜 문자열일 시
            if (isNaN(Date.parse(notifyTime))) { // 형식은 맞지만 올바른 날짜가 아님
                alert('올바른 날짜가 아닙니다.');
                return false
            }

        } else { // 그 외 이상한 문자열일 경우
            alert('올바른 날짜가 아닙니다.\n 2002-02-02 형식으로 입력해주세요.');
            return false;
        }
        return true;
    };

    componentWillReceiveProps(nextProps, nextContext) {
    }

    handleEdit = () => {
        const {id, content, notifyDate} = this.props;
        const isDateExist = (notifyDate !== "");
        let {title} = this.state;
        if (this.props.isEditing) { // 만약 수정 모드를 종료한다면
            if (!this.checkInputValidate(title, content, notifyDate)) {
                return
            }
            title = title.slice(0, 20);
            this.setState({
                title
            });
            const inputObj = {
                title,
                content,
                notifyDate
            };
            this.props.memoUpdate(id, inputObj, isDateExist);
        }
        this.props.onToggleEditmode();
    };


    render() {
        return (
            <div className='Header'>
                <div className="post-header">
                    <a className="waves-light btn-floating btn-small"><i
                        className="small material-icons"
                        onClick={this.handleCanDragAlram}>reorder</i></a>
                </div>
                <div className="title post-header post-header-center">
                    {this.props.isEditing
                        ? <div className="input-field">
                            <input
                                name="title"
                                type="text"
                                className="validate"
                                onChange={this.handleChange}
                                value={this.state.title}
                            />
                        </div>
                        : <div>{this.state.title}</div>
                    }
                </div>
                <div className="right">
                    <a className="waves-effect waves-light btn-floating btn-small" onClick={this.handleEdit}><i
                        className="small material-icons">build</i>
                    </a>
                    {!this.props.isEditing
                    ? <a className="waves-effect waves-light btn-floating btn-small" onClick={this.handleMemoDelete}><i
                            className="small material-icons">clear</i></a>
                    : <a className="disabled btn-floating btn-small"><i
                            className="small material-icons">clear</i></a>
                    }

                </div>
            </div>
        );
    }
}

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;