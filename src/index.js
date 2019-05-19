import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { App } from './containers';
import { createBrowserHistory } from 'history'
import { Router, Route } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
// Redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';

const history = createBrowserHistory();

const store = createStore(reducers, applyMiddleware(thunk));
/*
    Provider는 프로젝트 Redux를 적용하려고 했던 흔적이고
    Router는 Express.js까지 연계하여 라우터로 페이지를 나누고 뒷단과 회원기능을 구현하려 했던 흔적입니다.
    두 기능 모두 학습 시간상 제시간에 구현하지 못할 것 같아 가능한 부분만 적용이 되었습니다.
 */
ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App} />
        </Router>
    </Provider>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
