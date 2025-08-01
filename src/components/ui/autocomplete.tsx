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
  position?: "top" | "bottom"
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
    position = "top",
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
          setSelectedIndex(showCreateNew ? 0 : -1)
        }
        return
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) => {
            const next = prev + 1
            return next >= totalOptions ? 0 : next
          })
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => {
            const next = prev - 1
            return next < 0 ? totalOptions - 1 : next
          })
          break
        case 'Enter':
          e.preventDefault()
          if (showCreateNew && selectedIndex === 0) {
            onCreateNew(inputValue.trim())
            setOpen(false)
            setSelectedIndex(-1)
          } else if (selectedIndex >= (showCreateNew ? 1 : 0) && selectedIndex < totalOptions) {
            const option = filteredOptions[selectedIndex - (showCreateNew ? 1 : 0)]
            setInputValue(option.label)
            onOptionSelect(option)
            setOpen(false)
            setSelectedIndex(-1)
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
          onFocus={() => {
            setOpen(true)
            setSelectedIndex(showCreateNew ? 0 : -1)
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn("w-full", className)}
          {...props}
          onChange={(e) => {
            setInputValue(e.target.value)
            setSelectedIndex(showCreateNew ? 0 : -1)
            props.onChange?.(e)
          }}
        />
        {open && (filteredOptions.length > 0 || isLoading || showCreateNew) && (
          <div className={cn("absolute left-0 right-0 z-50 mt-1 max-h-[300px] overflow-auto rounded-md border bg-popover shadow-md", position === "top" ? "top-full" : "bottom-full")}>
            {isLoading ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                Loading...
              </div>
            ) : (
              <>
                {showCreateNew && (
                  <button
                    className={cn(
                      "w-full px-3 py-2 text-left text-sm text-primary hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none",
                      selectedIndex === 0 && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => {
                      onCreateNew(inputValue.trim())
                      setOpen(false)
                      setSelectedIndex(-1)
                    }}
                  >
                    {createNewLabel} &quot;{inputValue.trim()}&quot;
                  </button>
                )}
                {filteredOptions.map((option, index) => (
                  <button
                    key={option.value}
                    className={cn(
                      "w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none flex items-center gap-2",
                      (showCreateNew ? index + 1 : index) === selectedIndex && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => {
                      setInputValue(option.label)
                      onOptionSelect(option)
                      setOpen(false)
                      setSelectedIndex(-1)
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
