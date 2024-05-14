<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Task extends Model
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'task_category_id',
        'title',
        'description',
        'assigned_by',
        'assigned_to',
        'start_date',
        'end_date',
        'progress',
        'remark',
        'is_important',
        'due_date',
        'recurrence',
        'is_processed',
        'reminder',
        'status',
    ];

    public function logs()
    {
        return $this->hasMany(TaskLog::class);
    }

    public function category()
    {
        return $this->belongsTo(TaskCategory::class, 'task_category_id');
    }
    
    public function assignedBy()
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
