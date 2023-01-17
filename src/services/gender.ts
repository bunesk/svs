declare type gender = 'male' | 'female' | 'diverse';
declare type genderLabel = 'Männlich' | 'Weiblich' | 'Divers' | 'Keine Angabe';

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
