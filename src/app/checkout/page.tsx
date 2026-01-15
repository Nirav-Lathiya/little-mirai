"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShoppingCart,
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  MapPin,
  Smartphone,
  Banknote,
  CheckCircle,
  Building,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

// Extend window interface for Razorpay
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal?: {
    ondismiss: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: { error: { description: string } }) => void) => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface Address {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "razorpay_card",
    name: "Credit/Debit Card",
    description: "Pay securely with your card",
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    id: "razorpay_upi",
    name: "UPI",
    description: "Pay with UPI apps like GPay, PhonePe, Paytm",
    icon: <Smartphone className="w-5 h-5" />,
  },
  {
    id: "razorpay_netbanking",
    name: "Net Banking",
    description: "Pay through your bank account",
    icon: <Building className="w-5 h-5" />,
  },
  {
    id: "razorpay_wallet",
    name: "Digital Wallets",
    description: "Pay with Paytm, Mobikwik, Ola Money",
    icon: <Banknote className="w-5 h-5" />,
  },
  {
    id: "cod",
    name: "Cash on Delivery",
    description: "Pay when you receive your order",
    icon: <Truck className="w-5 h-5" />,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { state, dispatch } = useCart();
  const [step, setStep] = useState<"shipping" | "payment" | "review">(
    "shipping"
  );
  const [shippingAddress, setShippingAddress] = useState<Address>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });
  const [, setBillingAddress] = useState<Address>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("razorpay_card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Calculate totals
  const subtotal = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  // Load Razorpay script
  useEffect(() => {
    const checkRazorpayLoaded = (): boolean => {
      if (window.Razorpay) {
        setRazorpayLoaded(true);
        return true;
      }
      return false;
    };

    // Check immediately
    if (checkRazorpayLoaded()) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      setRazorpayLoaded(true);
    };

    script.onerror = () => {
      console.error("Failed to load Razorpay script");
      setRazorpayLoaded(false);
    };

    document.body.appendChild(script);

    return () => {
      // Only remove the script if it was added by this component
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (state.items.length === 0 && !orderPlaced) {
      router.push("/");
    }
  }, [state.items.length, router, orderPlaced]);

  // Copy shipping to billing when checkbox is checked
  const billingAddress = sameAsShipping
    ? shippingAddress
    : {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
      };

  const handleShippingSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePaymentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep("review");
  };

  const processOrder = useCallback(async () => {
    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Clear cart and show success
    dispatch({ type: "CLEAR_CART" });
    setOrderPlaced(true);
    setIsProcessing(false);
  }, [dispatch]);

  const initializeRazorpayPayment = useCallback(async () => {
    // Check if Razorpay is loaded
    if (!razorpayLoaded || !window.Razorpay) {
      console.error("Razorpay is not loaded yet");
      alert("Payment system is loading. Please try again in a moment.");
      setIsProcessing(false);
      return;
    }

    // Validate required fields
    if (!shippingAddress.firstName || !shippingAddress.email || !shippingAddress.phone) {
      alert("Please fill in all required shipping information");
      setIsProcessing(false);
      setStep("shipping");
      return;
    }

    // Get Razorpay key from environment variables
    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    if (!razorpayKey || razorpayKey === "rzp_test_your_key_here") {
      alert("Payment system is not configured properly. Please contact support.");
      setIsProcessing(false);
      return;
    }

    // This would integrate with your backend to create Razorpay order
    const options = {
      key: razorpayKey,
      amount: Math.round(total * 100), // Razorpay expects amount in paisa, ensure it's an integer
      currency: "INR",
      name: "Little Mirai",
      description: "Baby Clothing Purchase",
      order_id: `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, // This should come from your backend
      handler: function (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) {
        console.log("Payment successful:", response);
        // Handle successful payment
        processOrder();
      },
      prefill: {
        name: `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim(),
        email: shippingAddress.email,
        contact: shippingAddress.phone,
      },
      theme: {
        color: "#8b5cf6", // Primary color
      },
      modal: {
        ondismiss: function() {
          console.log("Payment modal dismissed");
          setIsProcessing(false);
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);

      // Add event listeners
      rzp.on('payment.failed', function (response: { error: { description: string } }) {
        console.error("Payment failed:", response.error);
        alert(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });

      rzp.open();
    } catch (error) {
      console.error("Razorpay initialization failed:", error);
      alert("Payment initialization failed. Please try again.");
      setIsProcessing(false);
    }
  }, [total, shippingAddress, processOrder, razorpayLoaded]);

  const handlePlaceOrder = async () => {
    // Validate cart is not empty
    if (state.items.length === 0) {
      alert("Your cart is empty");
      router.push("/");
      return;
    }

    // Validate shipping information
    if (!shippingAddress.firstName || !shippingAddress.lastName || !shippingAddress.email ||
        !shippingAddress.phone || !shippingAddress.address || !shippingAddress.city ||
        !shippingAddress.state || !shippingAddress.pincode) {
      alert("Please fill in all required shipping information");
      setStep("shipping");
      return;
    }

    setIsProcessing(true);

    try {
      if (selectedPaymentMethod.startsWith('razorpay_')) {
        // Check if Razorpay is available
        if (!razorpayLoaded) {
          alert("Payment system is still loading. Please wait a moment and try again.");
          setIsProcessing(false);
          return;
        }
        // Initialize Razorpay payment
        await initializeRazorpayPayment();
      } else {
        // Handle COD or other payment methods
        await processOrder();
      }
    } catch (error) {
      console.error('Payment failed:', error);
      alert("An error occurred during payment. Please try again.");
      setIsProcessing(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Thank you for your purchase. Your adorable Little Mirai items will
              be delivered soon.
            </p>
            <div className="space-y-4">
              <Button asChild size="lg">
                <Link href="/">Continue Shopping</Link>
              </Button>
              <p className="text-sm text-muted-foreground">
                Order confirmation has been sent to your email.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Shopping
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              <span className="font-medium">Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="flex items-center mb-8">
              <div
                className={`flex items-center ${
                  step === "shipping"
                    ? "text-primary"
                    : step === "payment" || step === "review"
                    ? "text-green-600"
                    : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step === "shipping"
                      ? "border-primary bg-primary text-primary-foreground"
                      : step === "payment" || step === "review"
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-muted-foreground"
                  }`}
                >
                  1
                </div>
                <span className="ml-2 font-medium">Shipping</span>
              </div>
              <div
                className={`w-12 h-0.5 mx-4 ${
                  step === "payment" || step === "review"
                    ? "bg-green-600"
                    : "bg-muted"
                }`}
              />
              <div
                className={`flex items-center ${
                  step === "payment"
                    ? "text-primary"
                    : step === "review"
                    ? "text-green-600"
                    : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step === "payment"
                      ? "border-primary bg-primary text-primary-foreground"
                      : step === "review"
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-muted-foreground"
                  }`}
                >
                  2
                </div>
                <span className="ml-2 font-medium">Payment</span>
              </div>
              <div
                className={`w-12 h-0.5 mx-4 ${
                  step === "review" ? "bg-green-600" : "bg-muted"
                }`}
              />
              <div
                className={`flex items-center ${
                  step === "review" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step === "review"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground"
                  }`}
                >
                  3
                </div>
                <span className="ml-2 font-medium">Review</span>
              </div>
            </div>

            {/* Shipping Address Form */}
            {step === "shipping" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleShippingSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={shippingAddress.firstName}
                          onChange={(e) =>
                            setShippingAddress((prev) => ({
                              ...prev,
                              firstName: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={shippingAddress.lastName}
                          onChange={(e) =>
                            setShippingAddress((prev) => ({
                              ...prev,
                              lastName: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={shippingAddress.email}
                          onChange={(e) =>
                            setShippingAddress((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={shippingAddress.phone}
                          onChange={(e) =>
                            setShippingAddress((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Textarea
                        id="address"
                        value={shippingAddress.address}
                        onChange={(e) =>
                          setShippingAddress((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        placeholder="Street address, apartment, suite, etc."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={shippingAddress.city}
                          onChange={(e) =>
                            setShippingAddress((prev) => ({
                              ...prev,
                              city: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Select
                          value={shippingAddress.state}
                          onValueChange={(value) =>
                            setShippingAddress((prev) => ({
                              ...prev,
                              state: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Maharashtra">
                              Maharashtra
                            </SelectItem>
                            <SelectItem value="Delhi">Delhi</SelectItem>
                            <SelectItem value="Karnataka">Karnataka</SelectItem>
                            <SelectItem value="Gujarat">Gujarat</SelectItem>
                            <SelectItem value="Tamil Nadu">
                              Tamil Nadu
                            </SelectItem>
                            <SelectItem value="Uttar Pradesh">
                              Uttar Pradesh
                            </SelectItem>
                            <SelectItem value="West Bengal">
                              West Bengal
                            </SelectItem>
                            <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                            <SelectItem value="Punjab">Punjab</SelectItem>
                            <SelectItem value="Haryana">Haryana</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="pincode">Pincode *</Label>
                        <Input
                          id="pincode"
                          value={shippingAddress.pincode}
                          onChange={(e) =>
                            setShippingAddress((prev) => ({
                              ...prev,
                              pincode: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sameAddress"
                        checked={sameAsShipping}
                        onCheckedChange={(checked: boolean) =>
                          setSameAsShipping(checked)
                        }
                      />
                      <Label htmlFor="sameAddress">
                        Billing address is the same as shipping address
                      </Label>
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      Continue to Payment
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Payment Method Selection */}
            {step === "payment" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePaymentSubmit}>
                    <RadioGroup
                      value={selectedPaymentMethod}
                      onValueChange={setSelectedPaymentMethod}
                    >
                      <div className="space-y-4">
                        {paymentMethods.map((method) => (
                          <div key={method.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                            <RadioGroupItem
                              value={method.id}
                              id={method.id}
                              disabled={method.id.startsWith('razorpay_') && !razorpayLoaded}
                            />
                            <div className="flex items-center gap-3 flex-1">
                              {method.icon}
                              <div>
                                <Label
                                  htmlFor={method.id}
                                  className={`font-medium cursor-pointer ${method.id.startsWith('razorpay_') && !razorpayLoaded ? 'text-muted-foreground' : ''}`}
                                >
                                  {method.name}
                                  {method.id.startsWith('razorpay_') && !razorpayLoaded && (
                                    <span className="text-xs text-muted-foreground ml-2">(Loading...)</span>
                                  )}
                                </Label>
                                <p className="text-sm text-muted-foreground">{method.description}</p>
                                {method.id.startsWith('razorpay_') && !razorpayLoaded && (
                                  <p className="text-xs text-amber-600 mt-1">Payment system is loading...</p>
                                )}
                              </div>
                            </div>
                            {method.id === 'cod' && (
                              <Badge variant="secondary">Free</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </RadioGroup>

                    <div className="flex gap-4 mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep("shipping")}
                        className="flex-1"
                      >
                        Back to Shipping
                      </Button>
                      <Button type="submit" className="flex-1">
                        Review Order
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Order Review */}
            {step === "review" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Review</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Shipping Address</h4>
                      <p className="text-sm text-muted-foreground">
                        {shippingAddress.firstName} {shippingAddress.lastName}
                        <br />
                        {shippingAddress.address}
                        <br />
                        {shippingAddress.city}, {shippingAddress.state}{" "}
                        {shippingAddress.pincode}
                        <br />
                        {shippingAddress.email} | {shippingAddress.phone}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-2">Payment Method</h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        {
                          paymentMethods.find(
                            (m) => m.id === selectedPaymentMethod
                          )?.icon
                        }
                        {
                          paymentMethods.find(
                            (m) => m.id === selectedPaymentMethod
                          )?.name
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep("payment")}
                    className="flex-1"
                  >
                    Back to Payment
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing || (selectedPaymentMethod.startsWith('razorpay_') && !razorpayLoaded)}
                    className="flex-1"
                    size="lg"
                  >
                    {isProcessing
                      ? 'Processing...'
                      : selectedPaymentMethod.startsWith('razorpay_') && !razorpayLoaded
                        ? 'Loading Payment...'
                        : `Place Order - ₹${total.toFixed(2)}`
                    }
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {state.items.map((item) => (
                    <div
                      key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                      className="flex gap-3"
                    >
                      <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Size: {item.selectedSize} | Color:{" "}
                          {item.selectedColor}
                        </p>
                        <p className="text-sm font-medium">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600" : ""}>
                      {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (GST 18%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Free shipping notice */}
                {subtotal < 500 && (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Add ₹{(500 - subtotal).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}

                {/* Security badges */}
                <div className="flex items-center justify-center gap-4 pt-4 border-t">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Shield className="w-4 h-4" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Truck className="w-4 h-4" />
                    <span>Fast Delivery</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
