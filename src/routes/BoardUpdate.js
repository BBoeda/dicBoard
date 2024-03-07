/* BoardUpdate.js */
import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';

const BoardUpdate = () => {
    const navigate = useNavigate();
    const {idx} = useParams(); // /update/:idx와 동일한 변수명으로 데이터를 꺼낼 수 있습니다.
    const [board, setBoard] = useState({
        keyword: '', syn1: '', syn2: '', syn3: '', syn4: '', confirm: '', code: '', createdBy: '', createdAt: ''
    });

    const {keyword, syn1, syn2, syn3, syn4, confirm, code, createdBy, createdAt} = board; //비구조화 할당

    const onChange = (event) => {
        const {value, name} = event.target; //event.target에서 name과 value만 가져오기
        setBoard({
            ...board, [name]: value,
        });
    };

    const getBoard = async () => {
        const resp = await (await axios.get(`/board/${idx}`)).data;
        setBoard(resp.data);
    };

    const updateBoard = async () => {
        await axios.patch(`/board`, board).then((res) => {
            alert('수정되었습니다.');
            //navigate('/board/' + idx);
            navigate('/board');
        });
    };

    const backToDetail = () => {
        //navigate('/board/' + idx);
        navigate('/board');
    };

    useEffect(() => {
        getBoard();
    }, []);

    return (<div>

        <div>
            <table>
                <thead>
                <tr>
                    <th>필드명</th>
                    <th>필드값</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th>번호</th>
                    <th>{idx}</th>
                </tr>
                <tr>
                    <th>키워드</th>
                    <th><input type="text" name="keyword" value={keyword} onChange={onChange}/></th>
                </tr>
                <tr>
                    <th>SYN1</th>
                    <td><input type="text" name="syn1" value={syn1} onChange={onChange}/></td>
                </tr>
                <tr>
                    <th>SYN2</th>
                    <td><input type="text" name="syn2" value={syn2} onChange={onChange}/></td>
                </tr>
                <tr>
                    <th>SYN3</th>
                    <td><input type="text" name="syn3" value={syn3} onChange={onChange}/></td>
                </tr>
                <tr>
                    <th>SYN4</th>
                    <td><input type="text" name="syn4" value={syn4} onChange={onChange}/></td>
                </tr>
                <tr>
                    <th>코드</th>
                    <td>
                        <select name="code" value={code} onChange={onChange}>
                            <option value={"생활"}>생활</option>
                            <option value={"교육"}>교육</option>
                            <option value={"군사"}>군사</option>
                            <option value={"금융"}>금융</option>
                            <option value={"관공서"}>관공서</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th>확인여부</th>
                    <td>
                        <select name="confirm" value={confirm} onChange={onChange}>
                            <option value={"Y"}>확인</option>
                            <option value={"N"}>미확인</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th>작성자</th>
                    <td><input type="text" name="createdBy" value={createdBy} onChange={onChange}/></td>
                </tr>
                </tbody>
            </table>
        </div>
        <br/>
        <div>
        <button onClick={updateBoard}>수정</button>
            <button onClick={backToDetail}>취소</button>
        </div>
    </div>);
};

export default BoardUpdate;