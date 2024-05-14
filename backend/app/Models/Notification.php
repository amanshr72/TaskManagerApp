<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'from_user_id',
        'message',
        'read',
        'due',
        'reminder'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
