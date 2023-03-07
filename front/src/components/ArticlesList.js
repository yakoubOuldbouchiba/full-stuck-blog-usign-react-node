import { Link } from "react-router-dom";
const ArticleList = ({articles}) => {
    return <>
        <section>
            {articles.map(article => {
                return <Link key={article.name} className="article-list-item" to={`${article.name}`}>
                    <article>
                        <h3>{article.name}</h3>
                        <p>{article.content[0].substring(0, 150)}... </p>
                    </article>
                </Link>
            })}
        </section>
    </>
}
export default ArticleList;