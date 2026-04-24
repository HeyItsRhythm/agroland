import React from "react";
import { cn } from "../../utils/cn";
import Icon from "../AppIcon";

const Input = React.forwardRef(({
    className,
    type = "text",
    label,
    description,
    error,
    required = false,
    id,
    iconName,
    ...props
}, ref) => {
    // Generate unique ID if not provided
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    // Base input classes
    const baseInputClasses = "flex h-11 w-full rounded-xl border border-border bg-card px-4 py-2 text-sm shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50";

    // ... checkbox and radio styles ...
    if (type === "checkbox") {
        return (
            <input
                type="checkbox"
                className={cn(
                    "h-4 w-4 rounded border border-border bg-card text-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                id={inputId}
                {...props}
            />
        );
    }

    if (type === "radio") {
        return (
            <input
                type="radio"
                className={cn(
                    "h-4 w-4 rounded-full border border-border bg-card text-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                id={inputId}
                {...props}
            />
        );
    }

    return (
        <div className="space-y-2">
            {label && (
                <label
                    htmlFor={inputId}
                    className={cn(
                        "text-sm font-bold leading-none mb-2 block",
                        error ? "text-destructive" : "text-foreground"
                    )}
                >
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </label>
            )}

            <div className="relative group">
                {iconName && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                        <Icon name={iconName} size={18} />
                    </div>
                )}
                <input
                    type={type}
                    className={cn(
                        baseInputClasses,
                        iconName && "pl-11",
                        error && "border-destructive focus:ring-destructive",
                        className
                    )}
                    ref={ref}
                    id={inputId}
                    {...props}
                />
            </div>

            {description && !error && (
                <p className="text-xs text-muted-foreground">
                    {description}
                </p>
            )}

            {error && (
                <p className="text-[10px] font-bold text-destructive uppercase tracking-tight">
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = "Input";

export default Input;