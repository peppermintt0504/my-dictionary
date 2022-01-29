import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { createWord, updateWordFB, loadWordFB } from "./redux/modules/word";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button } from "@material-ui/core";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

const Update = (props) => {
  const { my_id } = useParams();
  let navigate = useNavigate();
  const inputRef = React.useRef([]);
  // useHistory 사용하는 것과 비슷하죠? :)
  const dispatch = useDispatch();
  const my_lists = useSelector((state) => state.word.list);
  const target_word = my_lists.filter((l) => l.id === my_id)[0];
  React.useEffect(() => {
    dispatch(loadWordFB());
  }, []);

  //   console.log(inputRef.current[0].value);

  const addBucketList = () => {
    // 스프레드 문법! 기억하고 계신가요? :)
    // 원본 배열 list에 새로운 요소를 추가해주었습니다.
    // 여긴 이제 주석처리!
    // setList([...list, text.current.value]);
    // let new_dic = {
    //   word: inputRef.current[0].value,
    //   desc: inputRef.current[1].value,
    //   example: inputRef.current[2].value,
    // };

    const new_dic = {
      word: inputRef.current[0].value,
      desc: inputRef.current[1].value,
      example: inputRef.current[2].value,
    };
    console.log(new_dic);
    // dispatch(createWord(new_dic));
    dispatch(updateWordFB(my_id, new_dic));
  };

  const theme = createTheme({
    palette: {
      secondary: {
        main: "#287a9f",
      },
    },
  });

  return (
    <div>
      <Title>단어 수정하기</Title>
      <Input>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="standard-basic"
            label="단어"
            variant="standard"
            inputRef={(el) => (inputRef.current[0] = el)}
            value={target_word.word}
          />
          <TextField
            id="standard-basic"
            label="설명"
            variant="standard"
            inputRef={(el) => (inputRef.current[1] = el)}
            value={target_word.desc}
          />
          <TextField
            id="standard-basic"
            label="예문"
            variant="standard"
            inputRef={(el) => (inputRef.current[2] = el)}
            value={target_word.example}
          />
        </Box>
        {/* <button
        onClick={() => {
          addBucketList();
          navigate("/");
        }}
      >
        추가하기
      </button> */}

        <Button
          variant="contained"
          onClick={() => {
            addBucketList();
            navigate("/");
          }}
          style={{ margin: "50px" }}
        >
          수정하기
        </Button>
      </Input>
    </div>
  );
};

const Title = styled.h1`
  text-align: center;
  color: grey;
  margin: 50px;
`;

const Input = styled.div`
  max-width: 350px;
  min-height: 10vh;
  background-color: #fff;
  padding: 80px 50px 80px 80px;
  margin: 20px auto;
  border-radius: 5px;
  border: 1px solid #ddd;
`;

export default Update;
