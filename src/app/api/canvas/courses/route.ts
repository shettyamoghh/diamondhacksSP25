// src/app/api/canvas/courses/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    const { CANVAS_BASE_URL, CANVAS_TOKEN } = process.env;
    if (!CANVAS_BASE_URL || !CANVAS_TOKEN) {
        return NextResponse.json({ error: 'Missing Canvas config' }, { status: 500 });
    }

    try {
        // Include teachers so that each course object contains teacher info.
        const url = `${CANVAS_BASE_URL}/api/v1/courses?per_page=100&include[]=teachers`;
        const canvasResp = await fetch(url, {
            headers: {
                Authorization: `Bearer ${CANVAS_TOKEN}`,
            },
        });

        if (!canvasResp.ok) {
            const errorText = await canvasResp.text();
            return NextResponse.json({ error: `Canvas error: ${errorText}` }, { status: canvasResp.status });
        }

        const courses = await canvasResp.json();
        return NextResponse.json(courses, { status: 200 });
    } catch (err) {
        console.error('Canvas fetch error:', err);
        return NextResponse.json({ error: 'Server error fetching Canvas courses' }, { status: 500 });
    }
}
