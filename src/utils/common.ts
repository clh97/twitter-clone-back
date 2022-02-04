import moment from 'moment';
import { validateOrReject } from 'class-validator';

/* yyyy/MM/dd -> moment date */
export const formatBirthdate = (birthdate: string): string => {
  return moment(birthdate, 'yyyy/MM/dd').toISOString();
};

/* uses class-validator to validate decorator data from a class */
export const validateDecorators = async (input: any): Promise<boolean> => {
  try {
    await validateOrReject(input);
    return true;
  } catch (errors) {
    console.log('Caught promise rejection (validation failed). Errors: ', errors);
    return false;
  }
};
