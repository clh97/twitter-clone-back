import moment from 'moment';

/* DD/MM/yyyy -> moment date */
export const formatBirthdate = (birthdate: string) => {
    return moment(birthdate, 'DD/MM/YYYY').toDate();
};
