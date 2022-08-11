declare module '*.svg' {
	const svg: string;
	export const ReactComponent: React.VFC<React.SVGProps<SVGSVGElement> & { title?: string }>;
	export default svg;
}
