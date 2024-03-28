import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {useLocation, useNavigate} from 'react-router-dom';
import {AppContext} from '../AppContext';

const BoardList = () => {
    const location = useLocation();
    //const key = location.state.key;
    const userInfo = {...location.state};
    const username = userInfo.username;
    //console.log('#############' + key, userInfo);
    const navigate = useNavigate();
    const [boardList, setBoardList] = useState([]);
    const [pageList, setPageList] = useState([]);

    const [curPage, setCurPage] = useState(0); //현재 페이지 세팅
    const [selPage, setSelPage] = useState(1);
    const [prevBlock, setPrevBlock] = useState(0); //이전 페이지 블록
    const [nextBlock, setNextBlock] = useState(0); //다음 페이지 블록
    const [lastPage, setLastPage] = useState(0); //마지막 페이지

    const [search, setSearch] = useState({
        page: 1, sk: '', sv: '',
    });

    const [tableData, setTableData] = useState([]);

    const [isLoggedIn, setIsLoggedIn] = useContext(AppContext);

    if (username !== '') {
        setIsLoggedIn(true);
    } else {
        setIsLoggedIn(false);
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            console.log('Enter key pressed!'); // 'Enter'키가 눌렸을 때 콘솔에 로그를 남깁니다.
            onSearch();
        }
    };

    const handleKeywordKeyDown = (id, event, keyword) => {
        switch (event.key) {
            case 'Tab':
                console.log('Tab key pressed!');
                hasDuplicates(id, event, keyword);
                break;
            default:
                break;
        }
    }

    const handleKeywordFocus = (id, event, keyword) => {
        console.log('Focused on element with id:', event.target.id);
        hasDuplicates(id, event, keyword);
    };

    const handleKeywordBlur = (id, event, keyword) => {
        console.log('Lost focus on element with id:', event.target.id);
        hasDuplicates(id, event, keyword);
    };
    const getBoardList = async (stat) => {
        // 현재 페이지와 누른 페이지가 같으면 return
        if ((search.page === curPage) && (stat !== 'del') && (stat !== 'init')) {
            return;
        }

        const queryString = Object.entries(search).map((e) => e.join('=')).join('&');

        const resp = await (await axios.get('/board?' + queryString)).data; // 2) 게시글 목록 데이터에 할당

        setBoardList(resp.data); // 3) boardList 변수에 할당
        const pngn = resp.pagination;
        console.log(pngn);

        const {endPage, nextBlock, prevBlock, startPage, totalPageCnt} = pngn;
        console.log(endPage);
        console.log(nextBlock);
        console.log(prevBlock);
        console.log(startPage);
        console.log(totalPageCnt);

        setCurPage(search.page);
        setPrevBlock(prevBlock);
        setNextBlock(nextBlock);
        setLastPage(totalPageCnt);

        const tmpPages = [];

        for (let i = startPage; i <= endPage; i++) {
            tmpPages.push(i);
        }

        setPageList(tmpPages);

    };

    const moveToWrite = () => {
        navigate('/write');
    };

    const goToUpdatePage = (boardIdx) => {
        navigate(`/update/${boardIdx}`, {
            state: {
                username: username
            },
        });
    };

    const onClick = (event) => {
        let value = event.target.value;
        setSearch({
            ...search, page: value,
        });

        setSelPage(parseInt(value));

        getBoardList();
    };

    const onChange = (event) => {
        const {value, name} = event.target; //event.target에서 name과 value만 가져오기
        setSearch({
            ...search, [name]: value,
        });
    };

    const onSearch = () => {
        if (search.sk === '' && search.sv !== '') {
            alert('검색 조건을 선택 해주세요.')
        } else {
            initRow();
            setSearch({
                ...search, page: 1,
            });
            setCurPage(0);

            getBoardList();
        }
    };


    useEffect(() => {
        getBoardList(); // 1) 게시글 목록 조회 함수 호출
    }, [search]);

    /**
     * Saves the board data to the server.
     *
     * @async
     * @function saveBoard
     * @returns {Promise<void>} A promise that resolves when the board data is saved.
     */
    const saveBoard = async () => {
        if (tableData.length === 0 || tableData === null) {
            alert('입력 값이 없습니다.');
        } else {
            if (window.confirm('게시글을 등록 하시겠습니까?')) {
                await axios.post(`/boardlist`, tableData).then((res) => {
                    alert('등록 되었습니다.');
                    getBoardList('init');
                    initRow();
                });
            }
        }
    };
    /**
     * Deletes a board with the given index.
     *
     * @param {number} idx - The index of the board to delete.
     * @returns {Promise} - A promise that resolves when the board is deleted.
     */
    const deleteBoard = async (idx) => {
        if (window.confirm('게시글을 삭제 하시겠습니까?')) {
            await axios.delete(`/board/${idx}`).then((res) => {
                //alert('삭제되었습니다.');
                //navigate('/board');
                getBoardList('del');
            });
        }
    };

    const getWordDataAPI = async (idx) => {
        //idx 값이 1부터 시작한다.... 왜지??? 이부분은 알아 보자....
        let keyword = tableData[idx - 1].keyword;
        if (keyword !== '' && keyword !== null && keyword !== undefined) {
            await axios.get(`/getApiData/${keyword}`).then((res) => {

            });
        }
    };

    const handleChange = (id, event) => {
        const newData = tableData.map((item) => {

            if (id !== item.id) {
                return item;
            }

            const {value, name} = event.target;

            return {...item, [name]: value};
        });

        setTableData(newData);

        console.log(newData);
    };

    const addRow = () => {
        const newRow = {code: 'CODE1', confirm: 'Y', createdBy: username, id: tableData.length + 1};
        setTableData([...tableData, newRow]);
    };
    // id를 기반으로 특정 행을 삭제하는 함수
    const deleteRow = () => {
        if (tableData.length === 0) {
            alert('삭제 할 행이 없습니다.');
        } else {
            const updatedTableData = tableData.filter((row) => row.id !== tableData.length);
            setTableData(updatedTableData);
        }
    };

    /**
     * Initializes the row of a table.
     * @function initRow
     * @returns {void}
     */
    const initRow = () => {
        const initTableData = [];
        setTableData(initTableData);
    };
    /**
     * Checks whether a given keyword has duplicates.
     *
     * @param {string} id - The ID of the item to be checked.
     * @param {string} event - The event associated with the item.
     * @param {string} keyword - The keyword to check for duplicates.
     */
    const hasDuplicates = (id, event, keyword) => {
        if (keyword !== '' && keyword !== undefined) {
            fetch(`/duplicates/${keyword}`).then(response => response.json()).then(data => {
                if (data.description === 'Duplicate') {
                    //중복일 경우 전체를 돌려서 해당 아이디와 같은 부분을 확인 해야 함
                    setTableData(tableData.map((item) => {
                        if (item.id === id) {
                            return {...item, isDuplicate: true};
                        } else {
                            return item;
                        }
                    }));
                } else {
                    setTableData(tableData.map((item) => {
                        if (item.id === id) {
                            return {...item, isDuplicate: false};
                        } else {
                            return item;
                        }
                    }));
                }
            });
        }
    }

    const handleDoubleClick = (id) => {
        setBoardList(boardList.map((board) => board.idx === id ? {...board, isEditing: true} : board));
    };

    const handleBlur = (id) => {
        setBoardList(boardList.map((board) => board.idx === id ? {...board, isEditing: false} : board));
    };

    console.log(username);
    return (<div>

        <div>
            <select className="searchSelect" name="sk" onChange={onChange}>
                <option value="">선택</option>
                <option value="keyword">키워드</option>
                <option value="syn1">동의어1</option>
                <option value="syn2">동의어2</option>
                <option value="syn3">동의어3</option>
                <option value="syn4">동의어4</option>
                <option value="createdBy">작성자</option>
            </select>
            <input className="searchText" type="text" name="sv" id="" onChange={onChange} onKeyPress={handleKeyPress}/>
            <button className={"board-list-button search"} onClick={onSearch}>검색</button>
            {/*<button onClick={moveToWrite}>등록</button>*/}
            <button className={"board-list-button delRow"} onClick={() => deleteRow()}>행 삭제</button>
            <button className={"board-list-button addRow"} onClick={addRow}>행 추가</button>
            <button className={"board-list-button saveBorad"} onClick={saveBoard}>저장</button>
            <p className={"login-p"}>로그인 사용자 : {username}</p>
        </div>

        <div className={"div-table-board-list"}>
            <table className={"table-board-list"}>
                <thead className={"thead-board-list"}>
                <tr>
                    <th className="idx">번호</th>
                    <th className="keyword">키워드</th>
                    <th className="syn1">동의어</th>
                    <th className="syn2">SYN2</th>
                    <th className="syn3">SYN3</th>
                    <th className="syn4">SYN4</th>
                    <th className="code">분류</th>
                    <th className="confirm">확인</th>
                    <th className="createdBy">작성자</th>
                    <th className="createdAt">등록일</th>
                    <th className="datadelete">옵션</th>
                </tr>
                </thead>
                <tbody className={"tbody-board-list"}>
                {tableData.map((row, index) => (<tr key={row.id}>
                    <td>
                        {/*<input
                            type="text"
                            name="idx"
                            value={row.idx}
                            onChange={(event) => handleChange(row.id, event)}
                            disabled/>*/}
                    </td>
                    <td>
                        <input
                            type="text"
                            name="keyword"
                            value={row.keyword}
                            onChange={(event) => handleChange(row.id, event)}
                            //onKeyDown={(event) => handleKeywordKeyDown(row.id, event, row.keyword)}
                            //onFocus={(event) => handleKeywordFocus(row.id, event, row.keyword)}
                            //onBlur={(event) => handleKeywordBlur(row.id, event, row.keyword)}
                            //onClick={(event) => handleKeywordClick(row.id, event, row.keyword)}
                            style={{color: row.isDuplicate ? 'red' : 'initial', fontWeight: row.isDuplicate ? 'bold' : 'normal'}}
                        />
                    </td>
                    <td>
                        <input
                            type="text"
                            name="syn1"
                            value={row.syn1}
                            onChange={(event) => handleChange(row.id, event)}
                            onKeyDown={(event) => handleKeywordKeyDown(row.id, event, row.keyword)}
                        />
                    </td>
                    <td>
                        <input
                            type="text" disabled
                            name="syn2"
                            value={row.syn2}
                            onChange={(event) => handleChange(row.id, event)}
                        />
                    </td>
                    <td>
                        <input
                            type="text" disabled
                            name="syn3"
                            value={row.syn3}
                            onChange={(event) => handleChange(row.id, event)}
                        />
                    </td>
                    <td>
                        <input
                            type="text" disabled
                            name="syn4"
                            value={row.syn4}
                            onChange={(event) => handleChange(row.id, event)}
                        />
                    </td>
                    <td>
                        <select name="code" onChange={(event) => handleChange(row.id, event)} disabled>
                            <option value={"CODE1"}>CODE1</option>
                            <option value={"CODE2"}>CODE2</option>
                            <option value={"CODE3"}>CODE3</option>
                            <option value={"CODE4"}>CODE4</option>
                        </select>
                    </td>
                    <td>
                        <select name="confirm" value={row.confirm} disabled
                                onChange={(event) => handleChange(row.id, event)}>
                            <option value={"Y"}>확인</option>
                            <option value={"N"}>미확인</option>
                        </select>
                    </td>
                    <td>
                        <input
                            type="text" disabled
                            name="createdBy"
                            value={row.createdBy}
                            onChange={(event) => handleChange(row.id, event)}
                        />
                    </td>
                    <td>
                        {/*<input
                            type="text"
                            name="createdAt"
                            value={row.createdAt}
                            onChange={(event) => handleChange(row.id, event)}
                            disabled
                        />*/}
                    </td>
                    <td className="option">
                        {/*<button className={"board-list-button-getDataInfoAPI"} onClick={() => getWordDataAPI(row.id)}>API 분석</button>*/}
                    </td>
                </tr>))}
                {boardList.map((board, index) => (<tr onDoubleClick={() => handleDoubleClick(board.idx)} onBlur={() => handleBlur(board.idx)} key={index}>
                    {board.isEditing ? (<>
                        <td className="idx">{board.idx}</td>
                        <td className="keyword"><input type='text' defaultValue={board.keyword}/></td>
                        <td className="syn1"><input type='text' defaultValue={board.syn1}/></td>
                        <td className="syn2"><input type='text' defaultValue={board.syn2}/></td>
                        <td className="syn3"><input type='text' defaultValue={board.syn3}/></td>
                        <td className="syn4"><input type='text' defaultValue={board.syn4}/></td>
                        <td className="code"><input type='text' defaultValue={board.code}/></td>
                        <td className="confirm"><input type='text' defaultValue={board.confirm}/></td>
                        <td className="createdBy"><input type='text' defaultValue={board.createdBy}/></td>
                        <td className="createdAt"><input type='text' defaultValue={board.createdAt}/></td>
                    </>) : (<>
                        {/*<td className="idx"><Link to={`/update/${board.idx}`} className="board-link">{board.idx}</Link></td>*/}
                        <td className="idx">
                            {board.idx}
                        </td>
                        {/*<td className="keyword"><Link to={`/update/${board.idx}`} className="board-link">{board.keyword}</Link></td>*/}
                        <td className="keyword" onClick={() => goToUpdatePage(board.idx)}>
                            {board.keyword}
                        </td>
                        <td className="syn1">{board.syn1}</td>
                        <td className="syn2">{board.syn2}</td>
                        <td className="syn3">{board.syn3}</td>
                        <td className="syn4">{board.syn4}</td>
                        <td className="code">{board.code}</td>
                        <td className="confirm">{board.confirm}</td>
                        <td className="createdBy">{board.createdBy}</td>
                        <td className="createdAt">{board.createdAt}</td>
                    </>)}

                    <td className="option">
                        <button className={"board-list-button-dataDeleteBoard"}
                                onClick={() => deleteBoard(board.idx)}>삭제
                        </button>
                    </td>

                    {/*<td className="idx"><Link to={`/update/${board.idx}`} className="board-link">{board.idx}</Link></td>
                        <td className="keyword"><Link to={`/update/${board.idx}`} className="board-link">{board.keyword}</Link></td>
                        <td className="syn1">{board.syn1}</td>
                        <td className="syn2">{board.syn2}</td>
                        <td className="syn3">{board.syn3}</td>
                        <td className="syn4">{board.syn4}</td>
                        <td className="code">{board.code}</td>
                        <td className="confirm">{board.confirm}</td>
                        <td className="createdBy">{board.createdBy}</td>
                        <td className="createdAt">{board.createdAt}</td>
                        <td className="option">
                            <button className={"board-list-button-dataDeleteBoard"}
                                    onClick={() => deleteBoard(board.idx)}>삭제
                            </button>
                        </td>*/}
                </tr>))}
                </tbody>
            </table>

        </div>

        <div className="page_wrap">
            <div className="page_nation">
                <button className="arrow pprev" onClick={onClick} value={1}>

                </button>
                <button className="arrow prev" onClick={onClick} value={prevBlock}>

                </button>
                {pageList.map((page, index) => (<button style={{backgroundColor: selPage === page ? '#F38A23FF' : 'initial'}} key={index} onClick={onClick} value={page}>
                    {page}
                </button>))}
                <button className="arrow next" onClick={onClick} value={nextBlock}>

                </button>
                <button className="arrow nnext" onClick={onClick} value={lastPage}>

                </button>
            </div>
        </div>
    </div>);
};

export default BoardList;