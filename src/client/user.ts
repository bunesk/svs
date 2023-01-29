import {Ref, ref} from 'vue';
import cookies from './cookies';
import sendRequest from './request';

/**
 * Columns for user tables as object where the key
 * is the attribute name and the value is the label
 */
export const tableColumns: any = {
  username: 'Benutzername',
  firstName: 'Vorname',
  lastName: 'Nachname',
  genderLabel: 'Geschlecht',
  email: 'E-Mail',
  role: 'Rolle',
};

/**
 * Gender select options
 */
export const genderOptions = [
  {name: 'Männlich', code: 'male'},
  {name: 'Weiblich', code: 'female'},
  {name: 'Divers', code: 'diverse'},
];

/** role option labels */
export const roleOptions = ['Student', 'Tutor', 'Admin'];

let resolveUserIsSet: Function;
/** if user is set promise */
export const userIsSet = new Promise((resolve) => (resolveUserIsSet = resolve));

/** authenticated user */
const user: Ref<any> = ref(null);

/**
 * Returns the currently authenticated user by checking the
 * jwt token cookie or null if unset.
 *
 * @returns user if authenticated
 */
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

const setUser = async () => {
  user.value = await getUser();
  resolveUserIsSet();
};
setUser();

export default user;
