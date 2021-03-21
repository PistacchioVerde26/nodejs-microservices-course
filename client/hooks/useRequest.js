import axios from 'axios'
import { useState } from 'react'

export default function useRequest({ url, method, body, onSuccess }) {

    const [errors, setErrors] = useState(null);

    const doRequest = async () => {
        try {
            const res = await axios[method](url, body);
            setErrors(null);
            if (onSuccess) onSuccess(res.data);
            return res.data;
        } catch (e) {
            setErrors(
                <div className="alert alert-danger mt-3">
                    <h4>Ooops....</h4>
                    <ul className="my-0">
                        {e.response.data.errors.map((err, idx) => <li key={idx}>{err.message}</li>)}
                    </ul>
                </div>
            );
        }
    }

    return [doRequest, errors]
}