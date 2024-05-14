<?php

namespace App\Http\Controllers;

use Exception;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Task;
use App\Models\TaskLog;
use App\Models\TaskCategory;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class TaskApiController extends Controller
{
    private function transformTaskData($taskData){
        $tasks = [];
        foreach ($taskData as $task) {
            $tasks[] = [
                'id' => $task->id,
                'task_category' => $task->category->name ?? '',
                'title' => $task->title,
                'description' => $task->description,
                'assigned_by' => $task->assignedBy->name ?? '',
                'assigned_to' => $task->assignedTo->name ?? '',
                'start_date' => $task->start_date,
                'end_date' => $task->end_date,
                'status' => $task->status,
                'progress' => $task->progress,
                'remark' => $task->remark,
                'is_important' => $task->is_important,
            ];
        }
        return $tasks;
    }

    public function index()
    {
        try {
            $taskData = Task::with(['category', 'assignedBy', 'assignedTo'])->latest()->paginate(5);
            $tasks = $this->transformTaskData($taskData);
            return response()->json(['taskData' => $tasks, 'success' => true]);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage(), 'success' => false], 500);
        }
    }

    public function myTask(Request $request)
    {
        try {
            $taskData = Task::where('assigned_to', $request->input('id'))->latest()->get();
            $tasks = $this->transformTaskData($taskData);
            return response()->json(['taskData' => $tasks, 'success' => true]);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage(), 'success' => false], 500);
        }
    }

    public function impTask(Request $request)
    {
        try {
            $taskData = Task::where('assigned_to', $request->input('id'))->where('is_important', 1)->latest()->get();
            $tasks = $this->transformTaskData($taskData);
            return response()->json(['taskData' => $tasks, 'success' => true]);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage(), 'success' => false], 500);
        }
    }


    public function taskCategory()
    {
        $categories = TaskCategory::all();
        return response()->json(['categories' => $categories, 'success' => true]);
    }

    public function categoryList(Request $request)
    {
        $categories = TaskCategory::select('task_categories.id', 'task_categories.name')
            ->join('tasks', 'task_categories.id', '=', 'tasks.task_category_id')
            ->where('tasks.assigned_to', $request->input('id'))
            ->orderBy('task_categories.name')
            ->distinct()
            ->get();
    
        foreach ($categories as $category) {
            $category->task_count = Task::where('task_category_id', $category->id)->where('assigned_to', 4)->count();
            $category->tasks = Task::select('title')->where('task_category_id', $category->id)->where('assigned_to', 4)->get();
        }
    
        return response()->json(['categories' => $categories, 'success' => true]);
    }
    

    public function storeCategory(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|max:50',
            ]);

            TaskCategory::create([
                'name' => $request->name,
            ]);

            return response()->json(['success' => true, 'message' => 'Category created successfully']);
        } catch (ValidationException $e) {
            $errors = $e->validator->getMessageBag()->toArray();
            return response()->json(['success' => false, 'message' => 'Failed to create category', 'error' => $errors], 422);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to create category', 'error' => $e->getMessage()], 400);
        }
    }

    public function store(Request $request)
    {
        try {
            $start_date = Carbon::parse($request->input('start_date'))->format('Y-m-d') . ' ' . Carbon::now()->format('H:i:s');
            $end_date = Carbon::parse($request->input('end_date'))->format('Y-m-d') . ' 18:00:00';

            $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'start_date' => 'required|after_or_equal:today',
                'end_date' => 'required|date|after_or_equal:start_date',
            ]);

            $task = Task::create([
                'task_category_id' => $request->task_category,
                'title' => $request->title,
                'description' => $request->description,
                'assigned_by' => $request->user_id,
                'assigned_to' => $request->asignee,
                'start_date' => $start_date,
                'end_date' => $end_date,
                'expiration_time' => $request->expiration_time,
                'due_date' => $request->due_date,
                'recurrence' => $request->recurrence,
                'reminder' => $request->reminder,
                'status' => 'Pending',
            ]);

            return response()->json(['success' => true, 'message' => 'Task created successfully']);
        } catch (ValidationException $e) {
            $errors = $e->validator->getMessageBag()->toArray();
            return response()->json(['success' => false, 'message' => 'Failed to create task', 'error' => $errors], 422);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to create task', 'error' => $e->getMessage()], 400);
        }
    }

    public function update(Request $request)
    {
        try {
            $request->validate([
                'status' => 'required',
                'progress' => 'required',
            ]);

            Task::where('id', $request->input('id'))->update([
                'status' => $request->input('status'),
                'progress' => $request->input('progress'),
                'remark' => $request->input('remark'),
                'assigned_to' => $request->input('assigned_to'),
            ]);

            TaskLog::create([
                'task_id' => $request->input('id'),
                'status' => $request->input('status'),
                'progress' => $request->input('progress'),
                'remark' => $request->input('remark')
            ]);

            return response()->json(['success' => true, 'message' => 'Task updated successfully']);
        } catch (ValidationException $e) {
            $errors = $e->validator->getMessageBag()->toArray();
            return response()->json(['success' => false, 'message' => 'Failed to update task', 'error' => $errors], 422);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to update task', 'error' => $e->getMessage()], 400);
        }
    }

    public function markImportant(Request $request)
    {
        try {
            Task::where('id', $request->input('id'))->update(['is_important' => 1]);
            return response()->json(['success' => true, 'message' => 'Task Marked as important successfully']);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to mark as important', 'error' => $e->getMessage()], 400);
        }
    }

    public function unmarkImportant(Request $request)
    {
        try {
            Task::where('id', $request->input('id'))->update(['is_important' => 0]);
            return response()->json(['success' => true, 'message' => 'Removed from Important successfully']);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to Removed from Important', 'error' => $e->getMessage()], 400);
        }
    }
}
