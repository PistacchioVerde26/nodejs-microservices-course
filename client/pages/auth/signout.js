import { useEffect, useState } from 'react'
import Router from 'next/router'

import useRequest from '../../hooks/useRequest'

export default function Signout() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [doRequest, errors] = useRequest({
        url: 'https://ticketing.dev/api/users/signout',
        method: 'post',
        body: {},
        onSuccess: () => Router.push("/")
    });

    useEffect(() => doRequest(), [])

    return (<h3>Signing out...</h3>)

}