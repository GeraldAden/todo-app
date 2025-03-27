import axios from 'axios';
import { Todo, TodoCreate } from '../types/todo';

const API_URL = 'http://localhost:8000';

export const todoService = {
    async getAllTodos(status?: string, orderByDeadline = false) {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (orderByDeadline) params.append('order_by_deadline', 'true');
        const response = await axios.get<Todo[]>(`${API_URL}/todos`, { params });
        return response.data;
    },

    async createTodo(todo: TodoCreate) {
        const response = await axios.post<Todo>(`${API_URL}/todos`, todo);
        return response.data;
    },

    async updateTodoStatus(id: number, status: string) {
        const response = await axios.put<Todo>(`${API_URL}/todos/${id}/status`, { status });
        return response.data;
    },

    async deleteTodo(id: number) {
        await axios.delete(`${API_URL}/todos/${id}`);
    }
};