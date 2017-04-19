import { ValidationResult } from './../interfaces';
import { FormControl } from '@angular/forms';


export class CheckedValidator {

    public static isChecked(control: FormControl): ValidationResult {
        var valid = control.value === false || control.value === 'false';
        if (valid) {
            return { isChecked: true };
        }
        return null;
    }
}