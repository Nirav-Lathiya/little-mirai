"use client"

import Image from "next/image"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, ShoppingCart, Star, Heart, Share2, Truck, Shield, RotateCcw, ArrowLeft } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { babyProducts } from "@/lib/data"
import Link from "next/link"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = parseInt(params.id as string)
  const product = babyProducts.find(p => p.id === productId)

  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || "")
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || "")
  const [quantity, setQuantity] = useState(1)
  const { dispatch } = useCart()

  if (!product) {
    return <div>Product not found</div>
  }

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
    router.push('/cart')
  }

  const increaseQuantity = () => setQuantity(prev => prev + 1)
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1))

  const discountedPrice = product.originalPrice && product.isSale ? product.price : product.price
  const totalPrice = discountedPrice * quantity
  const savings = product.originalPrice && product.isSale ? (product.originalPrice - product.price) * quantity : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-4">
              <div className="relative w-14 h-14">
                <Image
                  src="/little-mirai-logo.svg"
                  alt="Little Mirai Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent tracking-tight">
                Little Mirai
              </div>
            </Link>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Shop
            </Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 min-h-[800px]">
          {/* Product Images Section */}
          <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-12 flex items-center justify-center rounded-2xl">
            <div className="relative w-full max-w-lg aspect-square">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover rounded-xl shadow-2xl"
                sizes="(max-width: 1280px) 100vw, 50vw"
                priority
              />
              {product.isNew && (
                <Badge className="absolute top-6 left-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 text-sm">
                  New Arrival
                </Badge>
              )}
              {product.isSale && (
                <Badge className="absolute top-6 right-6 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 text-sm">
                  {Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}% OFF
                </Badge>
              )}
            </div>

            {/* Thumbnail Gallery Placeholder */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
              <div className="w-16 h-16 bg-white rounded-lg border-2 border-primary cursor-pointer shadow-md hover:shadow-lg transition-shadow">
                <Image
                  src={product.image}
                  alt="Thumbnail"
                  width={64}
                  height={64}
                  className="object-cover rounded-lg w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="p-8 flex flex-col justify-center">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-base text-gray-600 dark:text-gray-400 ml-3 font-medium">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-baseline gap-4 mb-3">
                {product.originalPrice && product.isSale && (
                  <span className="text-2xl text-gray-500 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
                <span className="text-5xl font-bold text-primary">
                  ₹{product.price}
                </span>
                {savings > 0 && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 px-4 py-2 text-base font-semibold">
                    Save ₹{savings.toFixed(2)}
                  </Badge>
                )}
              </div>
              <p className="text-base text-gray-600 dark:text-gray-400">
                Price per item • Free shipping on orders over ₹500
              </p>
            </div>

            <Separator className="my-8" />

            {/* Size Selection */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Size</h3>
              <div className="flex flex-wrap gap-4">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    size="lg"
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[100px] h-14 text-lg font-medium ${
                      selectedSize === size
                        ? 'bg-primary text-primary-foreground shadow-xl scale-105'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md'
                    } transition-all duration-200`}
                  >
                    {size}
                  </Button>
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                Size guide • Standard sizing for 0-12 months
              </p>
            </div>

            {/* Color Selection */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Color</h3>
              <div className="flex flex-wrap gap-4">
                {product.colors.map((color) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? "default" : "outline"}
                    size="lg"
                    onClick={() => setSelectedColor(color)}
                    className={`min-w-[120px] h-14 text-lg font-medium ${
                      selectedColor === color
                        ? 'bg-primary text-primary-foreground shadow-xl scale-105'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md'
                    } transition-all duration-200`}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Quantity</h3>
              <div className="flex items-center gap-6">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="h-14 w-14 text-xl"
                >
                  <Minus className="w-6 h-6" />
                </Button>
                <div className="flex items-center justify-center w-20 h-14 border-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <span className="text-2xl font-bold">{quantity}</span>
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={increaseQuantity}
                  className="h-14 w-14 text-xl"
                >
                  <Plus className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* Total Price for multiple items */}
            {quantity > 1 && (
              <div className="bg-primary/10 dark:bg-primary/20 p-6 rounded-xl mb-8 border border-primary/20">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Total ({quantity} items):</span>
                  <span className="text-3xl font-bold text-primary">₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <Button
                onClick={handleAddToCart}
                className="flex-1 h-16 text-xl font-semibold shadow-lg hover:shadow-xl"
                size="lg"
              >
                <ShoppingCart className="w-6 h-6 mr-3" />
                Add to Cart • ₹{totalPrice.toFixed(2)}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-16 px-8 border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Heart className="w-6 h-6" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-16 px-8 border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Share2 className="w-6 h-6" />
              </Button>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Product Details</h3>
                <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-6">
                  {product.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <Truck className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="font-medium">Free shipping over ₹500</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-medium">30-day returns</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                      <RotateCcw className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="font-medium">1-year warranty</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <span className="font-medium">Premium quality</span>
                  </div>
                </div>
              </div>

              {/* Age Group & Material */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <p><strong className="text-gray-900 dark:text-white">Age Group:</strong> Suitable for newborns to 12 months</p>
                  <p><strong className="text-gray-900 dark:text-white">Material:</strong> 100% organic cotton, hypoallergenic</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}