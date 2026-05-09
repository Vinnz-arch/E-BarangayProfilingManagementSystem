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
        Schema::create('residents', function (Blueprint $table) {
            $table->id();

            // Sitio Relationship
            $table->foreignId('sitio_id')
                ->constrained('sitios')
                ->onDelete('cascade');

            // Personal Information
            $table->string('last_name');
            $table->string('first_name');
            $table->string('middle_initial')->nullable();

            // Resident Details
            $table->string('household_type');
            $table->string('gender');
            $table->date('date_of_birth');
            $table->string('citizenship');
            $table->string('civil_status');
            $table->string('occupation')->nullable();
            $table->string('school_attainment')->nullable();
            $table->text('skills')->nullable();
            $table->string('blood_type')->nullable();

            // Government Programs / Status
            $table->boolean('is_4ps')->default(false);
            $table->boolean('is_pwd')->default(false);
            $table->boolean('is_solo_parent')->default(false);
            $table->boolean('is_senior_citizen')->default(false);


            $table->timestamps();

            // Soft Delete
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('residents');
    }
};
