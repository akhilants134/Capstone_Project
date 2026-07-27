import "../index.css";
import "../App.css";
import { Providers } from "./providers";

export const metadata = {
  title: "ResourceMatch — AI-Powered Redistribution",
  description: "Connecting community organizations, local businesses, and donors to match surplus resources with direct societal need.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%230f9f6e'/><circle cx='50' cy='50' r='13' fill='white'/><circle cx='20' cy='25' r='9' fill='rgba(255,255,255,0.85)'/><circle cx='80' cy='25' r='9' fill='rgba(255,255,255,0.85)'/><circle cx='50' cy='83' r='9' fill='rgba(255,255,255,0.85)'/><line x1='29' y1='31' x2='41' y2='42' stroke='rgba(255,255,255,0.75)' stroke-width='6' stroke-linecap='round'/><line x1='71' y1='31' x2='59' y2='42' stroke='rgba(255,255,255,0.75)' stroke-width='6' stroke-linecap='round'/><line x1='50' y1='63' x2='50' y2='74' stroke='rgba(255,255,255,0.75)' stroke-width='6' stroke-linecap='round'/></svg>",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
