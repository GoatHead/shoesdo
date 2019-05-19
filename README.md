### 설치 및 빌드 방법

>git clone https://github.com/GoatHead/shoesdo

깃허브에서 프로젝트 코드를 clone 해옵니다.

>cd shoesdo

clone한 폴더로 접근합니다.

>npm install

해당 앱 실행에 필요한 패키지를 설치합니다.

>npm start

웹 애플리케이션을 배포합니다. 80번 포트로 실행됩니다. 따라서 http://localhost:80으로 접근이 가능합니다.

### 기능 요구 사항

| 요구사항                                           | 비고         |
| -------------------------------------------------- | ------------ |
| 새로운 TODO(제목과 내용)을 작성할 수 있다.         | 구현 성공    |
| TODO 목록을 볼 수 있다.                            | 구현 성공    |
| TODO 항목의 제목과 내용을 수정할 수 있다.          | 구현 성공    |
| TODO 항목을 삭제할 수 있다.                        | 구현 성공    |
| 사용자 선택에 의해 TODO 마감 기한을 넣을 수 있다.  | 구현 성공    |
| TODO 항목의 우선순위를 설정 및 조절할 수 있다.     | 구현 성공[1] |
| TODO 항목에 대한 완료 처리를 할 수 있다.           | 구현 성공[2] |
| 마감기한이 지난 TODO에 대해 알림을 노출할 수 있다. | 구현 성공[3] |

[1] 정렬 로직은 구현이 되었으나(TODO를 드래그해서 정렬하는 형태) 렌더링이 제대로 이루어지지 않아 새로고침을 해야 TODO가 다시 정렬되어 보입니다.

[2] 스위치를 이용하여 작업을 끝낸 TODO를 구분할 수 있습니다.

[3] 왼쪽 상단의 알림 버튼을 누르면 마감된 TODO가 어떤 것이 있는지 알림창이 나타납니다.

### 성능 요구사항

| 요구사항                                                 | 비고            |
| -------------------------------------------------------- | --------------- |
| TODO 이용 시 발생하는 오류 사항을 최소화한다.            | -               |
| 오류 발생시 사용자가 이해하기 쉽게 표시한다.             | 알림창으로 표시 |
| 다른 사람이 읽기 쉬운 코드를 작성한다.                   | -               |
| HTML/CSS에서 사용할 수 있는 최신 구조와 기술을 사용한다. | 리액트로 구현   |



### 인터페이스 요구사항
| 요구사항                                                  | 비고                 |
| --------------------------------------------------------- | -------------------- |
| 객관적이고 의미 전달이 명확한 화면을 사용자에게 제공한다. | 마테리얼 디자인 이용 |

상단의 버튼은 이해하기 쉬운 디자인으로 구현되어있습니다.
왼쪽부터 알람/테스트용 버튼 2개/글쓰기/포스트 전체 삭제 버튼입니다.

### 배포된 주소

> http://61.84.24.251:50080/

현재 해당 주소에 배포되었습니다.
