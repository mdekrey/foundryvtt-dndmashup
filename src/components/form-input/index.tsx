import { AutoTextField } from './auto-text-field';
import { AutoNumberField } from './auto-number-field';
import { Container } from './container';
import { Field } from './field';
import { FieldButton } from './field-button';
import { Label } from './label';
import { Checkbox } from './checkbox';

export const FormInput = Object.assign(Container, {
	AutoTextField,
	AutoNumberField,
	Field,
	FieldButton,
	Label,
	Checkbox,
});
