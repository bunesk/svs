import {reactive} from 'vue';
import cookies from './cookies';
import sendRequest from './request';

export const genderOptions = [
  {name: 'Männlich', code: 'male'},
  {name: 'Weiblich', code: 'female'},
  {name: 'Divers', code: 'diverse'},
];

export const getGenderLabel = (code: string): string => {
  for (const option of genderOptions) {
    if (option.code === code) {
      return option.name;
    }
  }
  return '';
};

export const getRole = (isAdmin: boolean, isTutor: boolean) => {
  if (isAdmin) {
    return 'Admin';
  }
  if (isTutor) {
    return 'Tutor';
  }
  return 'Student';
};

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
