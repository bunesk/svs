const IS_USERNAME_REGEX = /^[a-z][.][a-z]/;
const HAS_ONLY_LETTERS_AND_SPACES_REGEX =
  /^[A-Za-z\sÆÐƎƏƐƔĲŊŒẞÞǷȜæðǝəɛɣĳŋœĸſßþƿȝĄƁÇĐƊĘĦĮƘŁØƠŞȘŢȚŦŲƯY̨Ƴąɓçđɗęħįƙłøơşșţțŧųưy̨ƴÁÀÂÄǍĂĀÃÅǺĄÆǼǢƁĆĊĈČÇĎḌĐƊÐÉÈĖÊËĚĔĒĘẸƎƏƐĠĜǦĞĢƔáàâäǎăāãåǻąæǽǣɓćċĉčçďḍđɗðéèėêëěĕēęẹǝəɛġĝǧğģɣĤḤĦIÍÌİÎÏǏĬĪĨĮỊĲĴĶƘĹĻŁĽĿʼNŃN̈ŇÑŅŊÓÒÔÖǑŎŌÕŐỌØǾƠŒĥḥħıíìiîïǐĭīĩįịĳĵķƙĸĺļłľŀŉńn̈ňñņŋóòôöǒŏōõőọøǿơœŔŘŖŚŜŠŞȘṢẞŤŢṬŦÞÚÙÛÜǓŬŪŨŰŮŲỤƯẂẀŴẄǷÝỲŶŸȲỸƳŹŻŽẒŕřŗſśŝšşșṣßťţṭŧþúùûüǔŭūũűůųụưẃẁŵẅƿýỳŷÿȳỹƴźżžẓ]*$/;
const IS_EMAIL_REGEX =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const IS_SECURE_PASSWORD_REGEX = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}/;

/**
 * Checks if the passed name is a valid username, i.e. 'm.mueller'.
 *
 * @param name name to check
 * @returns is valid username
 */
export const validateUsername = (name: string) => {
  if (!IS_USERNAME_REGEX.test(name)) {
    throw Error('Der Benutzername muss dem Schema "m.mueller" folgen und darf keine Umlaute o.ä. enthalten.');
  }
};

/**
 * Checks if the passed name is a valid first or last name by only containing letters and spaces.
 *
 * @param name name to check
 * @returns is valid name
 */
export const validateName = (name: string) => {
  if (name.length < 2) {
    throw Error('Vor- und Nachname müssen jeweils mindestens zwei Zeichen lang sein.');
  }
  if (!HAS_ONLY_LETTERS_AND_SPACES_REGEX.test(name)) {
    throw Error('Vor- und Nachname dürfen nur Buchstaben und Leerzeichen enthalten.');
  }
};

/**
 * Checks if the passed number is a valid matriculation number by being 7 digits long.
 *
 * @param number number to check
 * @returns is valid matriculation number
 */
export const validateMatriculationNumber = (number: string) => {
  if (number.length !== 7) {
    throw Error('Matrikelnummer muss 7 Zeichen lang sein.');
  }
  if (!/^[0-9]*$/.test(number)) {
    throw Error('Matrikelnummer darf nur eine Ganzzahl sein.');
  }
};

/**
 * Checks if the passed string is a valid email address.
 *
 * @param email string to check
 * @returns is valid email
 */
export const validateEmail = (email: string) => {
  if (!IS_EMAIL_REGEX.test(email)) {
    throw Error('Die E-Mail-Adresse ist ungültig.');
  }
};

/**
 * Checks if the passed password is secure.
 *
 * A secure password requires:
 * - at least 8 characters
 * - at least one lower case letter (a-z)
 * - at least one upper case letter (A-Z)
 * - at least one number (0-9)
 * - at least one symbol
 *
 * @param password string to check
 * @returns is secure password
 */
export const validatePassword = (password: string) => {
  if (!IS_SECURE_PASSWORD_REGEX.test(password)) {
    throw Error(
      'Verwende für das Passwort Kleinbuchstaben, Großbuchstaben, Ziffern, Symbole und mindestens 8 Zeichen.'
    );
  }
};

/**
 * Checks if a string is a valid username, i.e. 'm.mueller'.
 *
 * @param str string to check
 * @returns is valid email
 */
const isUsername = (str: string): boolean => {
  return IS_EMAIL_REGEX.test(str);
};
/**
 * Checks if a string contains only letters and spaces.
 *
 * @param str string to check
 * @returns contains only letters and spaces
 */
const hasOnlyLettersAndSpaces = (str: string): boolean => {
  return HAS_ONLY_LETTERS_AND_SPACES_REGEX.test(str);
};

/**
 * Checks if a string is a valid email address.
 *
 * @param str string to check
 * @returns is valid email
 */
const isEmail = (str: string): boolean => {
  return IS_EMAIL_REGEX.test(str);
};

/**
 * Checks if a string is a secure password.
 *
 * A secure password requires:
 * - at least 8 characters
 * - at least one lower case letter (a-z)
 * - at least one upper case letter (A-Z)
 * - at least one number (0-9)
 * - at least one symbol
 *
 * @param str string to check
 * @returns is secure password
 */
const isSecurePassword = (str: string): boolean => {
  return IS_SECURE_PASSWORD_REGEX.test(str);
};
