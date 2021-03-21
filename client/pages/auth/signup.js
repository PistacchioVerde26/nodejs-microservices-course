import { useState } from 'react'
import Router from 'next/router'

import useRequest from '../../hooks/useRequest'

export default function Signup() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [doRequest, errors] = useRequest({
        url: 'https://ticketing.dev/api/users/signup',
        method: 'post',
        body: { email, password },
        onSuccess: () => Router.push("/")
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        doRequest();
    }

    return (
        <form onSubmit={handleSubmit} className="p-3">
            <h1>Sign Up</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input type="email" className="form-control" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button className="btn btn-primary">Sign Up</button>
            {errors && errors}
        </form>
    )

}