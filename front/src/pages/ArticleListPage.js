import articles from "./article-content";
import ArticleList from "../components/ArticlesList";
const ArticleListPage = () => {
    return (
        <>
            <h1>Articles</h1>
            <ArticleList articles={articles} ></ArticleList>
        </>
    )
}
export default ArticleListPage;