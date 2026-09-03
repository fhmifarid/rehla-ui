import { withThemeByDataAttribute } from "@storybook/addon-styling"
import type { Preview } from "@storybook/react"
import { Analytics } from "@vercel/analytics/react"

import "../src/main.css"

export const decorators = [
  withThemeByDataAttribute({
    themes: {
      Light: "light",
      Dark: "dark",
    },
    defaultTheme: "light",
    attributeName: "data-mode",
  }),
  (Story) => (
    <>
      <Story />
      <Analytics />
    </>
  ),
]

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
}

export default preview
