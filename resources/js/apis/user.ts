import { UserResource } from "@/Types/Controllers/UserController";
import axios from "axios";

type Success = { _t: 'success', result: UserResource[] };
type InvalidUserNameError = { _t: 'invalid-user-name-error', error: Error };
type EmptyResponseError = { _t: 'empty-response-error', error: Error };
type AxiosFetchError = { _t: 'axios-fetch-error', error: Error };
type UnknownError = { _t: 'unknown-error', error: Error };
type fetchUsersByName =
    | Success
    | InvalidUserNameError
    | EmptyResponseError
    | AxiosFetchError
    | UnknownError;

export async function fetchUsersByName(userName: string): Promise<fetchUsersByName> {
    if (userName.trim() === '') {
        return { _t: 'invalid-user-name-error', error: new Error('User name cannot be empty') };
    }

    try {
        const response = await axios.post('/api/users/search', { userName: userName });
        if (response.data.length === 0) {
            return { _t: 'empty-response-error', error: new Error('No users found') };
        }
        return { _t: 'success', result: response.data as UserResource[] };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return { _t: 'axios-fetch-error', error: new Error('An Axios error occured while fetching users by name. Please try again later.') };
        } else {
            return { _t: 'unknown-error', error: error instanceof Error ? error : new Error(`An unknown error occurred while fetching users by name. Please try again later.\n${String(error)}`) };
        }
    }
}
