import {useState , useEffect} from "react";
import {  useNavigate, useParams } from "react-router-dom";
import articlesContent from "./article-content";
import NotFoundPage from "./NotFoundPage";
import axios from "axios";
import CommentsList from "../components/CommentsList";
import AddCommentsForm from "../components/AddCommentForm";
import useUser from "../hooks/useUser";
const ArticlePage = ()=>{
    
    const {user , isLoading} = useUser();
    const navigate = useNavigate();
    const [articleInfo , setArticleInfo] = useState({upvotes : 0, comments : [] , canUpvote : false});
    const {canUpvote} = articleInfo;
    const {articleID} = useParams();

    useEffect(()=>{
       (
        async ()=>{
            if(!isLoading){
                const token =user &&  await user.getIdToken();
                const headers = token ? {authtoken : token} : {};
                const response = await axios.get(`/api/articles/${articleID}`,{
                 headers
                });
                let newArticleInfo = response.data;
                setArticleInfo(newArticleInfo)
            }
        }
       )() 
    },[isLoading]);

    const addUpvote = async ()=>{
        const token =user &&  await user.getIdToken();
        const headers = token ? {authtoken : token} : {};
        const response = await axios.put(`/api/articles/${articleID}/upvote` , {} , {headers});
        const updateArticle = response.data;
        setArticleInfo(updateArticle);
    }

    
    const article = articlesContent.find(article=> article.name === articleID);
    if(!article){
        return <NotFoundPage />
    }
    return (
        <article>
            <div id="upvotes-section">
                <h1>{article.title}</h1>
                {user ? 
                    <button onClick={addUpvote}>{canUpvote ? 'Upvote' : 'Already upvoted'}</button> 
                    : <button onClick={()=>navigate('/login')}>Log in to upvote</button> }
            </div>
            <p>This article has {articleInfo.upvotes} upvote(s)</p>
            {article.content.map((paragraph , index)=>{
                return <p key={index}>{paragraph}</p>
            })}
            <CommentsList comments={articleInfo.comments}></CommentsList>
            {user ? 
                <AddCommentsForm articleName={articleID} onArticleUpdated={updateArticle => setArticleInfo(updateArticle)}></AddCommentsForm> :
                <button onClick={()=>navigate('/login')}>Log in to add a comment</button> 
            }
        </article>
    )
}
export default ArticlePage;