"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ResumeData, DEFAULT_RESUME_DATA } from './types';

interface ResumeContextType {
    data: ResumeData;
    updateData: (updates: Partial<ResumeData> | ((prev: ResumeData) => ResumeData)) => void;
    loadSample: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: React.ReactNode }) {
    const [data, setData] = useState<ResumeData>(DEFAULT_RESUME_DATA);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('resumeBuilderData');
        if (saved) {
            try {
                setData(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse resume data", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('resumeBuilderData', JSON.stringify(data));
        }
    }, [data, isLoaded]);

    const updateData = useCallback((updates: Partial<ResumeData> | ((prev: ResumeData) => ResumeData)) => {
        setData(prev => {
            if (typeof updates === 'function') {
                return updates(prev);
            }
            return { ...prev, ...updates };
        });
    }, []);

    const loadSample = useCallback(() => {
        import('./engine').then(m => {
            setData(m.SAMPLE_DATA);
        });
    }, []);

    return (
        <ResumeContext.Provider value={{ data, updateData, loadSample }}>
            {children}
        </ResumeContext.Provider>
    );
}

export function useResume() {
    const context = useContext(ResumeContext);
    if (!context) throw new Error("useResume must be used within a ResumeProvider");
    return context;
}
