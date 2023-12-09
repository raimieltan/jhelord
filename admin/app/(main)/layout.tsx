import './../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Topbar } from '../components/Topbar'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Prominent',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <div className="flex h-screen w-screen flex-row bg-yellow-200 p-8 justify-start">
          <div className='flex h-auto flex-col w-full'>
            <Topbar />
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
