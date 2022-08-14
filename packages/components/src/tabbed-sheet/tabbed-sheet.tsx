import { Stateful } from '@foundryvtt-dndmashup/core';
import { Children, Fragment } from 'react';
import { FormInput } from '../form-input';
import { TabContext, Tabs } from '../tab-section';
import { TabbedSheetTab, TabbedSheetTabProps } from './tabbed-sheet-tab';

function flattenFragments(children: React.ReactNode): JSX.Element[] {
	return Children.toArray(children)
		.filter((v): v is JSX.Element => Boolean(v && typeof v === 'object' && 'props' in v))
		.flatMap((v) => (v.type === Fragment ? flattenFragments(v.props.children) : v));
}

export function TabbedSheet({
	img,
	name,
	headerSection,
	tabState,
	children,
}: {
	img: Stateful<string | null>;
	name: string | null;
	headerSection?: React.ReactNode;
	tabState: TabContext;
	children?: React.ReactNode;
}) {
	const tabs = flattenFragments(children)
		.filter((v) => v.type === TabbedSheetTab)
		.map((v): TabbedSheetTabProps => v.props);
	return (
		<div className="h-full flex flex-col gap-1">
			<div className="flex flex-row gap-1">
				<FormInput.ImageEditor {...img} title={name} className="w-24 h-24 border-2 border-black p-px" />
				{headerSection}
			</div>
			<div className="border-b border-black"></div>
			<Tabs.Controlled {...tabState}>
				<Tabs.Nav>
					{tabs.map((tab) => (
						<Tabs.NavButton tabName={tab.name} key={tab.name}>
							{tab.label}
						</Tabs.NavButton>
					))}
				</Tabs.Nav>

				<section className="flex-grow">
					{tabs.map((tab) => (
						<Tabs.Tab tabName={tab.name} key={tab.name}>
							{tab.children}
						</Tabs.Tab>
					))}
				</section>
			</Tabs.Controlled>
		</div>
	);
}
