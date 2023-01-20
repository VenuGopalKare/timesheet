import '../styles/globals.css'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <>
    <Head>
      <script src="https://accounts.google.com/gsi/client" async defer></script>
      {/* <script src="https://apis.google.com/js/api.js"></script> */}
    </Head>
    <Component {...pageProps} />
    </>
  )
}
