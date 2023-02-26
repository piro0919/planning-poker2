// eslint-disable-next-line filenames/match-exported
"use client";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { connectFirestoreEmulator } from "firebase/firestore";
// eslint-disable-next-line camelcase
import { M_PLUS_Rounded_1c } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "ress/dist/ress.min.css";
import "./globals.scss";
import db from "@/libs/db";

const mPLUSRounded1C = M_PLUS_Rounded_1c({
  subsets: ["latin"],
  weight: "400",
});

if (process.env.NODE_ENV === "development") {
  connectFirestoreEmulator(db, "localhost", 8080);
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="ja">
      <head>
        <title>プランニングポーカー</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link href="/favicon.ico" rel="icon" />
        <link
          href="/apple-touch-icon.png"
          rel="apple-touch-icon"
          sizes="180x180"
        />
        <link
          href="/favicon-32x32.png"
          rel="icon"
          sizes="32x32"
          type="image/png"
        />
        <link
          href="/favicon-16x16.png"
          rel="icon"
          sizes="16x16"
          type="image/png"
        />
        <link href="/site.webmanifest" rel="manifest" />
      </head>
      <body className={mPLUSRounded1C.className}>
        <script />
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#1a73e8",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}
