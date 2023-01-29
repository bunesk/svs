declare type gender = 'male' | 'female' | 'diverse';
declare type genderLabel = 'Männlich' | 'Weiblich' | 'Divers' | 'Keine Angabe';

/**
 * Returns the gender label to show for gender database value.
 *
 * @param gender gender value
 * @returns gender label
 */
export const getGenderLabel = (gender: gender): genderLabel => {
  switch (gender) {
    case 'male':
      return 'Männlich';
    case 'female':
      return 'Weiblich';
    case 'diverse':
      return 'Divers';
  }
  return 'Keine Angabe';
};
