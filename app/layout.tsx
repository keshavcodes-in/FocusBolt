import type React from "react"
import type { Metadata } from "next"
import { Dancing_Script } from "next/font/google"
import "./globals.css"
import { AppProviders } from "./providers"
import { Suspense } from "react"
import { LoaderThree } from "@/components/ui/loader"


const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing-script',
})


export const metadata: Metadata = {
   metadataBase: new URL('https://focusbolt.keshavcodes.in/'),
  title: "Focus Bolt - Pomodoro Timer",
  description: "A beautiful Pomodoro timer with customizable sessions, themes, and music integration to boost your productivity.",
  generator: "keshavcodes",
  openGraph: {
    title: "Focus Bolt - Pomodoro Timer",
    description: "A beautiful Pomodoro timer with customizable sessions, themes, and music integration to boost your productivity.",
     url: 'https://focusbolt.keshavcodes.in/',
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Focus Bolt Preview",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Focus Bolt - Pomodoro Timer",
    description: "A beautiful Pomodoro timer with customizable sessions, themes, and music integration.",
    images: ["/og-image.png"],
    creator: "@keshav_inTech",
  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link id="favicon" rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${dancingScript.variable} font-sans`}>
        <Suspense fallback={<LoaderThree />}>
          <AppProviders>{children}
           
          </AppProviders>
        </Suspense>
      </body>
    </html>
  )
}
