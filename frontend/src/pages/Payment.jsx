import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import CheckoutForm from "../components/CheckoutForm";

const stripePromise = loadStripe("pk_test_51SypEhQyNl73BAoS7ttAnlFiUnc4HPHfRzuHwCa0Nw3VKGqQYL78SuVAiq3vVfljnCXIvZTfvgKm6GWNfelHHFLx00hNOemRhL");

export default function Payment() {
    const [clientSecret, setClientSecret] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        if (!localStorage.getItem("token")) {
            navigate("/login");
            return;
        }

        // Create PaymentIntent as soon as the page loads
        api.post("/create-payment-intent")
            .then((res) => {
                if (res.data.clientSecret) {
                    setClientSecret(res.data.clientSecret);
                } else {
                    // If cart is empty or total is 0, backend might return error
                    setError("Impossible d'initialiser le paiement. Votre panier est peut-être vide.");
                }
            })
            .catch((err) => {
                console.error("Error creating payment intent:", err);
                setError("Erreur lors de l'initialisation du paiement.");
            });
    }, [navigate]);

    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Paiement sécurisé
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {error ? (
                        <div className="text-red-500 text-center">{error}</div>
                    ) : (
                        clientSecret && (
                            <Elements options={options} stripe={stripePromise}>
                                <CheckoutForm />
                            </Elements>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
