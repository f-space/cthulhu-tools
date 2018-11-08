import React from 'react';

const DEFAULT_TITLE = document.title;

export interface DocumentTitleProps {
	title: string | null;
}

export class DocumentTitle extends React.Component<DocumentTitleProps> {
	public componentDidMount(): void {
		document.title = this.props.title !== null
			? `${this.props.title} - ${DEFAULT_TITLE}`
			: DEFAULT_TITLE;
	}

	public componentWillUnmount(): void {
		document.title = DEFAULT_TITLE;
	}

	public render() {
		return this.props.children;
	}
}