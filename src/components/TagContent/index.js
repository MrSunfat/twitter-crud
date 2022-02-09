import {
    AiOutlineUser,
    AiFillEdit,
    AiTwotoneDelete,
    AiOutlineHeart,
    AiFillHeart,
    AiOutlineMessage,
} from 'react-icons/ai';
import './TagContent.css';
function TagContent({ content, deleteMethod, giveHeart, editContent }) {
    return (
        <div className="tagContent">
            <div className="headerTagContent">
                <button className="btn_no_default user">
                    <AiOutlineUser />
                </button>
                <h1 className="author">{content.author}</h1>
                <h2 className="tagname">{content.tagname}</h2>
            </div>
            <span>{content.description}</span>
            <div className="footerTagCont">
                <div className="edit_delete">
                    <button 
                        className="btn_no_default edit"
                        onClick={editContent}
                    >
                        <AiFillEdit />
                    </button>
                    <button 
                        className="btn_no_default delete"
                        onClick={deleteMethod}
                    >
                        <AiTwotoneDelete />
                    </button>
                </div>
                <div className="status">
                    <button 
                        className="btn_no_default message"
                        
                    >
                        <AiOutlineMessage />
                    </button>
                    <button 
                        className="btn_no_default heart"
                        onClick={giveHeart}
                    >
                        {!content.heart ? (
                            <AiOutlineHeart />
                        ) : (
                            <AiFillHeart style={{ color: 'red' }} />
                        )}
                    </button>
                </div>
                <h2 className="date_time">{content.date_time}</h2>
            </div>
        </div>
    );
}

export default TagContent;
