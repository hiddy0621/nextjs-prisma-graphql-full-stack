import type { FC, FormEventHandler} from "react";
import { FormEvent,useEffect, useState } from "react"

import type { TodosQuery } from '@/generated/request' // 型情報が欲しいとき
import { useAddTodoMutation, useDeleteTodoMutation, useTodosQuery, useUpdateTodoMutation } from "@/generated/request"

export const TodoList: FC = () => {
  const [todoTitle, setTodoTitle] = useState('')
  const [todos, setTodos] = useState<TodosQuery['todos']>([])
  // ジェネレートされたHooks
  const { loading, error, data, refetch } = useTodosQuery()

  // Mutation各種
  const [addTodoMutation] = useAddTodoMutation()
  const [updateTodoMutation] = useUpdateTodoMutation()
  const [deleteTodoMutation] = useDeleteTodoMutation()

  // データの有無でStateを変更してやる
  useEffect(() => {
    // Todosがあれば入れてやって、なければ空配列のまま
    setTodos(data?.todos ?? [])
  }, [data?.todos])
  
  // ローディング / エラー / Todos がないときのリターン
  if (loading) return <div>loading...</div>
  if (error) return <div>error...!</div>
  if (!data?.todos) return <h3>You havent added items yet</h3>

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    // 今回は useState でテキストの状態管理はしないで
    // input 要素の value を参照
    // const { value: title } = (e.target as any).title
    // const input = e.currentTarget.querySelector("input") as HTMLInputElement

    // mutation を使って追加
    const { data } = await addTodoMutation({
      variables: { title: todoTitle }
    })

    // mutation の返り値の todo
    const addedTodo = data?.addTodo
    if (!addedTodo) return
    setTodos([addedTodo, ...todos])
    setTodoTitle('')
    // アイテム追加できたら、input の value を空に
    // input!.value = ''
    // リストを更新
    await refetch()
  }

   const handleChange = async (
    todoId: string,
    completed: boolean
  ): Promise<void> => {
    const { data } = await updateTodoMutation({
      variables: { todoId, completed },
    })
    const todo = data?.updateTodo
    if (!todo) return
    // アップデートされたものをIDチェックしてmapping
    const updatedTodos = todos.map((t) => (t?.id === todo.id ? todo : t))
    setTodos(updatedTodos)
  }

  const handleDelete = async (todoId: string): Promise<void> => {
    // confirmメソッドで判別
    const isOk = confirm('削除しますか？')
    if (!isOk) return
    const { data } = await deleteTodoMutation({ variables: { todoId } })
    const todo = data?.deleteTodo
    if (!todo) return
    // 削除したものを配列から外す
    const deletedTodos = todos.filter((t) => t?.id !== todo.id)
    setTodos(deletedTodos)
  }

  return (
    <div className="p-3 border rounded">
      <h3 className="text-xl">Todo List</h3>
      <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
        <label>
          <h4 className="text-xs">リストのタイトル</h4>
          <input
            type="text"
            name="title"
            value={todoTitle}
            onChange={(e) => setTodoTitle(e.target.value)}
            className="p-2 mt-2 block bg-gray-100"
          />
          <button className="bg-cyan-400 text-white p-2 mt-2">追加する</button>
        </label>
      </form>
      <ul className="mt-5">
        {!todos.length && <span>You havent added items yet</span>}
        {todos.map((todo) => {
          return (
            <li key={todo.id} className={`${todo.completed && 'line-through'}`}>
              <span>
                {todo.completed ? '✅' : '👀'} {todo.title}
              </span>{' '}
              <input
                className="cursor-pointer"
                type="checkbox"
                checked={todo.completed}
                onChange={(e) => handleChange(todo.id, e.target.checked)}
              />
              <span> / </span>
              <button onClick={() => handleDelete(todo.id)}>🗑</button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default TodoList