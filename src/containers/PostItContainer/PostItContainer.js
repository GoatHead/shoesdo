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
            type: this.props.align, // left or right
            data: this.props.data
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const { data } = nextProps;
        if (data !== undefined) {
            data.sort((order1, order2) => {
                return order1.order - order2.order;
            });
            this.setState({
                data: data,
            });
        } else {
            this.setState({
                data: []
            })
        }
    };

    render() {
        const { data } = this.state;
        let generatePostIt;
        if (Array.isArray(data)) {
            generatePostIt = this.state.data.map((data, i) => {
                return (<PostIt
                    id={data.id}
                    key={data.id}
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
                    memoDrag={this.memoDrag}
                />)
            });
        }
        else {
            generatePostIt = "";
        }
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