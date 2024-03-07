/* Board.js */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Board = ({ idx, keyword, syn1, createdBy }) => {
    const navigate = useNavigate();

    const moveToUpdate = () => {
        navigate('/update/' + idx);
    };

    const deleteBoard = async () => {
        if (window.confirm('게시글을 삭제하시겠습니까?')) {
            await axios.delete(`/board/${idx}`).then((res) => {
                alert('삭제되었습니다.');
                navigate('/board');
            });
        }
    };

    const moveToList = () => {
        navigate('/board');
    };

    return (
        <div>
            <div>
                <h2>키워드: {keyword}</h2>
                <h5>작성자: {createdBy}</h5>
                <hr />
                <p>동의어: {syn1}</p>
            </div>
            <div>
                <button onClick={moveToUpdate}>수정</button>
                <button onClick={deleteBoard}>삭제</button>
                <button onClick={moveToList}>목록</button>
            </div>
        </div>
    );
};

export default Board;