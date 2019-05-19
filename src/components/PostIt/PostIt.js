import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Header from './Header/Header';
import './PostIt.css'
import './Footer.css'

const propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    modifyDate: PropTypes.string,
    notifyDate: PropTypes.string,
    endedWork: PropTypes.bool,
    memoDelete: PropTypes.func,
    memoUpdate: PropTypes.func,
    memoCheckedToggle: PropTypes.func,
    memoDrag: PropTypes.func,
    align: PropTypes.string,
    order: PropTypes.number
};
const defaultProps = {
    id: "",
    title: "",
    content: "",
    modifyDate: "",
    notifyDate: "",
    endedWork: false,
    order: 0
};

class PostIt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
            content: this.props.content,
            notifyDate: this.props.notifyDate,
            isChecked: this.props.endedWork,
            isEditing: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.changeEdit = this.changeEdit.bind(this);
        this.isDatePassed = this.isDatePassed.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeChk = this.handleChangeChk.bind(this);
        this.handleOnDrag = this.handleOnDrag.bind(this);
        this.handleOnDrop = this.handleOnDrop.bind(this);
        this.handleOnDragOver = this.handleOnDragOver.bind(this);
    }
    /*
        스위치에 핸들링된 함수입니다.
    */
    handleChangeChk = () => {
        this.setState({
            isChecked: !this.state.isChecked
        });
        const { id, notifyDate } = this.props;
        const isDateExist = (notifyDate !== "");
        this.props.memoCheckedToggle(id, isDateExist);
    };
/*
    마감기한이 지났는지 검사하는 함수입니다.
*/
    isDatePassed() {
        let targetDate = this.props.notifyDate;
        if (!targetDate) return false;
        let tDate = new Date(targetDate.replace(/-/g, '/'));
        let now = new Date();
        return (tDate < now);
    }
/*
    아래는 드래그 기능을 위한 함수들입니다.
    이벤트 객체에 데이터를 저장하고
    드래그하는 포스트와
    드래그 되는 포스트(드랍되는 포스트)의 정보를 쌍으로 묶어 인자로 삼아
    App.js의 함수에서 처리하여 각 포스트 객체의 order 값 정렬을 시키는데 성공하였습니다.
    하지만 의도대로 렌더링되지 않아 새로고침 없이 정렬하는데는 실패하였습니다.
*/
    handleOnDrag = (e, postit) => {
        const {order, align}= postit.props;
        const dragObj = {
            order,
            align
        };
        console.log(dragObj);
        e.dataTransfer.setData("dragPost", JSON.stringify(dragObj));
    };

    handleOnDrop = (e, postit) => {
        e.preventDefault();
        const dragged = JSON.parse(e.dataTransfer.getData("dragPost"));
        const {order, align}= postit.props;
        const dropped = {
            order,
            align
        };
        this.props.memoDrag(dragged, dropped);
    };

    handleOnDragOver = (e) => {
        e.preventDefault();
    };

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    };

    changeEdit() {
        this.setState({
            isEditing: !this.state.isEditing
        });
    }



    render() {
        const { isEditing } = this.state;
        const isDatePassedBool = this.isDatePassed();
        return (
                <div className="s12"
                    draggable
                     onDragStart={e => this.handleOnDrag(e, this)}
                     onDragOver={(event) => this.handleOnDragOver(event)}
                     onDrop = {e => this.handleOnDrop(e, this)}
                >
                    <div className="card small white darken-1">
                        {/*Header*/}
                        <Header
                            id={this.props.id}
                            notifyDate={this.state.notifyDate}
                            title={this.state.title}
                            content={this.state.content}
                            onToggleEditmode={this.changeEdit}
                            isEditing={this.state.isEditing}
                            memoDelete={this.props.memoDelete}
                            memoUpdate={this.props.memoUpdate}
                        />
                        {/*contents*/}
                        <div className="post-content">
                            {isEditing
                                ? <textarea
                                    id="content"
                                    className="materialize-textarea"
                                    name="content"
                                    value={this.state.content}
                                    onChange={this.handleChange}
                                />
                                : <div>{this.state.content}</div> }
                        </div>
                        {/*Footer*/}
                        <div className="Footer">
                            <div className="left">
                                <div className="switch">
                                    {isDatePassedBool
                                        ?
                                        <label>
                                            <input disabled checked type="checkbox"/>
                                            <span className="lever"/>
                                        </label>
                                        :
                                        <label>
                                            완료 체크
                                            <input type="checkbox"
                                                   checked={this.state.isChecked}
                                                   onChange={this.handleChangeChk}
                                            />
                                            <span className="lever"/>
                                        </label>
                                    }
                                </div>
                            </div>
                            {this.state.notifyDate
                                ?
                                !isEditing
                                    ?
                                    !isDatePassedBool
                                        ?
                                        <div className="right">
                                            <label>마감기한 </label>
                                            {this.state.notifyDate}
                                        </div>
                                        :
                                        <div className="right">
                                            <label>마감된 작업입니다.(마감 일자:{this.state.notifyDate})</label>
                                        </div>
                                    :
                                    <input
                                        name="notifyDate"
                                        type="text"
                                        className="validate"
                                        onChange={this.handleChange}
                                        value={this.state.notifyDate}
                                    />
                                :
                                <div />
                            }
                        </div>
                    </div>
                </div>
        );
    }
}

PostIt.propTypes = propTypes;
PostIt.defaultProps = defaultProps;

export default PostIt;