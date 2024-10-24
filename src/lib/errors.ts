import { NextResponse } from "next/server";

export class ApiError extends Error {
    constructor(
        public message: string,
        public status: number = 500
    ) {
        super(message)
    }
}

export function handleApiError(error: unknown): NextResponse {
    if (error instanceof ApiError) {
        return NextResponse.json(
            { error: error.message },
            { status: error.status }
        )
    }

    console.error('Erro não tratado:', error)
    return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
    )
}