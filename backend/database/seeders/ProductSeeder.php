<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Black Crows Corvus 2026',
                'description' => 'Le ski freeride le plus polyvalent du marché',
                'price' => 749.00,
                'image' => 'https://picsum.photos/id/1015/800/600',
                'category_id' => 1,
            ],
            [
                'name' => 'Faction Dancer 2.0',
                'description' => 'Jib, butter, park et big mountain',
                'price' => 629.00,
                'image' => 'https://picsum.photos/id/106/800/600',
                'category_id' => 1,
            ],
            [
                'name' => 'Line Honey Bee',
                'description' => 'Freeride femme ultra léger',
                'price' => 599.00,
                'image' => 'https://picsum.photos/id/180/800/600',
                'category_id' => 1,
            ],
            [
                'name' => 'Atomic Bent Chetler 120',
                'description' => 'Le roi du powder',
                'price' => 899.00,
                'image' => 'https://picsum.photos/id/201/800/600',
                'category_id' => 2,
            ],
            [
                'name' => 'Rossignol Sender Free 110',
                'description' => 'All-mountain freeride',
                'price' => 679.00,
                'image' => 'https://picsum.photos/id/870/800/600',
                'category_id' => 3,
            ],
        ];

        foreach ($products as $p) {
            Product::create($p);
        }
    }
}