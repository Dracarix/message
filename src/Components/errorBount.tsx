import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  errorElement?: ReactNode;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Можно добавить логирование ошибок в этот метод
    console.error(error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      // Вместо вывода стандартного сообщения об ошибке, вы можете подставить свой собственный компонент с пользовательским интерфейсом
      return (
        <div>
          <h2>Что-то пошло не так.</h2>
          {/* Ваш пользовательский компонент для отображения ошибки */}
          {this.props.errorElement ? this.props.errorElement : null}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

