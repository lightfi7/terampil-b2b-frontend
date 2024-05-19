import '@/styles/globals.css'
// pages/_app.js
import { ChakraProvider } from '@chakra-ui/react'

// 1. Import the extendTheme function
import { extendTheme } from '@chakra-ui/react'
import axios from 'axios'
import Head from 'next/head'

// 2. Extend the theme to include custom colors, fonts, etc
export const colors = {
  brand: '#005CB9',
  text: '#373737'
}

const fonts = {
  heading: `'Inter', sans-serif`,
  body: `'Inter', sans-serif`,
}

const theme = extendTheme({ colors, fonts });

axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';

// 3. Pass the `theme` prop to the `ChakraProvider`
function MyApp({ Component, pageProps }: any) {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <link rel="icon" href="https://terampil.biz/wp-content/uploads/2023/03/cropped-cropped-terampil-biz-logo-1-32x32.png" sizes="32x32" />
        <link rel="icon" href="https://terampil.biz/wp-content/uploads/2023/03/cropped-cropped-terampil-biz-logo-1-192x192.png" sizes="192x192" />
        <title>
          { process.env.NEXT_PUBLIC_SYSTEM_NAME }
        </title>
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp;
