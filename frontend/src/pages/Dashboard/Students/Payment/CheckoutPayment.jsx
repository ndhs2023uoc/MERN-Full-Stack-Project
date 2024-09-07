import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useUser from "../../../../hooks/useUser";
import { Navigate } from "react-router-dom";

const CheckoutPayment = ({ price, cartItem }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { currentUser, isLoading } = useUser();
  const [clientSecret, setClientSecret] = useState("");
  const [succeeded, setSucceeded] = useState("");
  const [message, setMessage] = useState("");
  const [cart, setCart] = useState([]);
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);

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

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
  };

  const handleSubmit = async (event) => {
    setMessage("");
    event.preventDefault();
    if (!stripe) {
      return;
    }
    const card = elements.getElement(CardElement);
    if (card === null) {
      return;
    }

    setProcessing(true);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("[error]", error);
      setMessage(error.message);
      setProcessing(false);
      return;
    } else {
      console.log("PaymentMethod", paymentMethod);
    }

    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: currentUser?.name || "unknown",
            email: currentUser?.email || "Anonymous",
          },
        },
      });

    if (confirmError) {
      console.log("[Confirm Error]", confirmError);
      setMessage(confirmError.message);
      setProcessing(false);
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
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(data),
        })
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
            if (
              res.deletedResult.deletedCount > 0 &&
              res.paymentResult.insertedId &&
              res.updatedResult.modifiedCount > 0
            ) {
              setSucceeded("Payment Successful, You have access now");
              setMessage("Payment Successful, You have access now");
            } else {
              setSucceeded("Payment Failed, Please Try Again");
              setMessage("Payment Failed, Please Try Again");
            }
            setProcessing(false);
          })
          .catch((err) => {
            console.log(err);
            setMessage("An error occurred. Please try again.");
            setProcessing(false);
          });
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Payment Amount: <span className="text-secondary">${price}</span>
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <CardElement
            options={{
              style: {
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
              },
            }}
            onChange={handleCardChange}
          />
        </div>
        {cardComplete && (
          <button
            type="submit"
            disabled={!stripe || !clientSecret || processing}
            className="w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300 disabled:opacity-50"
          >
            {processing ? "Processing..." : "Pay Now"}
          </button>
        )}
      </form>
      {message && (
        <p
          className={`mt-4 text-center ${
            message.includes("successful") ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default CheckoutPayment;
