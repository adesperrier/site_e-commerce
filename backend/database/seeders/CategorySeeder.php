<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        Category::insert([
            ['name' => 'Freeride', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Powder',   'created_at' => now(), 'updated_at' => now()],
            ['name' => 'All-Mountain', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}