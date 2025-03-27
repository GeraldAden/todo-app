export interface Todo {
    id: number;
    description: string;
    status: 'new' | 'started' | 'done';
    deadline_date: string;
    created_at: string;
}

export interface TodoCreate {
    description: string;
    deadline_date: string;
}