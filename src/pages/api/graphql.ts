import { createContext } from './../../graphql/context';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchemaSync } from '@graphql-tools/load'
import { addResolversToSchema } from '@graphql-tools/schema'
import Cors from 'micro-cors'
import { resolvers } from '@/graphql/resolvers';
import { ApolloServer } from 'apollo-server-micro';

const cors = Cors()

// ジェネレート済みのスキーマ
const schema = loadSchemaSync('src/generated/schema.graphql', {
  loaders: [new GraphQLFileLoader()]
})

// スキーマにリゾルバーを当てこむ
const schemaWithResolvers = addResolversToSchema({ schema, resolvers })

// Apollo Server の立ち上げ
const apolloServer = new ApolloServer({
  // リゾルバー付きのスキーマ
  schema: schemaWithResolvers,
  // ユーザーセッションのためのコンテキスト注入
  context: createContext
})

const startServer = apolloServer.start()

export default cors(async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.end()
    return false
  }
  await startServer
  await apolloServer.createHandler({ path: '/api/graphql' })(req, res)
})

export const config = {
  api: {
    bodyParser: false,
  },
}
