import React from "react";
import StripeCheckout from "react-stripe-checkout";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { REACT_APP_STRIPE_PUBLISHABLE } from "../config";

export default function Subscription() {
  const [createSub] = useMutation(CREATE_SUBSCRIPTION);
  return (
    <StripeCheckout
      token={async (token) => {
        const response = await createSub({
          variables: { source: token.id },
        });
        console.log(response);
      }}
      stripeKey={REACT_APP_STRIPE_PUBLISHABLE}
      amount={65}
    />
  );
}

const CREATE_SUBSCRIPTION = gql`
  mutation createSubscription($source: String!) {
    createSubscription(source: $source) {
      id
      email
    }
  }
`;
