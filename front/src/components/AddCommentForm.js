import axios from "axios";
import { useState } from "react";
import useUser from "../hooks/useUser";

const AddCommentsForm = ({articleName , onArticleUpdated})=>{
    const {user} = useUser();
    const[commentText , setCommentText] = useState('');
    const addComment = async () =>{
        const token =user &&  await user.getIdToken();
        const headers = token ? {authtoken : token} : {};
        const response = await axios.post(`/api/articles/${articleName}/comments` , {
            text : commentText
        },{headers});

        const updatedArticle = response.data;
        onArticleUpdated(updatedArticle);
        setCommentText('');
    }

    return <div id="add-comment-form">
        <h3>Add a Comment</h3>
        {user && <p>Your are posting as {user.email} </p>}
        <textarea rows="4" 
                      cols="50"
                      value={commentText}
                      onChange={e=>setCommentText(e.target.value)} />
        <button  onClick={addComment}>Add Comment</button>
    </div>
}
export default AddCommentsForm;