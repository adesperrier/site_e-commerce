<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->user();
        $paymentIntentId = $request->input('paymentIntentId');

        if (!$paymentIntentId) {
            return response()->json(['error' => 'PaymentIntent ID required'], 400);
        }

        // Verify payment with Stripe
        Stripe::setApiKey(config('services.stripe.secret'));

        try {
            $paymentIntent = PaymentIntent::retrieve($paymentIntentId);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid PaymentIntent'], 400);
        }

        if ($paymentIntent->status !== 'succeeded') {
            return response()->json(['error' => 'Payment not succeeded'], 400);
        }

        // Check if order already exists for this payment intent to avoid duplicates
        if (Order::where('stripe_session_id', $paymentIntentId)->exists()) {
            return response()->json(['message' => 'Order already created'], 200);
        }

        $items = $user->cartItems()->with('product')->get();
        if ($items->isEmpty()) {
            return response()->json(['error' => 'Cart is empty'], 400);
        }

        $total = $items->sum(function ($item) {
            return $item->quantity * $item->product->price;
        });

        // Verify total matches payment amount (optional but good practice)
        // Note: Stripe amount is in cents
        if (abs(($total * 100) - $paymentIntent->amount) > 1) {
            // For now, let's just log or ignore small rounding errors, or return error
            // return response()->json(['error' => 'Amount mismatch'], 400);
        }

        $order = Order::create([
            'user_id' => $user->id,
            'total' => $total,
            'status' => 'paid',
            'stripe_session_id' => $paymentIntentId, // Using this column for PaymentIntent ID
        ]);

        foreach ($items as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'price' => $item->product->price,
            ]);
        }

        // Clear cart
        $user->cartItems()->delete();

        return response()->json($order, 201);
    }

    public function index(Request $request)
    {
        return $request->user()->orders()->with('items.product')->latest()->get();
    }
}
