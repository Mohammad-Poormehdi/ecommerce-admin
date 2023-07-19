"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Store } from "@prisma/client"
import { CommandEmpty } from "cmdk"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"
import { PiStorefront } from "react-icons/pi"

import { cn } from "@/lib/utils"
import { useStoreModal } from "@/hooks/use-store-modal"
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Button } from "./ui/button"

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[]
}

const StoreSwitcher: React.FC<StoreSwitcherProps> = ({
  className,
  items = [],
}) => {
  const storeModal = useStoreModal()
  const params = useParams()
  const router = useRouter()

  const formatedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }))

  const currentStore = formatedItems.find(
    (item) => item.value === params.storeId
  )

  const [open, setOpen] = useState<boolean>(false)

  const onStoreSelect = (store: { value: string; label: string }) => {
    setOpen(false)
    router.push(`/${store.value}`)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-label="select a store"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", className)}
        >
          <PiStorefront className="mr-2" />
          {currentStore?.label}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search store" />
            <CommandEmpty>No store found</CommandEmpty>
            <CommandGroup heading="Stores">
              {formatedItems.map((store) => (
                <CommandItem
                  key={store.value}
                  onSelect={() => onStoreSelect(store)}
                  className="text-sm cursor-pointer"
                >
                  <PiStorefront className="mr-2" />
                  {store.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentStore?.value === store.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  storeModal.onOpen()
                }}
                className="cursor-pointer"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default StoreSwitcher
