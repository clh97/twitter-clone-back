import moment from 'moment';
import { validateOrReject } from 'class-validator';

/* DD/MM/yyyy -> moment date */
export const formatBirthdate = (birthdate: string): string => {
    return moment(birthdate, 'DD/MM/YYYY').toISOString();
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
}