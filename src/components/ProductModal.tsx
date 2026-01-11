"use client"

import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Minus, Plus, ShoppingCart, Star, Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { babyProducts } from "@/lib/data"

interface ProductModalProps {
  product: typeof babyProducts[0]
  children: React.ReactNode
}

export function ProductModal({ product, children }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [quantity, setQuantity] = useState(1)
  const [isOpen, setIsOpen] = useState(false)
  const { dispatch } = useCart()

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        selectedSize,
        selectedColor,
        isSale: product.isSale,
        quantity
      }
    })
    setIsOpen(false)
  }

  const increaseQuantity = () => setQuantity(prev => prev + 1)
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1))

  const discountedPrice = product.originalPrice && product.isSale ? product.price : product.price
  const totalPrice = discountedPrice * quantity
  const savings = product.originalPrice && product.isSale ? (product.originalPrice - product.price) * quantity : 0

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="w-[70vw] max-w-none max-h-[90vh] overflow-y-auto scrollbar-hide p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          {/* Product Images Section */}
          <div className="relative bg-gray-50 dark:bg-gray-900 p-8 flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-square">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover rounded-lg shadow-lg"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {product.isNew && (
                <Badge className="absolute top-4 left-4 bg-blue-500 hover:bg-blue-600 text-white font-medium px-3 py-1">
                  New
                </Badge>
              )}
              {product.isSale && (
                <Badge className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-1">
                  {Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}% OFF
                </Badge>
              )}
            </div>

            {/* Thumbnail Gallery Placeholder */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              <div className="w-12 h-12 bg-white rounded border-2 border-primary cursor-pointer">
                <Image
                  src={product.image}
                  alt="Thumbnail"
                  width={48}
                  height={48}
                  className="object-cover rounded w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="p-8 flex flex-col">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                {product.originalPrice && product.isSale && (
                  <span className="text-lg text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
                <span className="text-3xl font-bold text-primary">
                  ${product.price}
                </span>
                {savings > 0 && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Save ${savings.toFixed(2)}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Price per item • Free shipping on orders over $50
              </p>
            </div>

            <Separator className="my-6" />

            {/* Size Selection */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Size
              </label>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {product.sizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">Standard sizing for 0-12 months</p>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Color
              </label>
              <Select value={selectedColor} onValueChange={setSelectedColor}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {product.colors.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Age Group */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Age Group
              </label>
              <Select defaultValue="0-12 months">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-3 months">0-3 months</SelectItem>
                  <SelectItem value="3-6 months">3-6 months</SelectItem>
                  <SelectItem value="6-12 months">6-12 months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="h-8 w-8"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={increaseQuantity}
                  className="h-8 w-8"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Total Price */}
            {quantity > 1 && (
              <div className="bg-primary/5 dark:bg-primary/10 p-3 rounded-lg mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total ({quantity} items):</span>
                  <span className="text-lg font-bold text-primary">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <Button onClick={handleAddToCart} className="flex-1" size="lg">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart • ${totalPrice.toFixed(2)}
              </Button>
              <Button variant="outline" size="lg" className="px-4">
                <Heart className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="lg" className="px-4">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Product Details</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {product.description}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-green-600" />
                  <span>Free shipping over $50</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>30-day returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-purple-600" />
                  <span>1-year warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-600" />
                  <span>Premium quality</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}