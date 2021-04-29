import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/test/';

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }

  getCandidatBoard() {
    return axios.get(API_URL + 'candidat', { headers: authHeader() });
  }

  getAdministratorBoard() {
    return axios.get(API_URL + 'administrator', { headers: authHeader() });
  }
}

export default new UserService();