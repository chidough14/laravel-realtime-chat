<?php

use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('online', function ($user) {
    // return (int) $user->id === (int) $id;
    return $user ? new UserResource($user) : null;
});
