import {
  validateAmount,
  validateEmail,
  validateMatriculationNumber,
  validateName,
  validatePassword,
  validatePoints,
  validateUsername,
} from '../../../services/validators';

export const validate = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (event instanceof KeyboardEvent && !input.classList.contains('invalid-border')) {
    return;
  }
  const validationFunction = getValidationFunction(input.id);
  const help = document.getElementById(`${input.id}_help`) as HTMLElement;
  let validity = false;
  if (validationFunction) {
    try {
      validationFunction(input.value);
      validity = true;
      if (help) {
        help.textContent = '';
      }
    } catch (e: any) {
      if (help) {
        help.textContent = e.message;
      }
    }
  } else {
    validity = input.checkValidity();
    if (help) {
      if (validity) {
        help.textContent = '';
      } else {
        help.textContent = input.validationMessage;
      }
    }
  }
  if (!validity) {
    input.classList.add('invalid-border');
  } else {
    input.classList.remove('invalid-border');
  }
};

export const formIsValid = (form: HTMLFormElement | null): boolean => {
  if (!form?.checkValidity()) {
    return false;
  }
  const formElements = form?.elements as HTMLFormControlsCollection;
  if (formElements) {
    for (const formElement of Object.values(formElements)) {
      const validationFunction = getValidationFunction(formElement.id);
      if (validationFunction) {
        try {
          validationFunction((formElement as HTMLInputElement).value);
        } catch (e: any) {
          return false;
        }
      }
    }
  }
  return true;
};

export const handlePasswordInput = (event: InputEvent, password: string) => {
  if (!event || !event.target) {
    return password;
  }
  const input = event.target as HTMLInputElement;
  if (input) {
    return input.value;
  }
  return password;
};

const getValidationFunction = (id: string): Function | null => {
  switch (id) {
    case 'reg_username':
      return validateUsername;
    case 'reg_firstName':
    case 'reg_lastName':
    case 'reg_name':
      return validateName;
    case 'reg_amountTests':
    case 'reg_amountSheets':
      return validateAmount;
    case 'reg_pointsMax':
    case 'reg_pointsPassed':
      return validatePoints;
    case 'reg_matriculationNumber':
      return validateMatriculationNumber;
    case 'reg_email':
      return validateEmail;
    case 'reg_password':
    case 'profile_passwordNew':
      return validatePassword;
    case 'reg_passwordRepeat':
    case 'profile_passwordRepeat':
      return validatePasswordRepeat;
  }
  return null;
};

const validatePasswordRepeat = (value: string) => {
  const password = (document.getElementById('reg_password') ||
    document.getElementById('profile_passwordNew')) as HTMLInputElement;
  if (value !== password.value) {
    throw Error('Passwörter stimmen nicht überein.');
  }
};
