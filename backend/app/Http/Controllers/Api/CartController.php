<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    public function index(Request $request)
{
    return $request->user()->cartItems()->with('product')->get();
}

public function store(Request $request)
{
    $data = $request->validate([
        'product_id' => 'required|exists:products,id',
        'quantity'   => 'integer|min:1'
    ]);

    $qty = $data['quantity'] ?? 1;

    $cartItem = CartItem::where('user_id', $request->user()->id)
        ->where('product_id', $data['product_id'])
        ->first();

    if ($cartItem) {
        $cartItem->update(['quantity' => $cartItem->quantity + $qty]);
    } else {
        $cartItem = CartItem::create([
            'user_id'    => $request->user()->id,
            'product_id' => $data['product_id'],
            'quantity'   => $qty,
        ]);
    }

    return $cartItem->load('product');
}

public function destroy(CartItem $cartItem, Request $request)
{
    if ($cartItem->user_id !== $request->user()->id) abort(403);
    $cartItem->delete();
    return response()->json(null, 204);
}

public function update(CartItem $cartItem, Request $request)
{
    if ($cartItem->user_id !== $request->user()->id) abort(403);
    $data = $request->validate(['quantity' => 'required|integer|min:1']);
    $cartItem->update(['quantity' => $data['quantity']]);
    return $cartItem->load('product');
}
}
