import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  FormGroup,
  Button,
} from "shards-react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useCheckout } from "../checkout";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#495057",
      fontFamily: "inherit",
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#6c757d",
      },
    },
    invalid: {
      color: "#dc3545",
      iconColor: "#dc3545",
    },
  },
};

const PayPage = () => {
  const stripe = useStripe();
  const elements = useElements();

  const { checkoutSecret, billingDetails } = useCheckout();

  const handlePayment = async () => {
    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmCardPayment(checkoutSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: billingDetails,
      },
      setup_future_usage: "off_session",
    });

    if (result.error) {
      alert(result.error.message);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === "succeeded") {
        alert("Payment successful");
      }
    }
  };

  return (
    <Card className="app-card">
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
      </CardHeader>
      <CardBody>
        <FormGroup>
          <div>
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </FormGroup>
        <Button
          disabled={!stripe}
          block
          className="mt-4"
          onClick={handlePayment}
        >
          <span className="font-weight-bold">Pay</span>
        </Button>
      </CardBody>
    </Card>
  );
};

export default PayPage;
