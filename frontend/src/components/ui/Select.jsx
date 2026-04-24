// components/ui/Select.jsx - Shadcn style Select
import React, { useState, useEffect } from "react";
import { ChevronDown, Check, Search, X } from "lucide-react";
import { cn } from "../../utils/cn";
import Icon from "../AppIcon";
import Button from "./Button";
import Input from "./Input";

const Select = React.forwardRef(({
    className,
    options = [],
    value,
    defaultValue,
    placeholder = "Select an option",
    multiple = false,
    disabled = false,
    required = false,
    label,
    description,
    error,
    searchable = false,
    clearable = false,
    loading = false,
    id,
    name,
    onChange,
    onOpenChange,
    style,
    ...props
}, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const containerRef = React.useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
                onOpenChange?.(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onOpenChange]);

    // Generate unique ID if not provided
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    // Filter options based on search
    const filteredOptions = searchable && searchTerm
        ? options.filter(option =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (option.value && option.value.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        )
        : options;

    const getSelectedDisplay = () => {
        if (!value) return placeholder;
        if (multiple) {
            const selectedOptions = options.filter(opt => value.includes(opt.value));
            if (selectedOptions.length === 0) return placeholder;
            if (selectedOptions.length === 1) return selectedOptions[0].label;
            return `${selectedOptions.length} items selected`;
        }
        const selectedOption = options.find(opt => opt.value === value);
        return selectedOption ? selectedOption.label : placeholder;
    };

    const handleToggle = (e) => {
        e.preventDefault();
        if (!disabled) {
            const newIsOpen = !isOpen;
            setIsOpen(newIsOpen);
            onOpenChange?.(newIsOpen);
            if (!newIsOpen) setSearchTerm("");
        }
    };

    const handleOptionSelect = (option) => {
        if (multiple) {
            const newValue = value || [];
            const updatedValue = newValue.includes(option.value)
                ? newValue.filter(v => v !== option.value)
                : [...newValue, option.value];
            onChange?.(updatedValue);
        } else {
            onChange?.(option.value);
            setIsOpen(false);
            onOpenChange?.(false);
        }
    };

    const handleClear = (e) => {
        e.stopPropagation();
        onChange?.(multiple ? [] : '');
    };

    const isSelected = (optionValue) => {
        if (multiple) return value?.includes(optionValue) || false;
        return value === optionValue;
    };

    const hasValue = multiple ? value?.length > 0 : value !== undefined && value !== '';

    return (
        <div className={cn("relative w-full", className)} ref={containerRef} style={style}>
            {label && (
                <label
                    htmlFor={selectId}
                    className={cn(
                        "text-sm font-bold leading-none mb-2 block",
                        error ? "text-destructive" : "text-foreground"
                    )}
                >
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                <button
                    ref={ref}
                    id={selectId}
                    name={name}
                    type="button"
                    className={cn(
                        "flex h-11 w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-2 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50",
                        isOpen && "ring-2 ring-primary/20 border-primary",
                        error && "border-destructive focus:ring-destructive",
                        !hasValue && "text-muted-foreground"
                    )}
                    onClick={handleToggle}
                    disabled={disabled}
                    {...props}
                >
                    <span className="truncate font-medium">{getSelectedDisplay()}</span>
                    <div className="flex items-center gap-2">
                        {loading && <Icon name="Loader2" size={14} className="animate-spin text-muted-foreground" />}
                        {clearable && hasValue && (
                            <div onClick={handleClear} className="hover:bg-muted p-1 rounded-md">
                                <Icon name="X" size={12} />
                            </div>
                        )}
                        <Icon name="ChevronDown" size={16} className={cn("transition-transform duration-300", isOpen && "rotate-180")} />
                    </div>
                </button>

                {isOpen && (
                    <div className="absolute z-[100] w-full mt-2 bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top">
                        {searchable && (
                            <div className="p-2 border-b border-border bg-muted/20">
                                <div className="relative">
                                    <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                                    <input
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-primary"
                                        autoFocus
                                    />
                                </div>
                            </div>
                        )}

                        <div className="py-2 max-h-[240px] overflow-y-auto custom-scrollbar overscroll-contain">
                            {filteredOptions.length === 0 ? (
                                <div className="px-4 py-6 text-center text-xs text-muted-foreground italic">
                                    {searchTerm ? 'No results found' : 'No options available'}
                                </div>
                            ) : (
                                filteredOptions.map((option) => (
                                    <div
                                        key={option.value}
                                        className={cn(
                                            "flex cursor-pointer items-center px-4 py-2.5 text-sm transition-colors mx-1 rounded-lg",
                                            isSelected(option.value)
                                                ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20"
                                                : "text-foreground hover:bg-primary/10 hover:text-primary"
                                        )}
                                        onClick={() => !option.disabled && handleOptionSelect(option)}
                                    >
                                        <span className="flex-1">{option.label}</span>
                                        {isSelected(option.value) && <Icon name="Check" size={14} />}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {error && <p className="text-[10px] font-bold text-destructive mt-1 uppercase tracking-tight">{error}</p>}
        </div>
    );
});

Select.displayName = "Select";

export default Select;