import axios from 'axios'

export default function builClient({ req }) {
    if (typeof window === 'undefined') {
        return axios.create({
            baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
            headers: req.headers
        });
    } else if (typeof window !== 'undefined') {
        return axios.create();
    }
    return {}
}