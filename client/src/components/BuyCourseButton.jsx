import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { useCreateOrderMutation, useVerifyPaymentMutation } from "@/features/api/purchaseApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const BuyCourseButton = ({ courseId }) => {
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const navigate = useNavigate();

  const purchaseCourseHandler = async () => {
    try {
      const res = await createOrder(courseId).unwrap();

      if (res.free) {
        toast.success(res.message || "Enrolled successfully!");
        navigate(`/course-progress/${courseId}`);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load Razorpay. Check your internet connection.");
        return;
      }

      const options = {
        key: res.keyId,
        amount: res.amount,
        currency: res.currency,
        name: "eGuruKul",
        description: res.courseName,
        order_id: res.orderId,
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }).unwrap();
            toast.success("Payment successful! You are now enrolled.");
            navigate(`/course-progress/${courseId}`);
          } catch {
            toast.error("Payment verification failed. Contact support.");
          }
        },
        theme: { color: "#2563EB" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        toast.error("Payment failed. Please try again.");
      });
      rzp.open();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to initiate payment");
    }
  };

  return (
    <Button disabled={isLoading} onClick={purchaseCourseHandler} className="w-full">
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </>
      ) : (
        "Purchase Course"
      )}
    </Button>
  );
};

export default BuyCourseButton;
