import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from './components/Navbar/Navbar'
import Image from 'next/image'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fish Crew',
  description: 'Generated by create next app',
}

interface Props {
  children: React.ReactNode
}

const RootLayout: React.FC<Props> = ({ children }) => {
  return (
    <html lang="fr">
      <head />
      <body >
      <div style={{ backgroundImage: 'url("/background_webp_image.webp")', backgroundSize: 'cover', backgroundPosition: 'center' }}
  className="relative z-0 w-full h-full"
>

        <Navbar />
        <div className="z-10">{children}</div>
      </div>
      </body>
    </html>
  )
}
export default RootLayout
