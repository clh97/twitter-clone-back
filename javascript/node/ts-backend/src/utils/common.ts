import moment from 'moment';

/* dd/mm/yyyy -> Date */
export const formatBirthdate = (birthdate: string) => {
    return moment(birthdate, 'dd/mm/yyyy').toDate();
};
