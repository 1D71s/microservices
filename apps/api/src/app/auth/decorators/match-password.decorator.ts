import {
    registerDecorator,
    ValidationArguments, 
    ValidationOptions,
    ValidatorConstraint, 
    ValidatorConstraintInterface 
} from 'class-validator';
import { RegisterDto } from '@apps/api/src/app/auth/dtos/register.dto';

@ValidatorConstraint({ name: 'IsPasswordsMatching', async: false })
export class IsPasswordsMatchingConstraint implements ValidatorConstraintInterface {
    validate(passwordRepeat: string, args: ValidationArguments) {
        const obj = args.object as RegisterDto;
        return obj.password === passwordRepeat;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'Passwords are not matching!';
    }
}

export function IsPasswordsMatching(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsPasswordsMatchingConstraint,
        });
    };
}