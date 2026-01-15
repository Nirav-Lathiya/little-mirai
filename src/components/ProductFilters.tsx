"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SlidersHorizontal, X } from "lucide-react"

export interface FilterState {
  categories: string[]
  sizes: string[]
  ageGroups: string[]
  priceRanges: string[]
}

interface ProductFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  className?: string
}

const categories = ["Clothing", "Footwear", "Accessories", "Headwear"]
const sizes = ["0-3M", "3-6M", "6-12M", "12-18M", "One Size"]
const ageGroups = ["Newborn", "Infant", "Toddler", "Walker"]
const priceRanges = ["$0-25", "$25-50", "$50+"]

// Map age groups to sizes
const ageGroupToSizes: Record<string, string[]> = {
  "Newborn": ["0-3M"],
  "Infant": ["3-6M"],
  "Toddler": ["6-12M"],
  "Walker": ["12-18M"]
}

function ProductFiltersContent({ filters, onFiltersChange }: ProductFiltersProps) {
  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category)
    onFiltersChange({ ...filters, categories: newCategories })
  }

  const handleSizeChange = (size: string, checked: boolean) => {
    const newSizes = checked
      ? [...filters.sizes, size]
      : filters.sizes.filter(s => s !== size)
    onFiltersChange({ ...filters, sizes: newSizes })
  }

  const handleAgeGroupChange = (ageGroup: string, checked: boolean) => {
    const sizesToAdd = ageGroupToSizes[ageGroup] || []
    let newSizes = [...filters.sizes]
    let newAgeGroups = [...filters.ageGroups]

    if (checked) {
      newSizes = [...new Set([...newSizes, ...sizesToAdd])]
      newAgeGroups = [...newAgeGroups, ageGroup]
    } else {
      newSizes = newSizes.filter(s => !sizesToAdd.includes(s))
      newAgeGroups = newAgeGroups.filter(a => a !== ageGroup)
    }

    onFiltersChange({ ...filters, sizes: newSizes, ageGroups: newAgeGroups })
  }

  const handlePriceRangeChange = (range: string, checked: boolean) => {
    const newPriceRanges = checked
      ? [...filters.priceRanges, range]
      : filters.priceRanges.filter(r => r !== range)
    onFiltersChange({ ...filters, priceRanges: newPriceRanges })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      sizes: [],
      ageGroups: [],
      priceRanges: []
    })
  }

  const hasActiveFilters = filters.categories.length > 0 ||
    filters.sizes.length > 0 ||
    filters.ageGroups.length > 0 ||
    filters.priceRanges.length > 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={["categories", "sizes", "age-groups", "price"]} className="w-full">
        <AccordionItem value="categories">
          <AccordionTrigger className="text-sm font-medium">Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                  />
                  <Label
                    htmlFor={`category-${category}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sizes">
          <AccordionTrigger className="text-sm font-medium">Sizes</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {sizes.map((size) => (
                <div key={size} className="flex items-center space-x-2">
                  <Checkbox
                    id={`size-${size}`}
                    checked={filters.sizes.includes(size)}
                    onCheckedChange={(checked) => handleSizeChange(size, checked as boolean)}
                  />
                  <Label
                    htmlFor={`size-${size}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {size}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="age-groups">
          <AccordionTrigger className="text-sm font-medium">Age Groups</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {ageGroups.map((ageGroup) => (
                <div key={ageGroup} className="flex items-center space-x-2">
                  <Checkbox
                    id={`age-${ageGroup}`}
                    checked={filters.ageGroups.includes(ageGroup)}
                    onCheckedChange={(checked) => handleAgeGroupChange(ageGroup, checked as boolean)}
                  />
                  <Label
                    htmlFor={`age-${ageGroup}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {ageGroup}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-medium">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {priceRanges.map((range) => (
                <div key={range} className="flex items-center space-x-2">
                  <Checkbox
                    id={`price-${range}`}
                    checked={filters.priceRanges.includes(range)}
                    onCheckedChange={(checked) => handlePriceRangeChange(range, checked as boolean)}
                  />
                  <Label
                    htmlFor={`price-${range}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {range}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export function ProductFilters({ filters, onFiltersChange, className }: ProductFiltersProps) {
  return (
    <div className={className}>
      <ProductFiltersContent filters={filters} onFiltersChange={onFiltersChange} />
    </div>
  )
}

export function ProductFiltersMobile({ filters, onFiltersChange }: ProductFiltersProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden">
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle>Filter Products</SheetTitle>
          <SheetDescription>
            Narrow down products by category, size, age group, and price.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <ProductFiltersContent filters={filters} onFiltersChange={onFiltersChange} />
        </div>
      </SheetContent>
    </Sheet>
  )
}