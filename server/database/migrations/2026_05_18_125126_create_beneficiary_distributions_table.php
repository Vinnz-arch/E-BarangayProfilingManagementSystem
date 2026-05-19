<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('beneficiary_distributions', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('target_group'); // e.g., 'senior_citizen', 'pwd', '4ps', 'solo_parent'
            $table->dateTime('distribution_date');
            $table->string('location');
            $table->string('status')->default('Draft'); // Draft, Notifying, Completed
            $table->foreignId('author_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('beneficiary_distributions');
    }
};
