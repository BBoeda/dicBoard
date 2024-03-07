/* BoardWrite.js */
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

const BoardWrite = () => {
    const navigate = useNavigate();

    const [board, setBoard] = useState({
        idx: 0, keyword: '', syn1: '', syn2: '', syn3: '', syn4: '', confirm: '', code: '', createdBy: '', createdAt: ''
    });

    const [tableCount, setTableCount] = useState(0);
    
    const {keyword, syn1, syn2, syn3, syn4, confirm, code, createdBy, createdAt} = board; //비구조화 할당

    const onChange = (event) => {
        const {value, name} = event.target; //event.target에서 name과 value만 가져오기
        setBoard({
            ...board, [name]: value,
        });
    };

    const addTableToDiv = () => {
        if (tables.length >= 4) {
            alert("테이블을 더이상 추가 할 수 없습니다.")
        } else {
            setTableCount(tableCount + 1);
        }

    };

    const tables = [];

    for (let i = 0; i < tableCount; i++) {
        tables.push(<Table key={i}/>);
    }

    function Table() {
        return (<div className="div-table-board-write">
                    <table className="table-board-write">
                    <thead className="thead-board-write">
                    <tr>
                        <th>필드명</th>
                        <th>필드값</th>
                    </tr>
                    </thead>
                    <tbody className="tbody-board-write">
                    <tr>
                        <th>키워드</th>
                        <td><input type="text" name="keyword" /></td>
                    </tr>
                    <tr>
                        <th>유의어1</th>
                        <td><input type="text" name="syn1"/></td>
                    </tr>
                    <tr>
                        <th>유의어2</th>
                        <td><input type="text" name="syn2"/></td>
                    </tr>
                    <tr>
                        <th>유의어3</th>
                        <td><input type="text" name="syn3"/></td>
                    </tr>
                    <tr>
                        <th>유의어4</th>
                        <td><input type="text" name="syn4"/></td>
                    </tr>
                    <tr>
                        <th>코드</th>
                        <td>
                            <select name="code">
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
                            <select name="confirm">
                                <option value={"Y"}>확인</option>
                                <option value={"N"}>미확인</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th>작성자</th>
                        <td><input type="text" name="createdBy" value={createdBy}/></td>
                    </tr>
                    </tbody>
                </table>
            </div>);
    }

    const saveBoard = async () => {
        await axios.post(`/board`, board).then((res) => {
            alert('등록되었습니다.');
            navigate('/board');
        });
    };

    const backToList = () => {
        navigate('/board');
    };




    return (<div className="div-all-board-write">
        <div>
            <button onClick={addTableToDiv}>테이블 추가</button>
        </div>

        <div className="div-board-write">
            <div className="div-table-board-write">
                <table className="table-board-write">
                    <thead className="thead-board-write">
                    <tr>
                        <th>필드명</th>
                        <th>필드값</th>
                    </tr>
                    </thead>
                    <tbody className="tbody-board-write">
                    <tr>
                        <th>키워드</th>
                        <td><input type="text" name="keyword" value={keyword} onChange={onChange}/></td>
                    </tr>
                    <tr>
                        <th>유의어1</th>
                        <td><input type="text" name="syn1" value={syn1} onChange={onChange}/></td>
                    </tr>
                    <tr>
                        <th>유의어2</th>
                        <td><input type="text" name="syn2" value={syn2} onChange={onChange}/></td>
                    </tr>
                    <tr>
                        <th>유의어3</th>
                        <td><input type="text" name="syn3" value={syn3} onChange={onChange}/></td>
                    </tr>
                    <tr>
                        <th>유의어4</th>
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
            {tables}
        </div>
        <hr/>
        <div className="div-board-write-buttons">
            <button className="board-write-button" onClick={saveBoard}>저장</button>
            <button className="board-write-button" onClick={backToList}>취소</button>
        </div>
    </div>);
};

export default BoardWrite;