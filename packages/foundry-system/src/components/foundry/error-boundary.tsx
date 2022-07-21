import { Component } from 'react';

export type ErrorBoundaryProps = {
	children?: React.ReactNode;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, { hasError: boolean }> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: unknown) {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	override render() {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return <h1>Something went wrong.</h1>;
		}

		return this.props.children;
	}
}
