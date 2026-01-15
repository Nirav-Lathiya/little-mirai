"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ShoppingCart, Heart, Search, Menu, Star, Truck, Shield, Award, ChevronDown, Grid, List, Package, Baby, Sparkles, Heart as HeartIcon } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { ProductModal } from "@/components/ProductModal"
import { CartModal } from "@/components/CartModal"
import { ProductFilters, ProductFiltersMobile, FilterState } from "@/components/ProductFilters"
import { babyProducts } from "@/lib/data"
import { useCart } from "@/context/CartContext"
import { motion, useAnimation, useInView } from "framer-motion"
import { useEffect, useRef } from "react"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const staggerContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const staggerItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
}

const floatVariants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity
    }
  }
}

const scaleVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
}

// Animated components
const AnimatedSection = ({ children, className, delay = 0, id }: { children: React.ReactNode, className?: string, delay?: number, id?: string }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className={className}
      style={{ transitionDelay: `${delay}s` }}
      id={id}
    >
      {children}
    </motion.section>
  )
}

const FloatingIcon = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    variants={floatVariants}
    animate="animate"
    style={{
      animationDelay: `${delay}s`
    }}
  >
    {children}
  </motion.div>
)

function ProductCard({ product }: { product: typeof babyProducts[0] }) {
  const { dispatch } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        selectedSize: product.sizes?.[0] || 'One Size',
        selectedColor: product.colors?.[0] || 'Default',
        isSale: product.isSale
      }
    })
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Wishlist functionality would be implemented here
  }

  return (
    <ProductModal product={product}>
      <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 border border-border/50 hover:border-primary/20 bg-card h-full overflow-hidden">
        <CardHeader className="p-0">
          <div className="relative aspect-square bg-gradient-to-br from-primary/5 to-accent/10 rounded-t-lg overflow-hidden">
            <motion.div
              className="w-full h-full"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={product.image}
                alt={`Baby wearing ${product.name.toLowerCase()}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 25vw, 20vw"
              />
            </motion.div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {product.isNew && (
                <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground font-semibold shadow-sm">New</Badge>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              {product.isSale && (
                <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground font-semibold shadow-sm">Sale</Badge>
              )}
            </motion.div>

            <motion.div
              className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ opacity: 0, y: -10 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="secondary"
                size="icon"
                className="w-8 h-8 bg-white/90 hover:bg-white shadow-sm"
                onClick={handleWishlist}
              >
                <Heart className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </CardHeader>

        <CardContent className="p-5 flex-1 flex flex-col">
          <motion.div
            className="flex items-center gap-2 mb-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Badge variant="secondary" className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary border-primary/20">
              {product.category}
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <CardTitle className="text-lg font-semibold mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
              {product.name}
            </CardTitle>
          </motion.div>

          <motion.p
            className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed flex-1"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {product.description}
          </motion.p>

          <motion.div
            className="flex items-center gap-2 mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/50'}`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground font-medium">({product.reviews})</span>
          </motion.div>

          <motion.div
            className="flex items-baseline gap-3 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-2xl font-bold text-primary">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through font-medium">₹{product.originalPrice}</span>
            )}
            {product.originalPrice && (
              <Badge variant="destructive" className="text-xs ml-auto">
                {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
              </Badge>
            )}
          </motion.div>
        </CardContent>

        <CardFooter className="p-5 pt-0">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              className="w-full font-semibold h-11"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </ProductModal>
  )
}

// Filter products based on filter state
function filterProducts(products: typeof babyProducts, filters: FilterState): typeof babyProducts {
  return products.filter(product => {
    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false
    }

    // Size filter
    if (filters.sizes.length > 0 && !product.sizes.some(size => filters.sizes.includes(size))) {
      return false
    }

    // Price range filter
    if (filters.priceRanges.length > 0) {
      const price = product.price
      const matchesPriceRange = filters.priceRanges.some(range => {
        switch (range) {
          case '$0-25':
            return price >= 0 && price < 25
          case '$25-50':
            return price >= 25 && price < 50
          case '$50+':
            return price >= 50
          default:
            return false
        }
      })
      if (!matchesPriceRange) {
        return false
      }
    }

    return true
  })
}

export default function Home() {
  const { state } = useCart()
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)
  const [sortBy, setSortBy] = useState('newest')
  const [showCount, setShowCount] = useState(8)
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    sizes: [],
    ageGroups: [],
    priceRanges: []
  })

  const filteredProducts = filterProducts(babyProducts, filters)

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'popular':
        return b.reviews - a.reviews
      case 'newest':
      default:
        return b.id - a.id // Assuming higher ID means newer
    }
  })

  const productsToShow = sortedProducts.slice(0, showCount)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
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
            </div>
            <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
               <a href="#home" className="hover:text-primary transition-colors duration-200">Home</a>
               <a href="#products" className="hover:text-primary transition-colors duration-200">Products</a>
               <a href="#about" className="hover:text-primary transition-colors duration-200">About</a>
               <a href="#contact" className="hover:text-primary transition-colors duration-200">Contact</a>
             </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search baby clothing..."
                  className="pl-9 w-64"
                />
              </div>
            </div>

            <ThemeToggle />

            <Button variant="ghost" size="sm" className="relative">
              <Heart className="w-5 h-5" />
              <span className="sr-only">Wishlist</span>
            </Button>

            <CartModal>
               <Button variant="ghost" size="sm" className="relative">
                 <ShoppingCart className="w-5 h-5" />
                 {itemCount > 0 && (
                   <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full text-xs w-5 h-5 flex items-center justify-center">
                     {itemCount}
                   </span>
                 )}
                 <span className="sr-only">Cart</span>
               </Button>
             </CartModal>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
               <SheetContent side="left">
                 <div className="flex flex-col gap-4 mt-6">
                   <a href="#home" className="hover:text-primary transition-colors">Home</a>
                   <a href="#products" className="hover:text-primary transition-colors">Products</a>
                   <a href="#about" className="hover:text-primary transition-colors">About</a>
                   <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
                 </div>
               </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

       {/* Hero Section */}
       <motion.section
         className="py-24 px-6 bg-gradient-to-br from-primary/5 via-background to-accent/10 relative overflow-hidden"
         initial="hidden"
         animate="visible"
         variants={staggerContainerVariants}
       >
         {/* Floating Background Elements */}
         <div className="absolute inset-0 pointer-events-none">
           <FloatingIcon delay={0}>
             <div className="absolute top-20 left-10 text-primary/20">
               <Baby className="w-12 h-12" />
             </div>
           </FloatingIcon>
           <FloatingIcon delay={1}>
             <div className="absolute top-40 right-20 text-accent/20">
               <Sparkles className="w-10 h-10" />
             </div>
           </FloatingIcon>
           <FloatingIcon delay={2}>
             <div className="absolute bottom-32 left-20 text-primary/15">
               <HeartIcon className="w-8 h-8" />
             </div>
           </FloatingIcon>
           <FloatingIcon delay={0.5}>
             <div className="absolute bottom-20 right-10 text-accent/20">
               <Sparkles className="w-6 h-6" />
             </div>
           </FloatingIcon>
         </div>

         <div className="container mx-auto text-center relative z-10">
           <motion.h1
             className="text-5xl md:text-7xl font-bold mb-8 text-foreground leading-tight tracking-tight"
             variants={staggerItemVariants}
           >
             <motion.span variants={itemVariants}>Precious Little</motion.span><br />
             <motion.span
               className="text-primary"
               variants={itemVariants}
             >
               Mirai
             </motion.span>
           </motion.h1>

           <motion.p
             className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
             variants={staggerItemVariants}
           >
             Discover our beautiful collection of baby booties, bibs, jhablas,
             and socks. Handcrafted with love using premium natural materials for your precious
             little one. Quality, comfort, and adorable style that lasts.
           </motion.p>

           <motion.div
             className="flex flex-col sm:flex-row gap-6 justify-center"
             variants={staggerItemVariants}
           >
             <motion.div variants={scaleVariants} whileHover="hover" whileTap="tap">
               <Button size="lg" className="text-lg px-10 py-4 h-auto font-semibold">
                 Shop Collection
               </Button>
             </motion.div>
             <motion.div variants={scaleVariants} whileHover="hover" whileTap="tap">
               <Button size="lg" variant="outline" className="text-lg px-10 py-4 h-auto font-semibold">
                 Learn More
               </Button>
             </motion.div>
           </motion.div>
         </div>
       </motion.section>

       {/* Features */}
       <AnimatedSection className="py-20 px-6 bg-muted/20">
         <div className="container mx-auto">
           <motion.div
             className="text-center mb-16"
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true }}
             variants={containerVariants}
           >
             <motion.h2
               className="text-3xl font-bold mb-4"
               variants={itemVariants}
             >
               Why Choose Little Mirai
             </motion.h2>
             <motion.p
               className="text-muted-foreground max-w-2xl mx-auto"
               variants={itemVariants}
             >
               We create beautiful, high-quality baby clothing and accessories with love,
               using only the finest natural materials for your precious little one.
             </motion.p>
           </motion.div>

           <motion.div
             className="grid grid-cols-1 md:grid-cols-3 gap-12"
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, margin: "-50px" }}
             variants={staggerContainerVariants}
           >
             {[
               {
                 icon: Truck,
                 title: "Premium Materials",
                 description: "We use only the finest organic cotton, bamboo, merino wool, and silk. Gentle on baby's sensitive skin, naturally soft and breathable.",
                 delay: 0
               },
               {
                 icon: Shield,
                 title: "Handcrafted Quality",
                 description: "Each piece is carefully crafted by skilled artisans. We never compromise on quality, safety, or attention to detail.",
                 delay: 0.2
               },
               {
                 icon: Award,
                 title: "Sustainable Fashion",
                 description: "Eco-friendly production with biodegradable packaging. Beautiful clothes that are kind to your baby and our planet.",
                 delay: 0.4
               }
             ].map((feature) => (
               <motion.div
                 key={feature.title}
                 className="text-center group"
                 variants={staggerItemVariants}
                 whileHover={{ y: -5 }}
                 transition={{ duration: 0.3 }}
               >
                 <motion.div
                   className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:shadow-lg group-hover:shadow-primary/20 transition-shadow duration-300"
                   whileHover={{
                     scale: 1.1,
                     rotate: [0, -10, 10, 0],
                     transition: { duration: 0.5 }
                   }}
                 >
                   <feature.icon className="w-10 h-10 text-primary" />
                 </motion.div>
                 <motion.h3
                   className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300"
                   variants={itemVariants}
                 >
                   {feature.title}
                 </motion.h3>
                 <motion.p
                   className="text-muted-foreground leading-relaxed"
                   variants={itemVariants}
                 >
                   {feature.description}
                 </motion.p>
               </motion.div>
             ))}
           </motion.div>
         </div>
       </AnimatedSection>

       {/* Featured Products */}
       <AnimatedSection className="py-24 px-6 bg-muted/10" id="products">
         <div className="container mx-auto">
           <motion.div
             className="text-center mb-16"
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true }}
             variants={containerVariants}
           >
             <motion.h2
               className="text-4xl md:text-5xl font-bold mb-6"
               variants={itemVariants}
             >
               <motion.span
                 initial={{ opacity: 0, scale: 0.8 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{
                   duration: 0.6,
                   ease: [0.25, 0.46, 0.45, 0.94]
                 }}
               >
                 Adorable
               </motion.span>{" "}
               <motion.span
                 className="text-primary"
                 initial={{ opacity: 0, scale: 0.8 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{
                   duration: 0.6,
                   delay: 0.2,
                   ease: [0.25, 0.46, 0.45, 0.94]
                 }}
               >
                 Collection
               </motion.span>
             </motion.h2>
             <motion.p
               className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
               variants={itemVariants}
             >
               Discover our beautiful collection of baby booties, bibs, socks, and clothing, each piece
               handcrafted with love using premium natural materials. Perfect for your precious Little Mirai.
             </motion.p>
           </motion.div>

           {/* Filters and Sorting */}
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
             {/* Desktop Filters Sidebar */}
             <div className="hidden lg:block">
               <ProductFilters
                 filters={filters}
                 onFiltersChange={setFilters}
                 className="sticky top-24"
               />
             </div>

             {/* Main Content */}
             <div className="lg:col-span-3">
               {/* Sorting and Filter Controls */}
               <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between">
                 <div className="flex items-center gap-4">
                   <ProductFiltersMobile
                     filters={filters}
                     onFiltersChange={setFilters}
                   />
                   <span className="text-sm font-medium text-muted-foreground">
                     Showing {productsToShow.length} of {sortedProducts.length} products
                   </span>
                 </div>
                 <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2">
                     <span className="text-sm font-medium">Sort by:</span>
                     <DropdownMenu>
                       <DropdownMenuTrigger asChild>
                         <Button variant="outline" size="sm" className="w-40 justify-between">
                           {sortBy === 'newest' && 'Newest First'}
                           {sortBy === 'price-low' && 'Price: Low to High'}
                           {sortBy === 'price-high' && 'Price: High to Low'}
                           {sortBy === 'rating' && 'Best Rated'}
                           {sortBy === 'popular' && 'Most Popular'}
                           <ChevronDown className="w-4 h-4 ml-2" />
                         </Button>
                       </DropdownMenuTrigger>
                       <DropdownMenuContent align="end">
                         <DropdownMenuItem onClick={() => setSortBy('newest')}>Newest First</DropdownMenuItem>
                         <DropdownMenuItem onClick={() => setSortBy('price-low')}>Price: Low to High</DropdownMenuItem>
                         <DropdownMenuItem onClick={() => setSortBy('price-high')}>Price: High to Low</DropdownMenuItem>
                         <DropdownMenuItem onClick={() => setSortBy('rating')}>Best Rated</DropdownMenuItem>
                         <DropdownMenuItem onClick={() => setSortBy('popular')}>Most Popular</DropdownMenuItem>
                       </DropdownMenuContent>
                     </DropdownMenu>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="text-sm font-medium">View:</span>
                     <div className="flex border rounded-md">
                       <Button variant="ghost" size="sm" className="px-3 py-2 rounded-r-none border-r">
                         <Grid className="w-4 h-4" />
                       </Button>
                       <Button variant="ghost" size="sm" className="px-3 py-2 rounded-l-none">
                         <List className="w-4 h-4" />
                       </Button>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Product Grid */}
               <motion.div
                 className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
                 initial="hidden"
                 whileInView="visible"
                 viewport={{ once: true, margin: "-50px" }}
                 variants={staggerContainerVariants}
               >
                 {productsToShow.length === 0 ? (
                   <motion.div
                     className="col-span-full text-center py-16"
                     variants={itemVariants}
                   >
                     <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                     <h3 className="text-lg font-semibold mb-2">No products found</h3>
                     <p className="text-muted-foreground">Try adjusting your filters or check back later for new arrivals.</p>
                   </motion.div>
                 ) : (
                   productsToShow.map((product) => (
                     <motion.div
                       key={product.id}
                       variants={staggerItemVariants}
                       whileHover={{ y: -8 }}
                       transition={{ duration: 0.3 }}
                     >
                       <ProductCard product={product} />
                     </motion.div>
                   ))
                 )}
               </motion.div>

               {/* Load More Button */}
               {productsToShow.length < sortedProducts.length && (
                 <div className="text-center mt-16">
                   <Button
                     variant="outline"
                     size="lg"
                     className="px-8"
                     onClick={() => setShowCount(prev => Math.min(prev + 8, sortedProducts.length))}
                   >
                     Load More Products ({sortedProducts.length - productsToShow.length} remaining)
                   </Button>
                 </div>
               )}
              </div>
            </div>
          </div>
        </AnimatedSection>

       {/* Newsletter */}
       <AnimatedSection className="py-24 px-6 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
         <div className="container mx-auto text-center">
           <motion.div
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true }}
             variants={containerVariants}
           >
             <motion.h2
               className="text-4xl font-bold mb-6"
               variants={itemVariants}
             >
               Join Our Little Mirai Family
             </motion.h2>
             <motion.p
               className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed"
               variants={itemVariants}
             >
               Be the first to know about new arrivals, exclusive offers, and adorable styling tips.
               Join thousands of parents who choose Little Mirai for their baby&apos;s precious wardrobe.
             </motion.p>
           </motion.div>

           <motion.div
             className="max-w-lg mx-auto"
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true }}
             variants={staggerContainerVariants}
           >
             <motion.div
               className="flex gap-3 mb-4"
               variants={staggerItemVariants}
             >
               <motion.div
                 className="flex-1"
                 whileFocus={{ scale: 1.02 }}
                 transition={{ duration: 0.2 }}
               >
                 <Input
                   placeholder="Enter your email address"
                   className="h-12 text-base"
                   type="email"
                 />
               </motion.div>
               <motion.div
                 variants={scaleVariants}
                 whileHover="hover"
                 whileTap="tap"
               >
                 <Button size="lg" className="px-8 font-semibold h-12">
                   Subscribe
                 </Button>
               </motion.div>
             </motion.div>
             <motion.p
               className="text-sm text-muted-foreground"
               variants={staggerItemVariants}
             >
               We respect your privacy. Unsubscribe at any time.
             </motion.p>
           </motion.div>
         </div>
       </AnimatedSection>

      {/* Footer */}
      <footer className="py-16 px-6 bg-muted/30 border-t border-border/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-10 h-10">
                  <Image
                    src="/little-mirai-logo.svg"
                    alt="Little Mirai Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-2xl font-bold text-primary">
                  Little Mirai
                </h3>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Your trusted partner for beautiful baby clothing and accessories.
                We create adorable, high-quality pieces that make every moment precious
                for you and your little one.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                  <span className="text-lg">📧</span>
                </Button>
                <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                  <span className="text-lg">📱</span>
                </Button>
                <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                  <span className="text-lg">📘</span>
                </Button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-lg">Shop</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors duration-200">Baby Booties</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-200">Organic Bibs</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-200">Premium Socks</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-200">Baby Clothing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-lg">Support</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors duration-200">Contact Support</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-200">Shipping & Delivery</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-200">Returns & Exchanges</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-200">Product Guide</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-lg">Company</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors duration-200">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-200">Quality Standards</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-200">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-200">Press Center</a></li>
              </ul>
            </div>
          </div>
          <Separator className="my-12" />
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p className="font-medium">&copy; 2024 Little Mirai. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary transition-colors duration-200 font-medium">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors duration-200 font-medium">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors duration-200 font-medium">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
