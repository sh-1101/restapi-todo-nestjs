import '@/styles/globals.css'
import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import { MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import axios from 'axios'

//ReactQueryをプロジェクト内で使用できるようにするために必要
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, //defaultのtrueだとapiアクセスに失敗した時に3回接続を試みる
      refetchOnWindowFocus: false, //trueだとユーザーがブラウザにフォーカスを当てた時にRestAPIへのfetchが走る
    },
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  axios.defaults.withCredentials = true //フロントとサーバーでcookieのやり取りをする場合はtrueにする必要がある

  useEffect(() => {
    const getCsrfToken = async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/csrf`,
      )
      /**
       * アプリケーションが起動した時にRestAPIでcsrfTokenを取得し
       * axiosのデフォルト設定でheaderにcsrf-tokenという名前をつけてトークンを設定する
       * これ以降NextからNestにリクエストを送るときは全てcsrf-tokenがheaderに自動的に付与されるようになる
       */
      axios.defaults.headers.common['csrf-token'] = data.csrfToken
    }
    getCsrfToken()
  }, [])
  return (
    //プロジェクト全体でReactQueryを使用するためにMantineProviderを囲う
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{ colorScheme: 'dark', fontFamily: 'Verdana, sans-serif' }}
      >
        <Component {...pageProps} />
      </MantineProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export default MyApp
