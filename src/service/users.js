import axios from 'axios';

class Users {
  static getUsers({ ...params }) {
    return axios.get(`https://randomuser.me/api/`, { params });
  }
}

export default Users;
