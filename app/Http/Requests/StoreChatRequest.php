<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreChatRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    public function prepareForValidation()
    {
        $this->merge([
            'chatName' => trim($this->chatName),
            'chatParticipantName' => trim($this->chatUser),
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'chatName' => 'string|max:255',
            'chatParticipantName' => 'required|string|max:255',
            'isGroup' => 'required|boolean',
        ];
    }
}
