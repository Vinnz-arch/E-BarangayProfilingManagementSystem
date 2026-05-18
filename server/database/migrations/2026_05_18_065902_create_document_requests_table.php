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
        Schema::create('document_requests', function (Blueprint $table) {
            $table->id();
            
            // Resident Relationship
            $table->foreignId('resident_id')
                ->constrained('residents')
                ->onDelete('cascade');

            // Request Details
            $table->string('document_type');
            $table->text('purpose');
            $table->string('status')->default('Pending'); // Pending, Processing, Ready for Pickup, Claimed, Rejected
            $table->string('tracking_number')->unique();
            $table->text('remarks')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_requests');
    }
};
