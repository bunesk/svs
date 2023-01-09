import {ref} from 'vue';
import cookies from './cookies';
import sendRequest from './request';

export const tableColumns = {
  username: 'Benutzername',
  firstName: 'Vorname',
  lastName: 'Nachname',
  genderLabel: 'Geschlecht',
  email: 'E-Mail',
  role: 'Rolle',
};

export const genderOptions = [
  {name: 'Männlich', code: 'male'},
  {name: 'Weiblich', code: 'female'},
  {name: 'Divers', code: 'diverse'},
];

export const roleOptions = ['Student', 'Tutor', 'Admin'];

export const getUser = async () => {
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

export default ref(user);
