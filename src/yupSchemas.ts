import { passwordNotLongEnough } from './modules/register/errorMessages';
import * as yup from 'yup';

export const registerPasswordValidation = yup
    .string()
    .min(3, passwordNotLongEnough)
    .max(255)