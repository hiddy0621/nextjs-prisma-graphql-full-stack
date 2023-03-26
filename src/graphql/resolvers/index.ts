import type { Resolvers } from '@/generated/resolver-types'

export const resolvers: Resolvers = {
  // Query / Mutation の各プロパティ内のメソッドを追加
  Query: {
    todos: async (_, __, { prisma, currentUser }) => {
      if (!currentUser) {
        throw new Error('User is not logged In')
      }
      const todos = await prisma.todo.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: true },
        where: { userId: currentUser.id },
      })
      return todos
    },
  },
  Mutation: {
    addTodo: async (_, { title }, { prisma, currentUser }) => {
      if (!currentUser) {
        throw new Error('User is not logged In')
      }
      const todo = await prisma.todo.create({
        data: { userId: currentUser.id, title },
        include: { user: true },
      })
      return todo
    },
    updateTodo: async (
      _,
      { todoId, title, completed },
      { prisma, currentUser }
    ) => {
      if (!currentUser) {
        throw new Error('User not logged in.')
      }
      const targetTodo = await prisma.todo.findUnique({
        where: { id: todoId },
      })
      // 権限チェック
      if (targetTodo?.userId !== currentUser.id) {
        throw new Error('Invalid User')
      }
      const todo = await prisma.todo.update({
        where: { id: todoId },
        data: {
          // title: title && title,
          ...(title && { title }),
          // complete も同様
          ...(completed !== undefined && completed !== null
            ? { completed }
            : {}),
        },
        include: { user: true },
      })
      return todo
    },
    deleteTodo: async (_, { todoId }, { prisma, currentUser }) => {
      if (!currentUser) {
        throw new Error('User not logged in.')
      }
      const targetTodo = await prisma.todo.findUnique({ where: { id: todoId } })
      if (targetTodo?.userId !== currentUser.id) {
        throw new Error('Invalid user.')
      }
      const todo = await prisma.todo.delete({
        where: { id: todoId },
        include: { user: true },
      })
      return todo
    },
  },
}
