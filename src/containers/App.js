import React, {Component} from 'react';
import {Header} from "../components/";
import {PostItContainer} from "../containers/";
import update from 'react-addons-update';
import crypto from 'crypto';

class App extends Component {

    constructor(props) {
        super(props);
        let dataWithDate = localStorage.getItem('datawithdate');
        let dataWithoutDate = localStorage.getItem('data');
        if (dataWithDate !== "undefined") {
            dataWithDate = JSON.parse(dataWithDate);
        }
        if (dataWithoutDate !== "undefined") {
            dataWithoutDate = JSON.parse(dataWithoutDate);
        }
        this.state = {
            data: [
                (dataWithDate ? dataWithDate : [])
                ,
                (dataWithoutDate ? dataWithoutDate : [])
            ],
            draggedPost: {
                order: 0,
                align: ''
            },
            droppedPost: {
                order: 0,
                align: ''
            }
        };
        this.memoWrite = this.memoWrite.bind(this);
        this.memoDelete = this.memoDelete.bind(this);
        this.memoUpdate = this.memoUpdate.bind(this);
        this.memoCheckedToggle = this.memoCheckedToggle.bind(this);
        this.memoClear = this.memoClear.bind(this);
        this.memoTest = this.memoTest.bind(this);
        this.memoDrag = this.memoDrag.bind(this);
    };

    memoSorting(data) {
        update(data, {});
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.data[0] !== this.state.data[0]) {
            localStorage.datawithdate = JSON.stringify(this.state.data[0]);
        }
        if (prevState.data[1] !== this.state.data[1]) {
            localStorage.data = JSON.stringify(this.state.data[1]);
        }
    }

    memoWrite(inputObj, isDateExist = false) {
        const array_type = isDateExist ? 0 : 1; // 0: 날짜 존재 1: 날짜 미존재
        inputObj['title'] = inputObj['title'].slice(0, 20);
        const _id = crypto.randomBytes(20).toString('hex');
        const _order = (this.state.data[array_type]
            ? this.state.data[array_type].length
            : 0);
        const pushObj = update(inputObj, {
            id: {$set: _id},
            order: {$set: _order}
        });
        this.setState({
            data: update(this.state.data, {
                [array_type]: {
                    $push: [pushObj]
                }
            })
        });
    }

    memoTest() {
        const data1 = [{
            id: 0,
            title: "오늘 할 일",
            content: "코딩",
            modifyDate: "2019-01-01",
            notifyDate: "2020-01-04",
            endedWork: true,
            order: 0
        }, {
            id: 1,
            title: "오늘 할 일",
            content: "코딩",
            modifyDate: "2019-01-01",
            notifyDate: "2020-01-04",
            endedWork: true,
            order: 1
        }, {
            id: 2,
            title: "오늘 할 일",
            content: "코딩",
            modifyDate: "2019-01-01",
            notifyDate: "2020-01-04",
            endedWork: true,
            order: 2
        }, {
            id: 3,
            title: "오늘 할 일",
            content: "코딩",
            modifyDate: "2019-01-01",
            notifyDate: "2020-01-04",
            endedWork: true,
            order: 3
        }, {
            id: 4,
            title: "오늘 할 일",
            content: "코딩",
            modifyDate: "2019-01-01",
            notifyDate: "2020-01-04",
            endedWork: false,
            order: 4
        }];
        const data2 = [{
            id: 0,
            title: "오늘 할 일",
            content: "코딩",
            modifyDate: "2019-01-01",
            notifyDate: "",
            endedWork: false,
            order: 0
        }, {
            id: 1,
            title: "오늘 할 일",
            content: "코딩",
            modifyDate: "2019-01-01",
            notifyDate: "",
            endedWork: false,
            order: 1
        }, {
            id: 2,
            title: "오늘 할 일",
            content: "코딩",
            modifyDate: "2019-01-01",
            notifyDate: "",
            endedWork: true,
            order: 2
        }, {
            id: 3,
            title: "오늘 할 일",
            content: "코딩",
            modifyDate: "2019-01-01",
            notifyDate: "",
            endedWork: true,
            order: 3
        }, {
            id: 4,
            title: "오늘 할 일",
            content: "코딩",
            modifyDate: "2019-01-01",
            notifyDate: "",
            endedWork: false,
            order: 4
        }];
        this.setState({
            data: [data1, data2]
        });
    };

    memoDrag(draggedPost, droppedPost) {
        if (!draggedPost.align !== droppedPost.align) {
            return
        }
        const {align} = draggedPost;
        const array_type = (align === 'left' ? 0 : 1);
        const droppedRecord = this.state.data[array_type].filter(record => record.order === droppedPost.order)[0];
        const droppedIndex = this.state.data[array_type].indexOf(droppedRecord);
        // 인덱스 구하기
        const draggedRecord = this.state.data[array_type].filter(record => record.order === draggedPost.order)[0];
        const draggedIndex = this.state.data[array_type].indexOf(draggedRecord);
        // 인덱스 구하기
        this.setState({
            data: update(this.state.data, {
                [array_type]: {
                    [draggedIndex]: {
                        order: {
                            $set: droppedPost.order
                        }
                    }
                }
            })
        });
        // 드래그한 포스트의 순서 변경
        if (draggedPost.order > droppedPost.order) { // Droped 된 포스트가 더 위에 있음
            const records = this.state.data[array_type].filter(record => record.order >= droppedPost.order && record.id !== draggedPost.id);
            let pushRecords = records.map(d => update(d, {
                order: {$set: d.order + 1}
            }));
            for (let record of pushRecords) { // 순회하면서 state의 data 순서값 변경
                const prevRecord = this.state.data[array_type].filter(r => r.id === record.id)[0];
                const recordIndex = this.state.data[array_type].indexOf(prevRecord);
                this.setState({
                    data: update(this.state.data, {
                        [array_type]: {
                            [recordIndex]: {
                                $set: record
                            }
                        }
                    })
                });
            }
        } else if (draggedPost.order < droppedPost.order) { // Dropped 된 포스트가 더 아래에 있음
            const records = this.state.data[array_type].filter(
                record => record.order > draggedPost.order && record.order <= droppedPost.order && record.id !== draggedPost.id
            );
            let pushRecords = records.map(d => update(d, {
                order: {$set: d.order - 1}
            }));
            for (let record of pushRecords) { // 순회하면서 state의 data 순서값 변경
                const prevRecord = this.state.data[array_type].filter(r => r.id === record.id)[0];
                const recordIndex = this.state.data[array_type].indexOf(prevRecord);
                this.setState({
                    data: update(this.state.data, {
                        [array_type]: {
                            [recordIndex]: {
                                $set: record
                            }
                        }
                    })
                });
            }
        }
    };

    memoClear() {
        this.setState({
            data: [,]
        });
    };

    memoUpdate(id, inputObj, isDateExist) {
        const array_type = isDateExist ? 0 : 1;
        const record = this.state.data[array_type].filter(record => record.id === id)[0];
        const index = this.state.data[array_type].indexOf(record);
        inputObj['title'] = inputObj['title'].slice(0, 20);
        const pushObj = update(record, {
            title: {$set: inputObj['title']},
            content: {$set: inputObj['content']},
            modifyDate: {$set: new Date().toISOString().split('T')[0]},
            notifyDate: {$set: (isDateExist ? inputObj['notifyDate'] : "")},
        });
        this.setState({
            data: update(this.state.data, {
                [array_type]: {
                    [index]: {$set: pushObj}
                }
            })
        });
    }

    memoDelete(id, isDateExist) {
        const array_type = isDateExist ? 0 : 1;
        const record = this.state.data[array_type].filter(record => record.id === id)[0];
        const index = this.state.data[array_type].indexOf(record);
        this.setState({
            data: update(this.state.data, {
                [array_type]: {
                    $splice: [[index, 1]]
                }
            })
        });
    }

    memoCheckedToggle(id, isDateExist) {
        const array_type = isDateExist ? 0 : 1;
        const record = this.state.data[array_type].filter(record => record.id === id)[0];
        const index = this.state.data[array_type].indexOf(record);
        this.setState({
            data: update(this.state.data, {
                [array_type]: {
                    [index]: {
                        endedWork: {$set: !this.state.data[array_type][index].endedWork}
                    }
                }
            })
        });
    }

    render() {
        return (
            <div className="App">
                <Header
                    memoWrite={this.memoWrite}
                    onClear={this.memoClear}
                    onTest={this.memoTest}
                />
                <div className="container row">
                    <PostItContainer
                        align="left"
                        data={this.state.data[0]}
                        memoDelete={this.memoDelete}
                        memoUpdate={this.memoUpdate}
                        memoCheckedToggle={this.memoCheckedToggle}
                        memoDrag={this.memoDrag}
                    />
                    <PostItContainer
                        align="right"
                        data={this.state.data[1]}
                        memoDelete={this.memoDelete}
                        memoUpdate={this.memoUpdate}
                        memoCheckedToggle={this.memoCheckedToggle}
                        memoDrag={this.memoDrag}
                    />

                </div>
            </div>
        );
    }
}

export default App;
