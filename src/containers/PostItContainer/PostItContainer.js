import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { PostIt } from '../../components';
import './PostItContainer.css'

const propTypes = {};
const defaultProps = {};

class PostItContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: this.props.align, // left or right. 포스트잇 컨테이너(래퍼)의 위치를 설정합니다.
        };
    }

    render() {
        const { data } = this.props;
        if (!Array.isArray(data)) {
            return "";
        }
        /*
            컨테이너 내부의 포스트잇들을 정렬&생성하는 렌더링용 함수입니다.
         */
        const generatePostIt = data.sort((orderA, orderB) => orderA.order - orderB.order)
            .map((data, i) => {
                return (<PostIt
                    id={data.id}
                    title={data.title}
                    content={data.content}
                    modifyDate={data.modifyDate}
                    notifyDate={data.notifyDate}
                    endedWork={data.endedWork}
                    memoDelete={this.props.memoDelete}
                    memoUpdate={this.props.memoUpdate}
                    memoCheckedToggle={this.props.memoCheckedToggle}
                    order={data.order}
                    align={this.props.align}
                    memoDrag={this.props.memoDrag}
                />)
            });
        return (
            <div className={`col s6 ${this.props.align}`}>
                <div className="center title teal z-depth-1 post-container">
                {this.state.type === 'left'
                    ?
                    <h5 className="white-text text-lighten-3">마감 있는 작업</h5>
                    :
                    <h5 className="white-text text-lighten-3">무기한 작업</h5>
                }
                </div>
                {generatePostIt}
            </div>
        );
    }
}

PostItContainer.propTypes = propTypes;
PostItContainer.defaultProps = defaultProps;

export default PostItContainer;