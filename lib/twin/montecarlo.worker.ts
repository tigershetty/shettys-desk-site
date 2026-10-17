import { monteCarlo } from "./montecarlo";

// Runs policy comparisons off the main thread so the live twin keeps animating.
self.onmessage = (e: MessageEvent<Parameters<typeof monteCarlo>[0]>) => {
  self.postMessage(monteCarlo(e.data));
};
