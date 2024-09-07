import { CardElement, useStripe } from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";
import { MdColorLens } from "react-icons/md";
import useAxioxSecure from "../../../../hooks/useAxiosSecure";
import useUser from "../../../../hooks/useUser";
import { Navigate } from "react-router-dom";

const CheckoutPayment = ({ price }) => {
  const stripe = useStripe();
  const URL = `https://localhost:3000/payment-info?${
    cartItem && `classId=${cartItem}`
  }`;
  const axiosSecure = useAxioxSecure();
  const { currentUser, isLoading } = useUser();
  const [clientSecret, setClientSecret] = useState("");
  const [succeeded, setSucceeded] = useState("");
  const [cart, setCart] = useState([]);

  if (price < 0 || !price) {
    return <Navigate to="/dashboard/my-selected" replace />;
  }

  useEffect(() => {
    axiosSecure
      .get(`/cart/${currentUser?.email}`)
      .then((res) => {
        const classId = res.data.map((item) => item._id);
        setCart(classId);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    axiosSecure.post("/create-payment-intent", { price: price }).then((res) => {
      setClientSecret(res.data.clientSecret);
    });
  }, []);

  const handleSubmit = async (evert) => {
    setMessage("");
    event.preventDefault();
    if (!stripe) {
      return;
    }
    const cart = elements.getElement(CardElement);
    if (card === null) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("[error]", error);
      setMessage(error.message);
    } else {
      console.log("PaymentMethod", paymentMethod);
    }

    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: currentUser?.name || "unknown",
            email: currentUser?.email || "Annonymous",
          },
        },
      });

    if (confirmError) {
      console.log("[Confirm Error]", confirmError);
    } else {
      console.log("[Payment Intent]", paymentIntent);
      if (paymentIntent.status === "succeeded") {
        const transactionId = paymentIntent.id;
        const paymentMethod = paymentIntent.payment_method;
        const amount = paymentIntent.amount / 100;
        const currency = paymentIntent.currency;
        const paymentStatus = paymentIntent.status;
        const userName = currentUser?.name;
        const userEmail = currentUser?.email;

        const data = {
          transactionId,
          paymentMethod,
          amount,
          currency,
          paymentStatus,
          userName,
          userEmail,
          classesId: cartItem ? [cartItem] : cart,
          date: new Date(),
        };

        fetch(URL, {
          method: "POST",
          headers: {
            "content-Type": "application/json",
            authorization: `Bearee ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(data),
        })
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
            if (
              res.deletedResult.deletedCount > 0 &&
              res.paymenntResult.insertedId &&
              res.updatedResult.modifiedCount > 0
            ) {
              setSucceeded("Payment Successful , You have access now");
            } else {
              setSucceeded("Payment Failed, Please Try Again");
            }
          })
          .catch((err) => console.log(err));
      }
    }
  };

  return (
    <>
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          Payment Amount : <span className="text-secondary">{price}$</span>
        </h1>
        <form onSubmit={handelSubmit}>
          <CardElement
            options={{
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            }}
          ></CardElement>
          <button
            type="submit"
            disabled={isLoading || !stripe || !clientSecret}
          >
            Pay
          </button>
          {message && <p className="text-red-500">{message}</p>}
          {succeeded && <p className="text-green-500">{message}</p>}
        </form>
      </div>
    </>
  );
};

export default CheckoutPayment;
