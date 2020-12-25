import { remote } from 'electron';
import React from 'react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.log(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            const isProduction = process.env.NODE_ENV === 'production';

            if (isProduction) {
                const window = remote.getCurrentWindow()
                window.close();
            }

            return <></>;
        }

        return this.props.children;
    }
}
