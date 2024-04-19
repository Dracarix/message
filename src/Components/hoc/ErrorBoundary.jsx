import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
        this.setState({ hasError: true });
        // Здесь можно добавить логирование ошибки
        
    console.log('Произошла ошибка:', error, info);
    }

    render() {
        if (this.state.hasError) {
            // Вернуть компонент с информацией об ошибке
            return <h1>Что-то пошло не так.</h1>;
        }
        // Вернуть дочерние компоненты, если ошибки нет
        return this.props.children;
    }
}

export default ErrorBoundary;
