import axios from "axios";

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    validateStatus: s => {
        return s >= 200;
    }
});

API.interceptors.request.use(req => {
    const token = localStorage.getItem('token');
    if(token) {
        req.headers.authorization = 'Bearer ' + token;
    }
    return req;
})

export const CONFIGS = {
    API,
    isSignedIn: () => {
        try {
            JSON.parse(atob(localStorage.getItem('token').split('.')[1]));
            return true;
        } catch (err) {
            return false;
        }
    },
    getUsername: () => {
        try {
            return JSON.parse(atob(localStorage.getItem('token').split('.')[1])).email;
        } catch (err) {
            return "";
        }
    },
    signOut: () => {
        localStorage.removeItem('token');
    }
}