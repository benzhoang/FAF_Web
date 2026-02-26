
import React, { useState, useEffect, useRef } from 'react';
import { skillsApi } from '../api/skills.api';

const SkillSelector = ({ selectedSkills = [], onChange, placeholder = "Type a skill..." }) => {
    const [allSkills, setAllSkills] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef(null);

    // Fetch skills on mount
    useEffect(() => {
        const fetchSkills = async () => {
            try {
                setLoading(true);
                const response = await skillsApi.getAllSkills();
                // Backend returns { data: [...] }
                setAllSkills(response.data || []);
            } catch (error) {
                console.error("Failed to fetch skills:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();

        // Click outside to close suggestions
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

    // Filter suggestions when input changes
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
                // Check if the typed value matches an existing skill
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
        // skill can be string or object {id, name}
        const skillName = typeof skill === 'string' ? skill : skill.name;
        const trimmed = skillName.trim();

        // Check duplicates
        const exists = selectedSkills.some(s => (typeof s === 'string' ? s : s.name).toLowerCase() === trimmed.toLowerCase());

        if (trimmed && !exists) {
            // If it's a string (custom skill) but we found a match object in allSkills, use that object
            // (Double check in case addSkill was called with string but match exists)
            const match = typeof skill === 'string' ? allSkills.find(s => s.name.toLowerCase() === trimmed.toLowerCase()) : skill;
            
            // Prefer adding the object {id, name}
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
            <div className="flex flex-wrap items-center gap-2 border border-blue-200 rounded-xl px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600 transition-all shadow-sm">
                {selectedSkills.map((skill, index) => {
                    const skillName = typeof skill === 'string' ? skill : skill.name;
                    return (
                        <span 
                            key={index} 
                            className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100"
                        >
                            {skillName}
                            <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="text-blue-400 hover:text-blue-600 focus:outline-none transition-colors"
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
                    className="flex-1 min-w-[120px] outline-none text-sm text-gray-700 bg-transparent placeholder-gray-400 font-medium"
                />
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && inputValue.trim() && (
                <div className="absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-sm text-gray-400 text-center font-medium">Loading skills...</div>
                    ) : suggestions.length > 0 ? (
                        <ul>
                            {suggestions.map((skill) => (
                                <li
                                    key={skill.id}
                                    onClick={() => {
                                        addSkill(skill); // Pass the whole object
                                    }}
                                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-sm font-medium text-gray-700 transition-colors border-b border-gray-50 last:border-0"
                                >
                                    {skill.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4 text-sm text-gray-500 font-medium bg-gray-50 rounded-b-xl">
                            Press Enter to add "<span className="text-gray-900 font-bold">{inputValue}</span>"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SkillSelector;
