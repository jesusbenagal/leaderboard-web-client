import { type ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { AllTheProviders } from "./providers";

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export specific functions instead of using export *
export {
  screen,
  fireEvent,
  waitFor,
  act,
  cleanup,
  renderHook,
  waitForElementToBeRemoved,
} from "@testing-library/react";
export { customRender as render };
