import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        // First, submit the payment to Stripe
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required', // Avoid redirecting if possible and handle it manually
        });

        if (error) {
            if (error.type === "card_error" || error.type === "validation_error") {
                setMessage(error.message);
            } else {
                setMessage("Une erreur inattendue s'est produite." + error.message);
            }
            setIsLoading(false);
            return;
        }

        // If payment succeeded, create order in backend
        if (paymentIntent && paymentIntent.status === 'succeeded') {
            try {
                await api.post('/orders', {
                    paymentIntentId: paymentIntent.id
                });
                // Navigate to success page
                navigate('/success');
            } catch (err) {
                console.error("Error creating order:", err);
                setMessage("Le paiement a réussi mais la confirmation de la commande a échoué. Veuillez contacter le support.");
                // Optionally navigate to success anyway or show specific error
                // navigate('/success'); 
            }
        } else {
            // Handle other statuses if necessary (e.g. processing)
            setMessage("Statut du paiement : " + (paymentIntent ? paymentIntent.status : "Inconnu"));
        }

        setIsLoading(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement id="payment-element" />
            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="w-full bg-gray-900 text-white font-semibold py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
                <span id="button-text">
                    {isLoading ? "Traitement en cours..." : "Payer maintenant"}
                </span>
            </button>
            {message && <div id="payment-message" className="text-red-500 text-sm mt-2">{message}</div>}
        </form>
    );
}
