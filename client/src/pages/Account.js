import React, {useContext} from 'react'
import {Link, Redirect} from 'react-router-dom'
import StripeCheckout from 'react-stripe-checkout'
import {useMutation} from '@apollo/react-hooks'
import {useQuery} from '@apollo/react-hooks'
import gql from 'graphql-tag'

import {AuthContext} from '../context/auth'

const GET_USER_INFO = gql`
  query getUserInfo($myUserId: String!) {
    getUser(userId: $myUserId) {
      type
      stripeId
      id
      createdAt
      username
      email
    }
  }
`

const CHANGE_CREDIT_CARD = gql`
  mutation changeCreditCard($source: String!) {
    changeCreditCard(source: $source) {
      id
      email
      type
    }
  }
`

export default function Account() {
  const {user} = useContext(AuthContext)
  const {loading, error, data} = useQuery(GET_USER_INFO, {
    variables: {myUserId: user ? user.id : null},
  })
  const [changeCreditCard] = useMutation(CHANGE_CREDIT_CARD)

  if (loading) {
    return <div>Loading...</div>
  }

  if (!data && !loading) {
    return <div>data is undefined</div>
  }

  if (!data.getUser) {
    return <Redirect to="/login">Please login</Redirect>
  }

  if (data.getUser.type === 'free' || data.getUser.type === '') {
    return <Redirect to="/subscription">Please subscribe</Redirect>
  }

  return (
    <div>
      {data.getUser.email}
      <StripeCheckout
        name="OptionFlo"
        currency="USD"
        token={async token => {
          const response = await changeCreditCard({
            variables: {source: token.id},
          })
          console.log(response)
        }}
        stripeKey={process.env.REACT_APP_STRIPE_PUBLISHABLE}
        amount={6000}
      />
    </div>
  )
}
