import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Navigate, useLocation } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import "./Payment.css";
import CheckoutPayment from "./CheckoutPayment";

const stripe = loadStripe(import.meta.env.VITE_STRIPE);

const Payment = () => {
  const location = useLocation();
  console.log(location);
  const price = location?.state?.price;
  const cartItm = location?.state?.ItemId;
  if (!price) {
    return <Navigate to="/dashboard/my-selected" />;
  }

  return (
    <div className="my-40 stripe-custom-class">
      <Elements stripe={stripe}>
        <CheckoutPayment price={price} cartItm={cartItm} />
      </Elements>
    </div>
  );
};

export default Payment;
