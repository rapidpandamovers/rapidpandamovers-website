import localFont from "next/font/local";

export const getaiGrotesk = localFont({
  src: [
    {
      path: "../public/fonts/getai-grotesk-display/DTGetaiGroteskDisplay-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-getai",
});