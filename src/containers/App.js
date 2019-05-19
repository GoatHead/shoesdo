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
                (dataWithDate !== "undefined" ? dataWithDate : [])
                ,
                (dataWithoutDate !== "undefined" ? dataWithoutDate : [])
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
        this.memoSortingRandom = this.memoSortingRandom.bind(this);
        this.memoExpired = this.memoExpired.bind(this)
    };

    memoExpired() {
        const {data} = this.state;
        let resList = [];
        if (!Array.isArray(data[0])){
            return;
        }
        for (let record of data[0]) {
            const {notifyDate} = record;
            let tDate = new Date(notifyDate.replace(/-/g, '/'));
            let now = new Date();
            if (tDate < now) {
                resList = [...resList, record]
            }
        }
        return resList
    }

    memoSortingRandom() {
        const data = this.state.data;
        let nextData = [];
        try {
            for (let dataPart of data) {
                let nextRecords = [];
                const outerIndex = data.indexOf(dataPart);
                for (let record of dataPart) {
                    const index = dataPart.indexOf(record);
                    const random = Math.floor(Math.random() * 100);
                    const nextRecord = update(record, {
                        order: {$set: random}
                    });
                    nextRecords = [...nextRecords, nextRecord];
                }
                nextData = [...nextData, nextRecords]
            }
        } catch (e) {
            return
        }
        this.setState({
            data: update(this.state.data, {
                $set: nextData
            })
        });
        console.log('포스트잇이 섞였다.');
    }

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
        let _order = 0;
        if (!Array.isArray(this.state.data[array_type])) {
            _order = 0;
        } else {
            _order = (this.state.data[array_type].length > 0
                ? Math.max(...this.state.data[array_type].map(data => data.order)) + 1
                : 0);
        }
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
            id: '0',
            title: "1번 메모",
            content: " " +
                "않은 헤는 나는 봅니다. 딴은 내린 언덕 계십니다. " +
                "위에 다하지 않은 내린 토끼, 청춘이 가슴속에 까닭입니다. " +
                "파란 이웃 하나 별 하나에 하나에 까닭입니다.",
            modifyDate: "2019-01-01",
            notifyDate: "2020-01-04",
            endedWork: true,
            order: 0
        }, {
            id: '1',
            title: "2번 메모",
            content: "너무나 때 언덕 프랑시스 다하지 청춘이 책상을 버리었습니다. " +
                " " +
                "위에 다하지 않은 내린 토끼, 청춘이 가슴속에 까닭입니다. " +
                "파란 이웃 하나 별 하나에 하나에 까닭입니다.",
            modifyDate: "2019-01-01",
            notifyDate: "2020-01-04",
            endedWork: true,
            order: 1
        }, {
            id: '2',
            title: "3번 메모",
            content: "너무나 때 언덕 프랑시스 다하지 청춘이 책상을 버리었습니다. " +
                "않은 헤는 나는 봅니다. 딴은 내린 언덕 계십니다. " +
                "" +
                "파란 이웃 하나 별 하나에 하나에 까닭입니다.",
            modifyDate: "2019-01-01",
            notifyDate: "2017-01-04",
            endedWork: true,
            order: 2
        }, {
            id: '3',
            title: "4번 메모",
            content: "너무나 때 언덕 프랑시스 다하지 청춘이 책상을 버리었습니다. " +
                "않은 헤는 나는 봅니다. 딴은 내린 언덕 계십니다. " +
                "위에 다하지 않은 내린 토끼, 청춘이 가슴속에 까닭입니다. " +
                "",
            modifyDate: "2019-01-01",
            notifyDate: "2018-12-04",
            endedWork: true,
            order: 3
        }, {
            id: '4',
            title: "5번 메모",
            content: " " +
                "않은 헤는 나는 봅니다. 딴은 내린 언덕 계십니다. " +
                "위에 다하지 않은 내린 토끼, 청춘이 가슴속에 까닭입니다. " +
                "파란 이웃 하나 별 하나에 하나에 까닭입니다.",
            modifyDate: "2019-01-01",
            notifyDate: "2030-12-04",
            endedWork: false,
            order: 4
        }];
        const data2 = [{
            id: '0',
            title: "1번 메모",
            content: "너무나 때 언덕 프랑시스 다하지 청춘이 책상을 버리었습니다. " +
                "" +
                "위에 다하지 않은 내린 토끼, 청춘이 가슴속에 까닭입니다. " +
                "파란 이웃 하나 별 하나에 하나에 까닭입니다.",
            modifyDate: "2019-01-01",
            notifyDate: "",
            endedWork: false,
            order: 0
        }, {
            id: '1',
            title: "2번 메모",
            content: "너무나 때 언덕 프랑시스 다하지 청춘이 책상을 버리었습니다. " +
                "않은 헤는 나는 봅니다. 딴은 내린 언덕 계십니다. " +
                " " +
                "파란 이웃 하나 별 하나에 하나에 까닭입니다.",
            modifyDate: "2019-01-01",
            notifyDate: "",
            endedWork: false,
            order: 1
        }, {
            id: '2',
            title: "3번 메모",
            content: "너무나 때 언덕 프랑시스 다하지 청춘이 책상을 버리었습니다. " +
                "않은 헤는 나는 봅니다. 딴은 내린 언덕 계십니다. " +
                "위에 다하지 않은 내린 토끼, 청춘이 가슴속에 까닭입니다. " +
                "",
            modifyDate: "2019-01-01",
            notifyDate: "",
            endedWork: true,
            order: 2
        }, {
            id: '3',
            title: "4번 메모",
            content: "너무나 때 언덕 프랑시스 다하지 청춘이 책상을 버리었습니다. " +
                "않은 헤는 나는 봅니다. 딴은 내린 언덕 계십니다. " +
                "위에 다하지 않은 내린 토끼, 청춘이 가슴속에 까닭입니다. " +
                "파란 이웃 하나 별 하나에 하나에 까닭입니다.",
            modifyDate: "2019-01-01",
            notifyDate: "",
            endedWork: true,
            order: 3
        }, {
            id: '4',
            title: "5번 메모",
            content: "" +
                "않은 헤는 나는 봅니다. 딴은 내린 언덕 계십니다. " +
                "위에 다하지 않은 내린 토끼, 청춘이 가슴속에 까닭입니다. " +
                "파란 이웃 하나 별 하나에 하나에 까닭입니다.",
            modifyDate: "2019-01-01",
            notifyDate: "",
            endedWork: false,
            order: 4
        }];
        this.setState({
            data: [data1, data2]
        });
    }
    ;

    memoDrag(draggedPost, droppedPost) {
        if (draggedPost.align !== droppedPost.align) {
            console.error("두 요소의 align 값이 같지 않습니다.");
            return
        }
        if (draggedPost.order === droppedPost.order) {
            console.error("두 포스트가 동일합니다.");
            return
        }
        const {align} = draggedPost;
        const array_type = (align === 'left' ? 0 : 1);
        const data = this.state.data[array_type];
        const droppedRecord = data.filter(record => record.order === droppedPost.order)[0];
        // 인덱스 구하기
        const draggedRecord = data.filter(record => record.order === draggedPost.order)[0];
        // 인덱스 구하기
        let recordPieces = [];
        let ele = update(draggedRecord, {
            order: {
                $set: droppedPost.order
            }
        });
        recordPieces = [...recordPieces, ele];
        // 드래그한 포스트의 순서 변경
        if (draggedPost.order > droppedPost.order) { // Droped 된 포스트가 더 위에 있음
            ele = update(droppedRecord, {
                order: {
                    $set: droppedPost.order + 1
                }
            });
            recordPieces = [...recordPieces, ele];
            const rawRecords = data.filter(record => (record.id !== draggedRecord.id) && (record.id !== droppedRecord.id));
            const records = rawRecords.filter(record => (record.order > droppedPost.order) && (record.order <= draggedPost.order));
            const untrackedRecords = rawRecords.filter(record => (record.order <= droppedPost.order) || (record.order > draggedPost.order));
            let pushRecords = records.map(d => update(d, {
                order: {$set: d.order + 1}
            }));
            recordPieces = [...recordPieces, ...pushRecords, ...untrackedRecords];
        } else if (draggedPost.order < droppedPost.order) { // Dropped 된 포스트가 더 아래에 있음(order 값이 더 큼)
            ele = update(droppedRecord, {
                order: {
                    $set: droppedPost.order - 1
                }
            });
            recordPieces = [...recordPieces, ele];
            const rawRecords = data.filter(record => record.id !== draggedRecord.id);
            const records = rawRecords.filter(record => (record.order > draggedPost.order) && (record.order < droppedPost.order));
            const untrackedRecords = rawRecords.filter(record => (record.order < draggedPost.order) || (record.order > droppedPost.order));
            let pushRecords = records.map(d => update(d, {
                order: {$set: d.order - 1}
            }));
            recordPieces = [...recordPieces, ...pushRecords, ...untrackedRecords];
        }
        this.setState({
            data: update(this.state.data, {
                [array_type]: {
                    $set: recordPieces
                }
            })
        })
    };

    memoClear() {
        this.setState({
            data: [,]
        });
    }
    ;

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
                    memoExpired={this.memoExpired}
                    memoWrite={this.memoWrite}
                    onClear={this.memoClear}
                    onTest={this.memoTest}
                    onSortingRandom={this.memoSortingRandom}
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
