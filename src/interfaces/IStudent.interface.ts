export interface IStudent {
    id: number;
    document: {
        type: string;
        value: string;
    };
    name: string;
    lastname: string;
    email: string;
    password: string;
    created_at: Date;
    updated_at: Date;
}