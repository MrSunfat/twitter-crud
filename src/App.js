import { useState, useEffect } from 'react';
import axios from 'axios';
import TagContent from './components/TagContent';
import './App.css';

function App() {
    const url = 'http://localhost:5000/contents';
    const initContent = {
        id: 0,
        author: '',
        tagname: '@Anonymous', // @ + tu dau trong author
        description: '',
        date_time: '', // check tg luc submit
        heart: false,
    };

    const [contents, setContents] = useState([]); // contents => render
    const [newContent, setNewContent] = useState(initContent); // luu newContent dc them
    const [idContentNeedEdit, setIdContentNeedEdit] = useState(-1); //luu id cua content can edit
    const [updateMode, setUpdateMode] = useState(false);
    const authorInput = document.querySelector('input[name="author"]');
    const desInput = document.querySelector('input[name="description"]');

    // Doc APIs
    const readData = async () => {
        try {
            const response = await axios.get(url);
            // console.log(response);
            setContents([...response.data]);
        } catch (error) {
            throw new Error('Link not found!!');
        }
    };

    useEffect(() => {
        // doc API
        readData();
    }, []);

    const findDateTime = () => {
        const monthText = {
            1: 'Jan',
            2: 'Feb',
            3: 'Mar',
            4: 'Apr',
            5: 'May',
            6: 'Jun',
            7: 'Jul',
            8: 'Aug',
            9: 'Sep',
            10: 'Oct',
            11: 'Nov',
            12: 'Dec',
        };
        const currentTime = new Date();
        let res = '';
        let hours = currentTime.getHours(),
            month = currentTime.getMonth() + 1,
            minutes = currentTime.getMinutes();
        let showMinutes = minutes < 10 ? `0${minutes}` : minutes;
        let hours_minutes =
            hours <= 12
                ? hours + ':' + showMinutes + ' am'
                : hours - 12 + ':' + showMinutes + ' pm';

        res +=
            monthText[month] +
            ' ' +
            currentTime.getDate() +
            ', ' +
            currentTime.getFullYear() +
            ' ' +
            hours_minutes;
        return res;
    };

    const handleChange = (e) => {
        // console.log(e.target);
        const { name, value, type } = e.target;
        if (type === 'text') {
            setNewContent({
                ...newContent,
                [name]: value,
                date_time: findDateTime(),
            });
        } else if (type === 'radio') {
            setNewContent({
                ...newContent,
                [name]: value === 'yes' ? true : false,
                date_time: findDateTime(),
            });
        }
    };

    let currentArr = [...contents];
    // Them API moi
    const addNewContent = (content) => {
        axios.post(url, content).then((res) => {
            currentArr.push({ ...res.data });
            setContents(currentArr);
        });
        // lam sach newContent
        setNewContent(initContent);
    };

    // Sua 1 API = id
    const updateContent = (id, content) => {
        axios.put(`${url}/${id}`, content).then((res) => {
            let i = currentArr.findIndex((ele) => ele.id === id);
            if (i === -1) return;

            currentArr.splice(i, 1, { ...content });
            setContents(currentArr);
        });
        setNewContent(initContent);
    };

    // Xoa 1 API = id
    const deleteContent = (id) => {
        axios
            .delete(`${url}/${id}`)
            .then((res) => {
                setContents(currentArr.filter((ele) => ele.id !== id));
                // console.log(currentArr);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        addNewContent(newContent);

        // console.log(newContent);
    };

    const giveHeart = (id) => {
        let i = currentArr.findIndex((ele) => ele.id === id);

        if (i === -1) return;

        // Tha/Thu heart tren APIs
        currentArr[i].heart = !currentArr[i].heart;
        updateContent(id, currentArr[i]);
        // update contents moi
        setContents(currentArr);
    };

    // submit sau khi sua cac info ve content
    const putEditContent = (e) => {
        e.preventDefault();
        // put content sau edit len API
        updateContent(idContentNeedEdit, newContent);
        // dua cac thu dung xong => ve mac dinh
        setUpdateMode(false);
        setIdContentNeedEdit(-1);
    };

    // nhan vao icon pen => hien info
    const editContentMethod = (content) => {
        // console.log(content);
        authorInput.value = content.author;
        desInput.value = content.description;
        setIdContentNeedEdit(content.id);
        setNewContent(content);
        setUpdateMode(true);
    };

    const { author, description, heart } = newContent;

    return (
        <div className="App">
            <div className="createContent">
                <h3>{updateMode ? 'Edit Content:' : 'Add Content: '}</h3>
                <form onSubmit={!updateMode ? onSubmit : putEditContent}>
                    <div>
                        <label htmlFor="author">Full Name</label>
                        <input
                            type="text"
                            id="author"
                            name="author"
                            placeholder="Full Name"
                            value={author}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="description">Comment</label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            placeholder="Description"
                            value={description}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <p>Do you like your comment ?</p>
                        <div>
                            <input
                                type="radio"
                                id="yes"
                                name="heart"
                                value="yes"
                                onChange={handleChange}
                                checked={heart === true}
                            />
                            <label htmlFor="yes">Yes</label>
                            <div />
                            <div>
                                <input
                                    type="radio"
                                    id="no"
                                    name="heart"
                                    value="no"
                                    onChange={handleChange}
                                    checked={heart === false}
                                />
                                <label htmlFor="no">No</label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button>{updateMode ? 'Edit' : 'Submit'}</button>
                    </div>
                </form>
            </div>
            <ul>
                {contents.map((content) => (
                    <TagContent
                        key={content.id}
                        content={content}
                        deleteMethod={() => deleteContent(content.id)}
                        giveHeart={() => giveHeart(content.id, content)}
                        editContent={() => editContentMethod(content)}
                    />
                ))}
            </ul>
        </div>
    );
}

export default App;
