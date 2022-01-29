// widgets.js

import { db } from "../../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// Actions
const LOAD = "word/LOAD";
const CREATE = "word/CREATE";
const DELETE = "word/DELETE";
const UPDATE = "word/UPDATE";
// const REMOVE = "my-app/widgets/REMOVE";

// 초기값
const initialState = {
  list: [
    {
      word: "newspaper",
      desc: "신문지",
      example: "He slapped the newspaper down on the desk.",
    },
  ],
};

// Action Creators

export function loadWord(word_list) {
  return { type: LOAD, word_list };
}

export const createWord = (word) => {
  return { type: CREATE, word };
};

export function updateWord(word_index, word) {
  return { type: UPDATE, word_index, word };
}

export function deleteWord(word_index) {
  console.log("지울 단어 인덱스", word_index);
  return { type: DELETE, word_index };
}

// middlewares : 파이어베이스랑 통신하는 함수
export const loadWordFB = () => {
  return async function (dispatch) {
    const word_data = await getDocs(collection(db, "dictionary"));
    console.log(word_data);

    let word_list = [];

    word_data.forEach((doc) => {
      console.log(doc.data());
      word_list.push({ id: doc.id, ...doc.data() });
    });

    console.log(word_list);

    dispatch(loadWord(word_list));
  };
};

export const addWordFB = (word) => {
  return async function (dispatch) {
    const docRef = await addDoc(collection(db, "dictionary"), word);
    // const _word = await getDoc(docRef);
    const word_data = { id: docRef.id, ...word };
    console.log(word_data);

    dispatch(createWord(word_data));
  };
};

export const updateWordFB = (word_id, word) => {
  return async function (dispatch, getState) {
    // 수정할 도큐먼트 가져오기
    const docRef = doc(db, "dictionary", word_id);
    // 수정하기
    await updateDoc(docRef, { id: word_id, ...word });
    //getState() 사용해서 스토어의 데이터를 가져올 수 있다.
    const _word_list = getState().word.list;
    const word_data = { id: docRef.id, ...word };
    //findIndex로 몇 번째에 있는 지 찾기!
    const word_index = _word_list.findIndex((b) => {
      //updateWordFB의 파라미터로 넘겨받은 아이디와 똑같은 아이디가 몇 번 째에 있는지 찾기
      return b.id === word_id;
    });
    dispatch(updateWord(word_index, word_data));
  };
};

export const deleteWordFB = (word_id) => {
  // getState 왜 받아오지?
  return async function (dispatch, getState) {
    if (!word_id) {
      window.alert("아이디가 없네요!");
      return;
    }
    const docRef = doc(db, "dictionary", word_id);
    await deleteDoc(docRef);

    const _word_list = getState().word.list;
    const word_index = _word_list.findIndex((b) => {
      return b.id === word_id;
    });

    dispatch(deleteWord(word_index));
  };
};

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    // do reducer stuff
    case "word/LOAD": {
      return { list: action.word_list };
    }

    case "word/CREATE": {
      const new_word_list = [...state.list, action.word];
      return { list: new_word_list };
    }

    case "word/UPDATE": {
      const new_word_list = [...state.list];
      return { list: new_word_list };
    }

    case "word/DELETE": {
      console.log(state, action);
      const new_word_list = state.list.filter((l, idx) => {
        console.log(
          action.word_list !== state.list[idx].id,
          action.word_index,
          state.list[idx].id
        );
        return action.word_index !== state.list[idx].id;
      });
      return { list: new_word_list };
    }

    default:
      return state;
  }
}

// export function loadWidgets() {
//   return { type: LOAD };
// }

// export function createWidget(widget) {
//   return { type: CREATE, widget };
// }

// export function updateWidget(widget) {
//   return { type: UPDATE, widget };
// }

// export function removeWidget(widget) {
//   return { type: REMOVE, widget };
// }

// // side effects, only as applicable
// // e.g. thunks, epics, etc
// export function getWidget() {
//   return (dispatch) =>
//     get("/widget").then((widget) => dispatch(updateWidget(widget)));
// }