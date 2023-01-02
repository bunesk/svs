import {reactive} from 'vue';
import cookies from './cookies';
import sendRequest from './request';

export const genderOptions = [
  {name: 'Männlich', code: 'male'},
  {name: 'Weiblich', code: 'female'},
  {name: 'Divers', code: 'diverse'},
];

const getUser = async () => {
  const jwtToken = cookies.get('auth');
  if (!jwtToken) {
    return null;
  }
  const response = await sendRequest('user', 'get-data');
  const resData = await response.json();
  if (response.status === 200) {
    return resData.result;
  } else if (response.status === 401 || response.status === 404) {
    cookies.remove('auth');
  }
  return null;
};

const user = await getUser();

export default reactive(user);
