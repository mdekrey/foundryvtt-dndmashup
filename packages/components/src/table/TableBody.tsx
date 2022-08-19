export function TableBody({ className, children }: { className?: string; children?: React.ReactNode }) {
	return <tbody className="even:bg-gradient-to-r from-transparent to-white odd:bg-transparent">{children}</tbody>;
}
