const {gql} = require('apollo-server')

module.exports = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    comments: [Comment!]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }

  type Comment {
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }

  type Like {
    id: ID!
    createdAt: String!
    username: String!
  }

  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
    type: String
    stripeId: String
  }

  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  input OptionData {
    id: String!
    date: String!
    time: String!
    ticker: String!
    description: String!
    updated: String
    sentiment: String!
    aggressor_ind: String!
    option_symbol: String!
    underlying_type: String!
    cost_basis: String!
    put_call: String!
    price: String!
    size: String!
    day_volume: String!
    strike_price: String!
    date_expiration: String!
    option_activity_type: String!
    trade_count: String!
    open_interest: String!
    volume: String!
    bid: String!
    ask: String!
    midpoint: String!
  }

  type Option {
    id: String!
    date: String!
    time: String!
    ticker: String!
    description: String!
    updated: String
    sentiment: String!
    aggressor_ind: String!
    option_symbol: String!
    underlying_type: String!
    cost_basis: String!
    put_call: String!
    price: String!
    size: String!
    day_volume: String!
    strike_price: String!
    date_expiration: String!
    option_activity_type: String!
    trade_count: String!
    open_interest: String!
    volume: String!
    bid: String!
    ask: String!
    midpoint: String!
  }

  type Query {
    getPosts: [Post]
    getUser(userId: String!): User
    getPost(postId: ID!): Post
    getOptions: [Option]
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String, password: String): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: String!, body: String): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
    createSubscription(source: String!): User
    changeCreditCard(source: String!): User
    saveOption(options: [OptionData]): [Option]!
  }

  type Subscription {
    newPost: Post!
  }
`
