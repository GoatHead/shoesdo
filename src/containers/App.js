import React, {Component} from 'react';
import {Header} from "../components/";
import {PostItContainer} from "../containers/";
import update from 'react-addons-update';
import crypto from 'crypto';

class App extends Component {

    constructor(props) {
        super(props);
/*
    생성자에서는 로컬 스토리지에서 데이터를 불러옵니다.
    data의 명세는 다음과 같습니다.
    [
    [{ id, title, content, modifyDate, notifyDate, endedWork, order }, {... } ...],
     [{... }, {... } ...]
    ]
    notifyDate가 있으면 배열의 첫번째 원소로, 없으면 두번째 원소로 들어가게 됩니다.
    id는 글을 작성할 때 crypto.randomByte를 이용하여 생성되어 고유한 값을 가지게 됩니다.
    order는 표시되는 포스트잇의 순서(우선순위) 기능을 위한 속성입니다.
    endedWork는 완료된 작업을 체크하기 위한 속성입니다.
    나머지는 영어명과 동일한 표현을 직관적으로 담당합니다.
*/
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
/*
마감 기한이 지났는지를 확인하는 함수입니다.
 */
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
/*
    포스트를 섞는 함수입니다. 상단의 '섞기' 버튼과 연계되어 있습니다. 테스트용입니다.
 */
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
/*
    컴포넌트가 업데이트 되었을 때
    로컬 스토리지에 현재까지 작성한 포스트잇을 저장합니다.
 */
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.data[0] !== this.state.data[0]) {
            localStorage.datawithdate = JSON.stringify(this.state.data[0]);
        }
        if (prevState.data[1] !== this.state.data[1]) {
            localStorage.data = JSON.stringify(this.state.data[1]);
        }
    }
/*
    메모 작성 함수입니다.
    react-uppdate-addons를 이용하여 state를 업데이트합니다.
 */
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
    /*
        데이터를 집어넣는 테스트용 함수입니다.
        상단의 테스트 버튼과 연결되어있습니다.
     */
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
    /*
        드래그해서 우선순위를 만들어내는 함수입니다.
        각 PostIt의 데이터를 담당하는 객체 내부의 order 속성에 따라 포스트가 정렬되어 렌더링됩니다.
        따라서 저는 order 속성 값을 드래그를 통해 변경시켜준다면 순서대로 렌더링 할 수 있다고 생각하여 작업하였습니다.
        로직은 성공적이었지만, 렌더링이 의도한대로 진행되지는 않았습니다.
        결국 드래그를 한 후 새로고침을 해야 적용됩니다.
     */
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

    /*
        포스트잇을 모두 제거하는 함수입니다.
     */
    memoClear() {
        this.setState({
            data: [ [],[] ]
        });
    }
    ;
    /*
        포스트잇 수정을 위해 이용되는 함수입니다.
     */
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

    /*
        포스트잇 삭제를 위한 함수입니다.
     */
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
    /*
        '완료 표시'를 위한 함수입니다.
        각 포스트잇의 스위치는 PostIt 객체 내부의 endedWork와 연동되어 있습니다.
        따라서 완료된 작업들은 스위치가 켜진 상태이며, 또한 endedWork가 true로 적용되게 됩니다.
     */
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
