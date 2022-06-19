import { AutoTextField } from './auto-text-field';
import { AutoNumberField } from './auto-number-field';
import { AutoSelect } from './auto-select';
import { Container } from './container';
import { Field } from './field';
import { FieldButton } from './field-button';
import { Label } from './label';
import { AutoCheckbox } from './auto-checkbox';
import { RichText } from './rich-text';
import { Select } from './select';
import { TextField } from './text-field';
import { NumberField } from './number-field';
import { Checkbox } from './checkbox';
import { MultiSelect } from './multi-select';

export const FormInput = Object.assign(Container, {
	AutoTextField,
	AutoNumberField,
	AutoSelect,
	Field,
	FieldButton,
	Label,
	AutoCheckbox,
	RichText,
	Select,
	TextField,
	NumberField,
	Checkbox,
	MultiSelect,
});
export { SelectItem } from './auto-select';
