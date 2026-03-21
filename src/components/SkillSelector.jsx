
import React, { useState, useEffect, useRef } from 'react';
import { skillsApi } from '../api/skills.api';

const SkillSelector = ({ 
    selectedSkills = [], 
    onChange, 
    placeholder = "Type a skill...",
    variant = "blue" // "blue", "fuchsia", "cyan"
}) => {
    const [allSkills, setAllSkills] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef(null);

    // Theme logic
    const themes = {
        blue: {
            border: "border-blue-200 focus-within:ring-blue-600 focus-within:border-blue-600",
            tag: "bg-blue-50 text-blue-700 border-blue-100",
            tagClose: "text-blue-400 hover:text-blue-600",
            suggestionHover: "hover:bg-blue-50",
            matchText: "text-gray-900"
        },
        fuchsia: {
            border: "border-white/10 bg-black/40 focus-within:border-fuchsia-500/50 focus-within:ring-0",
            tag: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20 font-mono",
            tagClose: "text-fuchsia-600 hover:text-fuchsia-400",
            suggestionHover: "hover:bg-fuchsia-500/10",
            matchText: "text-fuchsia-400",
            listBg: "bg-[#0f172a] border-white/10 text-slate-300 font-mono"
        },
        cyan: {
            border: "border-white/10 bg-black/40 focus-within:border-cyan-500/50 focus-within:ring-0",
            tag: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 font-mono",
            tagClose: "text-cyan-600 hover:text-cyan-400",
            suggestionHover: "hover:bg-cyan-500/10",
            matchText: "text-cyan-400",
            listBg: "bg-[#090e17] border-white/10 text-slate-300 font-mono"
        }
    };

    const currentTheme = themes[variant] || themes.blue;

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                setLoading(true);
                const response = await skillsApi.getAllSkills();
                setAllSkills(response.data || []);
            } catch (error) {
                console.error("Failed to fetch skills:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();

        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!inputValue.trim()) {
            setSuggestions([]);
            return;
        }

        const filtered = allSkills.filter(skill => 
            skill.name.toLowerCase().includes(inputValue.toLowerCase()) && 
            !selectedSkills.some(s => (typeof s === 'string' ? s : s.name) === skill.name)
        );
        setSuggestions(filtered);
    }, [inputValue, allSkills, selectedSkills]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (inputValue.trim()) {
                const match = allSkills.find(s => s.name.toLowerCase() === inputValue.trim().toLowerCase());
                if (match) {
                    addSkill(match);
                } else {
                    addSkill(inputValue);
                }
            }
        }
    };

    const addSkill = (skill) => {
        const skillName = typeof skill === 'string' ? skill : skill.name;
        const trimmed = skillName.trim();
        const exists = selectedSkills.some(s => (typeof s === 'string' ? s : s.name).toLowerCase() === trimmed.toLowerCase());

        if (trimmed && !exists) {
            const match = typeof skill === 'string' ? allSkills.find(s => s.name.toLowerCase() === trimmed.toLowerCase()) : skill;
            const skillToAdd = match || { name: trimmed, id: null };
            onChange([...selectedSkills, skillToAdd]);
            setInputValue('');
            setShowSuggestions(false);
        }
    };

    const removeSkill = (skillToRemove) => {
        const nameToRemove = typeof skillToRemove === 'string' ? skillToRemove : skillToRemove.name;
        const newSkills = selectedSkills.filter(s => {
            const sName = typeof s === 'string' ? s : s.name;
            return sName !== nameToRemove;
        });
        onChange(newSkills);
    };

    return (
        <div className="w-full relative" ref={wrapperRef}>
            {/* Input Area */}
            <div className={`flex flex-wrap items-center gap-2 rounded-xl px-4 py-3 transition-all shadow-sm ${currentTheme.border}`}>
                {selectedSkills.map((skill, index) => {
                    const skillName = typeof skill === 'string' ? skill : skill.name;
                    return (
                        <span 
                            key={index} 
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all ${currentTheme.tag}`}
                        >
                            {skillName.toUpperCase()}
                            <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className={`focus:outline-none transition-colors ${currentTheme.tagClose}`}
                            >
                                ×
                            </button>
                        </span>
                    );
                })}
                
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={selectedSkills.length === 0 ? placeholder : ""}
                    className={`flex-1 min-w-[120px] outline-none text-sm bg-transparent placeholder-slate-700 font-medium ${variant !== 'blue' ? 'text-slate-300 font-mono uppercase tracking-wider' : 'text-gray-700'}`}
                />
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && inputValue.trim() && (
                <div className={`absolute z-20 w-full mt-2 border rounded-xl shadow-2xl max-h-60 overflow-y-auto ${currentTheme.listBg || 'bg-white border-gray-100'}`}>
                    {loading ? (
                        <div className="p-4 text-xs text-gray-400 text-center font-mono animate-pulse">SYNCHRONIZING_MODULES...</div>
                    ) : suggestions.length > 0 ? (
                        <ul>
                            {suggestions.map((skill) => (
                                <li
                                    key={skill.id}
                                    onClick={() => addSkill(skill)}
                                    className={`px-4 py-3 cursor-pointer text-xs font-black transition-colors border-b border-white/5 last:border-0 ${currentTheme.suggestionHover}`}
                                >
                                    <span className={currentTheme.matchText}>{skill.name.toUpperCase()}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className={`p-4 text-[10px] font-mono italic opacity-50 ${currentTheme.listBg || 'bg-gray-50'}`}>
                            PRESS_ENTER_TO_INITIALIZE: "<span className={`font-black uppercase not-italic ${currentTheme.matchText}`}>{inputValue}</span>"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SkillSelector;
