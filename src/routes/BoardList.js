import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Link, useNavigate, useParams} from 'react-router-dom';


const BoardList = () => {
    const navigate = useNavigate();

    const [boardList, setBoardList] = useState([]);
    const [pageList, setPageList] = useState([]);

    const [curPage, setCurPage] = useState(0); //현재 페이지 세팅
    const [prevBlock, setPrevBlock] = useState(0); //이전 페이지 블록
    const [nextBlock, setNextBlock] = useState(0); //다음 페이지 블록
    const [lastPage, setLastPage] = useState(0); //마지막 페이지

    const [search, setSearch] = useState({
        page: 1,
        sk: '',
        sv: '',
    });

    const getBoardList = async (stat) => {
        // 현재 페이지와 누른 페이지가 같으면 return
        if ((search.page === curPage) && (stat !== 'del')) {
            return;
        }

        const queryString = Object.entries(search).map((e) => e.join('=')).join('&');

        const resp = await (await axios.get('/board?' + queryString)).data; // 2) 게시글 목록 데이터에 할당

        setBoardList(resp.data); // 3) boardList 변수에 할당
        const pngn = resp.pagination;
        console.log(pngn);

        const { endPage, nextBlock, prevBlock, startPage, totalPageCnt } = pngn;
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

    const onClick = (event) => {
        let value = event.target.value;
        setSearch({
            ...search,
            page: value,
        });

        getBoardList();
    };

    const onChange = (event) => {
        const { value, name } = event.target; //event.target에서 name과 value만 가져오기
        setSearch({
            ...search,
            [name]: value,
        });
    };

    const onSearch = () => {
        //if (search.sk !== '' && search.sv !== '') {
            setSearch({
                ...search,
                page: 1,
            });
            setCurPage(0);
            getBoardList();
        //}
    };

    useEffect(() => {
        getBoardList(); // 1) 게시글 목록 조회 함수 호출
    }, [search]);

    const deleteBoard = async (idx) => {
        if (window.confirm('게시글을 삭제하시겠습니까?')) {
            await axios.delete(`/board/${idx}`).then((res) => {
                alert('삭제되었습니다.');
                //navigate('/board');
                getBoardList('del');
            });
        }
    };

    return (
        <div>
            <div>
                <select name="sk" onChange={onChange}>
                    <option value="">-선택-</option>
                    <option value="keyword">키워드</option>
                    <option value="syn1">동의어1</option>
                    <option value="syn2">동의어2</option>
                    <option value="syn3">동의어3</option>
                    <option value="syn4">동의어4</option>
                    <option value="createdBy">작성자</option>
                </select>
                <input className="searchText" type="text" name="sv" id="" onChange={onChange}/>
                <button onClick={onSearch}>검색</button>
                <button onClick={moveToWrite}>등록</button>
            </div>

            <div>
                <table>
                    <thead>
                    <tr>
                        <th className="idx">번호</th>
                        <th className="keyword">키워드</th>
                        <th className="syn1">SYN1</th>
                        <th className="syn2">SYN2</th>
                        <th className="syn3">SYN3</th>
                        <th className="syn4">SYN4</th>
                        <th className="code">분류</th>
                        <th className="confirm">확인여부</th>
                        <th className="createdBy">작성자</th>
                        <th className="createdAt">등록일</th>
                        <th>삭제</th>
                    </tr>
                    </thead>
                    <tbody>
                    {boardList.map((board, index) => (
                        <tr key={index}>
                            <td className="idx"><Link to={`/update/${board.idx}`}>{board.idx}</Link></td>
                            <td className="keyword"><Link to={`/update/${board.idx}`}>{board.keyword}</Link></td>
                            <td className="syn1">{board.syn1}</td>
                            <td className="syn2">{board.syn2}</td>
                            <td className="syn3">{board.syn3}</td>
                            <td className="syn4">{board.syn4}</td>
                            <td className="code">{board.code}</td>
                            <td className="confirm">{board.confirm}</td>
                            <td className="createdBy">{board.createdBy}</td>
                            <td className="createdAt">{board.createdAt}</td>
                            <td>
                                <button onClick={() => deleteBoard(board.idx)}>삭제</button>
                            </td>
                        </tr>


                    ))}
                    </tbody>
                </table>

            </div>
            <div>
                <button onClick={onClick} value={1}>
                    &lt;&lt;
                </button>
                <button onClick={onClick} value={prevBlock}>
                    &lt;
                </button>
                {pageList.map((page, index) => (
                    <button key={index} onClick={onClick} value={page}>
                        {page}
                    </button>
                ))}
                <button onClick={onClick} value={nextBlock}>
                    &gt;
                </button>
                <button onClick={onClick} value={lastPage}>
                    &gt;&gt;
                </button>
            </div>
        </div>
    );
};

export default BoardList;