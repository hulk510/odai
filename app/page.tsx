'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const Survey = z.object({
  choice1: z.string().min(1),
  choice2: z.string().min(1),
});

type Inputs = z.infer<typeof Survey>;

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(Survey),
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    // TODO: apiに投げる
    // apiでchatgptのAPIを叩く
    // エラーがあればエラーを表示
    console.log(data);
  };

  // MEMO: tailwindのクラスを自動で並び替えたりできないのか？
  // MEMO: justify-centerとitems-centerの違いって何
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="space-y-3 text-center">
        <h1 className="text-6xl font-bold font-serif">お題作るで</h1>
        <p className="text-gray-800 text-xs">
          回答からアンケートのお題を自動生成します。
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-6 mt-8 items-center"
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
          className="py-2 px-4 bg-blue-400 rounded-md w-32 text-white hover:bg-blue-600"
        >
          送信
        </button>
      </form>
    </main>
  );
}
