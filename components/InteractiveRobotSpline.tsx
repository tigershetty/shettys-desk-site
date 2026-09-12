'use client';

import {
  Component,
  Suspense,
  lazy,
  type ReactNode,
} from 'react';
const Spline = lazy(() => import('@splinetool/react-spline'));

interface InteractiveRobotSplineProps {
  scene: string;
  className?: string;
}

interface SplineErrorBoundaryProps {
  children: ReactNode;
  className?: string;
}

interface SplineErrorBoundaryState {
  hasError: boolean;
}

class SplineErrorBoundary extends Component<
  SplineErrorBoundaryProps,
  SplineErrorBoundaryState
> {
  state: SplineErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): SplineErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch() {
    // The Experience page remains usable if the optional third-party scene fails.
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className={`flex h-full w-full items-center justify-center rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground ${this.props.className ?? ""}`}
          role="status"
        >
          Interactive profile visual is temporarily unavailable.
        </div>
      );
    }

    return this.props.children;
  }
}

export function InteractiveRobotSpline({ scene, className }: InteractiveRobotSplineProps) {
  return (
    <SplineErrorBoundary className={className}>
      <Suspense
        fallback={
          <div
            className={`flex h-full w-full items-center justify-center rounded-2xl border border-border bg-card text-sm text-muted-foreground ${className ?? ""}`}
            role="status"
          >
            Loading interactive profile visual…
          </div>
        }
      >
        <Spline
          scene={scene}
          className={className}
          wasmPath="https://unpkg.com/@splinetool/modelling-wasm@1.12.97/build"
        />
      </Suspense>
    </SplineErrorBoundary>
  );
}
