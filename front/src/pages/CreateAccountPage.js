import { useState } from "react";
import {  Link , useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const CreateAccountPage = ()=>{

    const [email , setEmail] = useState('');
    const [password , setPassword] = useState('');
    const [confrimPass , setConfrimPass ] = useState('');
    const [error, setError] = useState ('');


    const navigate = useNavigate();

    const createAccount = async ()=>{
        try {
            if(password !== confrimPass){
                setError('Password and confrim pass do not match');
                return
            }else{
                await createUserWithEmailAndPassword(getAuth() , email , password);
                navigate('/articles');
            }
            
        } catch (error) {
            setError(error.message)
        }

    }

    return<div className="login">
        <h1>Create Account</h1>
        {error && <p className="error">{error}</p>}
        <input
            placeholder="Your email address" 
            value={email}
            onChange={e=>setEmail(e.target.value)}
        />
        <input 
            type="password"
            placeholder="Your password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            />

        <input 
            type="password"
            placeholder="Re-enter your password"
            value={confrimPass}
            onChange={e=>setConfrimPass(e.target.value)}
            />    

        <button onClick={createAccount}>Create Account</button>
        <Link className="create-account" to="/login">Already create an account? Log in here</Link>
    </div>
}
export default CreateAccountPage;