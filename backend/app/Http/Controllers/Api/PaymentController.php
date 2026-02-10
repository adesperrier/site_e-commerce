<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class PaymentController extends Controller
{
    public function createPaymentIntent(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        // Calculate total amount from cart
        $cartItems = $user->cartItems()->with('product')->get();
        $total = 0;

        foreach ($cartItems as $item) {
            $total += $item->quantity * $item->product->price;
        }

        if ($total <= 0) {
            return response()->json(['error' => 'Cart is empty or invalid total'], 400);
        }

        // Stripe expects amount in cents
        $amountInCents = (int) ($total * 100);

        try {
            // Use the secret key from configuration
            Stripe::setApiKey(config('services.stripe.secret'));

            $paymentIntent = PaymentIntent::create([
                'amount' => $amountInCents,
                'currency' => 'eur',
                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
                'metadata' => [
                    'user_id' => $user->id,
                ],
            ]);

            return response()->json([
                'clientSecret' => $paymentIntent->client_secret,
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
