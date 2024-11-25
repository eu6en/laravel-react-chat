<?php
// app/Http/Requests/StoreChatRequest.php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreChatRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'chatParticipantName' => 'required|string|max:255',
            'chatName' => 'nullable|string|max:255',
            'isGroup' => 'required|boolean',
        ];
    }

    public function prepareForValidation()
    {
        $this->merge([
            'chatParticipantName' => trim($this->chatParticipantName),
            'chatName' => $this->chatName ? trim($this->chatName) : null,
        ]);
    }
}
