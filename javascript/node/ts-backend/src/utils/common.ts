import moment from 'moment';

/* DD/MM/yyyy -> Date */
export const formatBirthdate = (birthdate: string) => {
    return moment(birthdate, 'DD/MM/YYYY').toDate();
};
