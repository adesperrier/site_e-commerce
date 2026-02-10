<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class OrderController extends Controller
{
    public function checkout(Request $request)
    {
    $user = $request->user();
    $items = $user->cartItems()->with('product')->get();

    if ($items->isEmpty()) {
        return response()->json(['error' => 'Panier vide'], 400);
    }

    $total = $items->sum(function ($item) { return $item->quantity * $item->product->price; });

    $order = Order::create([
        'user_id' => $user->id,
        'total'   => $total,
        'status'  => 'pending',
    ]);

    foreach ($items as $item) {
        OrderItem::create([
            'order_id'   => $order->id,
            'product_id' => $item->product_id,
            'quantity'   => $item->quantity,
            'price'      => $item->product->price,
        ]);
    }

    // Stripe
    Stripe::setApiKey(env('STRIPE_SECRET'));

    $lineItems = $items->map(function ($item) {
        return [
            'price_data' => [
                'currency'     => 'chf',
                'product_data' => ['name' => $item->product->name],
                'unit_amount'  => (int)($item->product->price * 100),
            ],
            'quantity' => $item->quantity,
        ];
    })->toArray();

    $session = Session::create([
        'line_items'            => $lineItems,
        'mode'                  => 'payment',
        'success_url'           => 'http://localhost:5173/success?order=' . $order->id,
        'cancel_url'            => 'http://localhost:5173/cart',
        'metadata'              => ['order_id' => $order->id],
    ]);

    $order->update(['stripe_session_id' => $session->id]);

    $user->cartItems()->delete();   // vide le panier

    return response()->json(['id' => $session->id, 'url' => $session->url]);
}

    public function index(Request $request)
    {
        return $request->user()->orders()->with('items.product')->latest()->get();
    }
}
