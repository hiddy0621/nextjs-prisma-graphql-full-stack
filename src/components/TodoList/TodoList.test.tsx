import { screen, waitFor } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import { customRender } from '@/libs/test'

import { TodoList } from '.'

// testing library 各メソッドのチートシート👇
// 参照：https://testing-library.com/docs/queries/about/

test('ローディング画面が正しくレンダーされるか', () => {
  customRender(<TodoList />),
    // 存在が絶対に望まれるものは get
    expect(screen.getByText('loading...')).toBeInTheDocument()
})

test('Todoリストが正しくレンダリングされるか', async () => {
  customRender(<TodoList />),
    // バリデーションや時間がかかる処理に対しては find
    expect(await screen.findByText('Todo List')).toBeInTheDocument()
})

test('リストアイテムが正しく追加されるかどうか', async () => {
  const { user } = customRender(<TodoList />)
  // TodoList のタイトル入力
  const textbox = await screen.findByRole('textbox')
  // addTodoイベントを実行
  await user.type(textbox, 'testAddTodo')
  // ボタンをクリックして送信
  await user.click(screen.getByRole('button', { name: '追加する' }))
  // 追加されたアイテムのテキストをチェック
  expect(await screen.findByText('👀 testAddTodo')).toBeInTheDocument()
})

test('アイテムを正しくコンプリートできるか', async () => {
  const { user } = customRender(<TodoList />)
  await user.click((await screen.findAllByRole('checkbox'))[0])
  await waitFor(
    () => void expect(screen.getAllByRole('checkbox')[0]).toBeChecked()
  )
})

test('アイテムを正しく削除できるか', async () => {
  const { user } = customRender(<TodoList />)
  // コンファームをモックする
  const windowConfirmSpy = vi.spyOn(window, 'confirm')
  // True が返ってくるかを確認
  windowConfirmSpy.mockImplementation(() => true)
  // アイテム数を比較するための流れ
  // ① 2件のモックを用意してるはずなので、それらを取得
  await waitFor(
    () => void expect(screen.getAllByRole('listitem').length).toBe(2)
  )
  // ② ユーザーが削除ボタンをクリックする
  await user.click((await screen.findAllByRole('button', { name: '🗑' }))[0])
  // ③ すこし待ってから、モックを確認すると、1件に減っていることが期待できる
  await waitFor(
    () => void expect(screen.getAllByRole('listitem').length).toBe(1)
  )
  // 最終的にはモックを復元しておく
  windowConfirmSpy.mockRestore()
})
