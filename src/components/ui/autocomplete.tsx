import * as React from "react"
import { Input } from "./input"
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage } from "./avatar"

export interface AutocompleteOption {
  label: string
  value: string
  imageUrl?: string
}

export interface AutocompleteProps extends React.InputHTMLAttributes<HTMLInputElement> {
  options?: AutocompleteOption[]
  value: string
  onOptionSelect: (value: AutocompleteOption) => void
  placeholder?: string
  className?: string
  loadOptions?: (inputValue: string) => Promise<AutocompleteOption[]>
  initialValue?: string
  isLoading?: boolean
  onCreateNew?: (inputValue: string) => void
  createNewLabel?: string
}

const Autocomplete = React.forwardRef<HTMLInputElement, AutocompleteProps>(
  ({ 
    options: staticOptions, 
    value, 
    onOptionSelect, 
    placeholder, 
    className, 
    loadOptions,
    initialValue,
    isLoading: externalLoading,
    onCreateNew,
    createNewLabel = "Create new",
    ...props 
  }, forwardedRef) => {
    const [open, setOpen] = React.useState(false)
    const [inputValue, setInputValue] = React.useState(initialValue || value)
    const [options, setOptions] = React.useState<AutocompleteOption[]>(staticOptions || [])
    const [isLoading, setIsLoading] = React.useState(false)
    const [selectedIndex, setSelectedIndex] = React.useState(-1)
    const containerRef = React.useRef<HTMLDivElement>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const debounceTimeout = React.useRef<NodeJS.Timeout>()

    // Find the label for the current value
    const currentLabel = React.useMemo(() => {
      if (!value) return ""
      const option = options.find(opt => opt.value === value)
      return option?.label || value
    }, [value, options])

    React.useEffect(() => {
      setInputValue(initialValue || currentLabel)
    }, [initialValue, currentLabel])

    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setOpen(false)
          setSelectedIndex(-1)
          // Don't blur the input when clicking outside with a small delay
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.focus()
            }
          }, 0)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // Handle async loading of options
    React.useEffect(() => {
      if (!loadOptions) return

      const loadOptionsAsync = async () => {
        if (!inputValue.trim()) {
          setOptions([])
          return
        }

        setIsLoading(true)
        try {
          const results = await loadOptions(inputValue)
          setOptions(results)
        } catch (error) {
          console.error('Error loading options:', error)
          setOptions([])
        } finally {
          setIsLoading(false)
        }
      }

      // Debounce the search to avoid too many API calls
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
      debounceTimeout.current = setTimeout(loadOptionsAsync, 300)

      return () => {
        if (debounceTimeout.current) {
          clearTimeout(debounceTimeout.current)
        }
      }
    }, [inputValue, loadOptions])

    const filteredOptions = loadOptions 
      ? options 
      : (staticOptions || []).filter((option) =>
          option.label.toLowerCase().includes(inputValue.toLowerCase())
        )

    const showCreateNew = onCreateNew && inputValue.trim() && !isLoading
    const totalOptions = filteredOptions.length + (showCreateNew ? 1 : 0)

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>) => {
      if (!open) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault()
          setOpen(true)
          setSelectedIndex(0)
        }
        return
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) => (prev + 1) % totalOptions)
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => (prev - 1 + totalOptions) % totalOptions)
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0 && selectedIndex < filteredOptions.length) {
            const option = filteredOptions[selectedIndex]
            setInputValue(option.label)
            onOptionSelect(option)
            setOpen(false)
            setSelectedIndex(-1)
            // Keep focus on input after selection with a small delay
            setTimeout(() => {
              if (inputRef.current) {
                inputRef.current.focus()
              }
            }, 0)
          } else if (showCreateNew && selectedIndex === filteredOptions.length) {
            onCreateNew(inputValue.trim())
            setOpen(false)
            setSelectedIndex(-1)
            // Keep focus on input after creating new with a small delay
            setTimeout(() => {
              if (inputRef.current) {
                inputRef.current.focus()
              }
            }, 0)
          }
          break
        case 'Escape':
          e.preventDefault()
          setOpen(false)
          setSelectedIndex(-1)
          break
      }
    }

    return (
      <div 
        ref={containerRef} 
        className="relative w-full"
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <Input
          ref={(node) => {
            // Handle both the forwarded ref and our internal ref
            if (typeof forwardedRef === 'function') {
              forwardedRef(node)
            }
            if (node) {
              (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node
            }
          }}
          value={inputValue}
          onFocus={(e) => {
            setOpen(true)
            // containerRef.current?.focus()
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn("w-full", className)}
          {...props}
          onChange={(e) => {
            setInputValue(e.target.value)
            setSelectedIndex(-1)
            props.onChange?.(e)
          }}
        />
        {open && (filteredOptions.length > 0 || isLoading || showCreateNew) && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[300px] overflow-auto rounded-md border bg-popover shadow-md">
            {isLoading ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                Loading...
              </div>
            ) : (
              <>
                {filteredOptions.map((option, index) => (
                  <button
                    key={option.value}
                    className={cn(
                      "w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none flex items-center gap-2",
                      index === selectedIndex && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => {
                      setInputValue(option.label)
                      onOptionSelect(option)
                      setOpen(false)
                      setSelectedIndex(-1)
                      // Keep focus on input after selection with a small delay
                      setTimeout(() => {
                        if (inputRef.current) {
                          inputRef.current.focus()
                        }
                      }, 0)
                    }}
                  >
                    {option.imageUrl && (
                      <Avatar className="w-6 h-6 rounded-full" src={option.imageUrl} alt={option.label} />
                    )}
                    <span className="truncate">
                      {option.label}
                    </span>
                  </button>
                ))}
                {showCreateNew && (
                  <button
                    className={cn(
                      "w-full border-t px-3 py-2 text-left text-sm text-primary hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none",
                      selectedIndex === filteredOptions.length && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => {
                      onCreateNew(inputValue.trim())
                      setOpen(false)
                      setSelectedIndex(-1)
                      // Keep focus on input after creating new with a small delay
                      setTimeout(() => {
                        if (inputRef.current) {
                          inputRef.current.focus()
                        }
                      }, 0)
                    }}
                  >
                    {createNewLabel} &quot;{inputValue.trim()}&quot;
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    )
  }
)

Autocomplete.displayName = "Autocomplete"

export { Autocomplete }
