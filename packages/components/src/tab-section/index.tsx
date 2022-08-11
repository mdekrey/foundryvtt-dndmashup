import { Container, ControlledContainer } from './container';
import { Tab } from './tab';
import { TabNavigation } from './tab-navigation';
import { TabButton } from './tab-button';

export * from './type';

export const Tabs = Object.assign(Container, {
	Controlled: ControlledContainer,
	Tab,
	Nav: TabNavigation,
	NavButton: TabButton,
});
