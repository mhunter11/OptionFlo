import React, {useContext} from 'react'
import {Redirect, Link} from 'react-router-dom'
import StripeCheckout from 'react-stripe-checkout'
import {useMutation, useQuery} from '@apollo/react-hooks'
import gql from 'graphql-tag'

import {GET_USER_INFO} from '../../util/gql'
import {ENVIRONMENT} from '../../env'
import {AuthContext} from '../../context/auth'

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
      {data.getUser.admin === true && (
        <div>
          <Link to="/admin">Admin Panel</Link>
        </div>
      )}
      <div>{data.getUser.email}</div>
      <StripeCheckout
        name="OptionFlo"
        currency="USD"
        token={async token => {
          const response = await changeCreditCard({
            variables: {source: token.id},
          })
          console.log(response)
        }}
        stripeKey={ENVIRONMENT.STRIPE_PUBLISHABLE}
        amount={6000}
      />
    </div>
  )
}
