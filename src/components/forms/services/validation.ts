import {
  validateEmail,
  validateMatriculationNumber,
  validateName,
  validatePassword,
  validateUsername,
} from '../../../services/validators';

export const validate = (event: Event) => {
  let input = event.target as HTMLInputElement;
  if (
    event instanceof KeyboardEvent &&
    !input.classList.contains('invalid-border')
  ) {
    return;
  }
  let validationFunction: Function | null = null;
  switch (input.id) {
    case 'reg_username':
      validationFunction = validateUsername;
      break;
    case 'reg_firstName':
    case 'reg_lastName':
      validationFunction = validateName;
      break;
    case 'reg_matriculationNumber':
      validationFunction = validateMatriculationNumber;
      break;
    case 'reg_email':
      validationFunction = validateEmail;
      break;
    case 'reg_password':
      validationFunction = validatePassword;
      break;
    case 'reg_passwordRepeat':
      validationFunction = (value: string) => {
        const password = document.getElementById(
          'reg_password'
        ) as HTMLInputElement;
        if (value !== password.value) {
          throw Error('Passwörter stimmen nicht überein.');
        }
      };
  }
  const help = document.getElementById(`${input.id}_help`) as HTMLElement;
  let validity = false;
  if (validationFunction) {
    try {
      validationFunction(input.value);
      validity = true;
      help.textContent = '';
    } catch (e: any) {
      help.textContent = e.message;
    }
  } else {
    validity = input.checkValidity();
  }
  if (!validity) {
    input.classList.add('invalid-border');
  } else {
    input.classList.remove('invalid-border');
  }
};
