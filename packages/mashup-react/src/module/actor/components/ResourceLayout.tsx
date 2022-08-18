export function ResourceLayout({
	title,
	body,
	footer,
}: {
	title: React.ReactNode;
	body: React.ReactNode;
	footer?: React.ReactNode;
}) {
	return (
		<section className="flex flex-col items-center">
			<h2 className="text-lg">{title}</h2>
			<div className="flex justify-start flex-grow items-baseline gap-1 text-lg">{body}</div>
			{footer ? <div>{footer}</div> : footer}
		</section>
	);
}
