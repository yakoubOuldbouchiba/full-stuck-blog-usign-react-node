import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ArticleListPage from "./pages/ArticleListPage";
import Article from "./pages/ArticlePage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import NavBar from './NavBar';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar></NavBar>
        <div id='page-body'>
          <Routes>
            <Route index path='/' element={<HomePage/>} ></Route>
            <Route path='/about' element={<AboutPage />} ></Route>
            <Route path='/articles' element={<ArticleListPage />} ></Route>
            <Route path='/articles/:articleID' element={<Article />} ></Route>
            <Route path='/login' element={<LoginPage/>}></Route>
            <Route path='/create-account' element={<CreateAccountPage/>}></Route>
            <Route path='*' element={<NotFoundPage />} ></Route>
          </Routes>  
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
