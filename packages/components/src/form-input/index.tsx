import { Container, InlineContainer } from './container';
import { Field } from './field';
import { FieldButton } from './field-button';
import { Label } from './label';
import { ImageEditor } from './image-editor';
import { RichText } from './rich-text';
import { Select } from './select';
import { TextField } from './text-field';
import { NumberField } from './number-field';
import { Checkbox } from './checkbox';
import { MultiSelect } from './multi-select';
import { Structured } from './structured-field';

export const FormInput = Object.assign(Container, {
	Inline: InlineContainer,
	Field,
	FieldButton,
	Label,
	ImageEditor,
	RichText,
	Select,
	TextField,
	NumberField,
	Checkbox,
	MultiSelect,
	Structured,
});
export type { SelectItem } from './select';
