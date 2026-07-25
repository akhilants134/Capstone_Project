import "../index.css";
import "../App.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Resource Matcher",
  description: "A platform matching resources with those in need.",
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
