'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { GPTResponse } from './types/GPTResponse'

const Survey = z.object({
  choice1: z.string().min(1),
  choice2: z.string().min(1),
})

type Inputs = z.infer<typeof Survey>

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<{
    topic: string
    choice1: string
    choice2: string
  } | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>({
    resolver: zodResolver(Survey),
  })

  // load中を出したい。swrのmutateを使う？
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setMessage(null)
    setIsLoading(true)
    try {
      const response = await fetch('/api/chatgpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: {
            role: 'user',
            content: `Response1: ${data.choice1}, Response2: ${data.choice2}`,
          },
        }),
      })

      if (!response.ok || response.body === null) {
        throw new Error('API response is not ok')
      }
      const messages = await response.json().then((data: GPTResponse) => {
        console.log('datadata', data)
        // resposenをparseするにはどうしたらいい？
        return data
      })
      setMessage(messages)
    } catch (error) {
      console.error('API call failed:', error)
      // TODO: エラー表示をする
    } finally {
      setIsLoading(false)
    }
  }

  function onReset() {
    setMessage(null)
    reset()
  }

  // MEMO: tailwindのクラスを自動で並び替えたりできないのか？
  // MEMO: justify-centerとitems-centerの違いって何
  return (
    <main className="flex min-h-screen flex-col items-center space-y-16 p-24">
      <div className="space-y-3 text-center">
        <h1 className="font-serif text-6xl font-bold">お題作るで</h1>
        <p className="text-xs text-gray-800">
          回答からアンケートのお題を自動生成します。
        </p>
      </div>
      {/* TODO: 使い方exampleのアコーディオン */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-10 flex flex-col items-center space-y-6"
      >
        <div className="space-x-2">
          <label className="">回答1</label>
          <input
            {...register('choice1', { required: true })}
            className="rounded-md border-2 border-gray-500 p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600"
            aria-invalid={errors.choice1 ? 'true' : 'false'}
          />
          {errors.choice1 && <p role="alert">1 is required</p>}
        </div>
        <div className="space-x-2">
          <label>回答2</label>
          <input
            {...register('choice2', { required: true })}
            className="rounded-md border-2 border-gray-500 p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600"
            aria-invalid={errors.choice2 ? 'true' : 'false'}
          />
          {errors.choice1 && <p role="alert">2 is required</p>}
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-blue-400 px-4 py-2 text-white hover:bg-blue-600"
        >
          送信
        </button>
        <button type="button" className="... bg-indigo-500" disabled>
          <svg className="... mr-3 h-5 w-5 animate-spin" viewBox="0 0 24 24">
            {' '}
            indicator{' '}
          </svg>
          Processing...
        </button>
      </form>
      {/* TODO: ローディング中は表示せず、responseが来てloadingが終わったら下からふわっと表示する */}
      {/* TODO: ローディング中はGPTで作ったローディング中みたいな画像表示させておく */}
      <div className="mx-4 flex h-32 w-full flex-col items-center justify-center space-y-2 rounded-md bg-red-300 shadow-md">
        <div className="flex flex-col space-y-1">
          <h2 className="font-serif text-2xl font-bold">
            お題: {message?.topic}
          </h2>
          <p className="px-8 font-serif text-lg font-bold">
            回答1: {message?.choice1}
          </p>
          <p className="px-8 font-serif text-lg font-bold">
            回答2: {message?.choice2}
          </p>
        </div>
      </div>
    </main>
  )
}
