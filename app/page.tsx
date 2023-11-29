'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { GPTResponse } from './types/GPTResponse';

const Survey = z.object({
  choice1: z.string().min(1),
  choice2: z.string().min(1),
});

type Inputs = z.infer<typeof Survey>;

export default function Home() {
  const [message, setMessage] = useState<{
    topic: string;
    choice1: string;
    choice2: string;
  } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>({
    resolver: zodResolver(Survey),
  });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setMessage(null);
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
      });

      if (!response.ok || response.body === null) {
        throw new Error('API response is not ok');
      }
      const messages = await response.json().then((data: GPTResponse) => {
        console.log('datadata', data);
        // resposenをparseするにはどうしたらいい？
        return data;
      });
      setMessage(messages);
    } catch (error) {
      console.error('API call failed:', error);
    }
  };

  function onReset() {
    setMessage(null);
    reset();
  }

  // MEMO: tailwindのクラスを自動で並び替えたりできないのか？
  // MEMO: justify-centerとitems-centerの違いって何
  return (
    <main className="flex min-h-screen flex-col items-center p-24 space-y-16">
      <div className="space-y-3 text-center">
        <h1 className="text-6xl font-bold font-serif">お題作るで</h1>
        <p className="text-gray-800 text-xs">
          回答からアンケートのお題を自動生成します。
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-6 mt-10 items-center"
      >
        <div className="space-x-2">
          <label className="">回答1</label>
          <input
            {...register('choice1', { required: true })}
            className="p-2 border-2 border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            aria-invalid={errors.choice1 ? 'true' : 'false'}
          />
          {errors.choice1 && <p role="alert">1 is required</p>}
        </div>
        <div className="space-x-2">
          <label>回答2</label>
          <input
            {...register('choice2', { required: true })}
            className="p-2 border-2 border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            aria-invalid={errors.choice2 ? 'true' : 'false'}
          />
          {errors.choice1 && <p role="alert">1 is required</p>}
        </div>
        <button
          type="submit"
          className="py-2 px-4 bg-blue-400 rounded-md w-full text-white hover:bg-blue-600"
        >
          送信
        </button>
      </form>
      <div className="flex flex-col space-y-2 shadow-md rounded-md w-full mx-4 bg-red-300 items-center h-32 justify-center">
        <div className="flex flex-col space-y-1">
          <h2 className="text-2xl font-bold font-serif">
            お題: {message?.topic}
          </h2>
          <p className="text-lg font-bold font-serif px-8">
            回答1: {message?.choice1}
          </p>
          <p className="text-lg font-bold font-serif px-8">
            回答2: {message?.choice2}
          </p>
        </div>
      </div>
      <button
        onClick={onReset}
        className="py-2 px-4 bg-blue-400 rounded-md w-full text-white hover:bg-blue-600"
      >
        やり直す
      </button>
    </main>
  );
}
