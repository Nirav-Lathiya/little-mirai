"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { ShoppingCart, Heart, Search, Menu, Star, Truck, Shield, Award } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { ProductModal } from "@/components/ProductModal"
import { CartModal } from "@/components/CartModal"
import { babyProducts } from "@/lib/data"
import { useCart } from "@/context/CartContext"
import Link from "next/link"



function ProductCard({ product }: { product: typeof babyProducts[0] }) {
  return (
    <ProductModal product={product}>
      <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 border border-border/50 hover:border-primary/20 bg-card">
        <CardHeader className="p-0">
          <div className="relative aspect-square bg-gradient-to-br from-primary/5 to-accent/10 rounded-t-lg overflow-hidden border-b">
            <Image
              src={product.image}
              alt={`Baby wearing ${product.name.toLowerCase()}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {product.isNew && (
              <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground font-medium">New</Badge>
            )}
            {product.isSale && (
              <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground font-medium">Sale</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="text-xs font-medium px-2 py-1">{product.category}</Badge>
          </div>
          <CardTitle className="text-lg font-semibold mb-2 line-clamp-2 leading-tight">{product.name}</CardTitle>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground font-medium">({product.reviews})</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-primary">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through font-medium">${product.originalPrice}</span>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0 flex gap-3">
          <Button className="flex-1 font-semibold">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
          <Button variant="outline" size="icon" className="shrink-0">
            <Heart className="w-4 h-4" />
          </Button>
        </CardFooter>
      </Card>
    </ProductModal>
  )
}

export default function Home() {
  const { state } = useCart()
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)

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
      <section className="py-24 px-6 bg-gradient-to-br from-primary/5 via-background to-accent/10">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-foreground leading-tight tracking-tight">
            Precious Little<br />
            <span className="text-primary">Mirai</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover our beautiful collection of baby booties, bibs, jhablas,
            and socks. Handcrafted with love using premium natural materials for your precious
            little one. Quality, comfort, and adorable style that lasts.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="text-lg px-10 py-4 h-auto font-semibold">
              Shop Collection
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-10 py-4 h-auto font-semibold">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Little Mirai</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We create beautiful, high-quality baby clothing and accessories with love,
              using only the finest natural materials for your precious little one.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Truck className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Premium Materials</h3>
              <p className="text-muted-foreground leading-relaxed">
                We use only the finest organic cotton, bamboo, merino wool, and silk.
                Gentle on baby&apos;s sensitive skin, naturally soft and breathable.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Handcrafted Quality</h3>
              <p className="text-muted-foreground leading-relaxed">
                Each piece is carefully crafted by skilled artisans. We never compromise
                on quality, safety, or attention to detail.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Award className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Sustainable Fashion</h3>
              <p className="text-muted-foreground leading-relaxed">
                Eco-friendly production with biodegradable packaging.
                Beautiful clothes that are kind to your baby and our planet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-6" id="products">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Adorable Collection</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover our beautiful collection of baby booties, bibs, socks, and clothing, each piece
              handcrafted with love using premium natural materials. Perfect for your precious Little Mirai.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {babyProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 px-6 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Join Our Little Mirai Family</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Be the first to know about new arrivals, exclusive offers, and adorable styling tips.
            Join thousands of parents who choose Little Mirai for their baby&apos;s precious wardrobe.
          </p>
          <div className="max-w-lg mx-auto">
            <div className="flex gap-3">
              <Input
                placeholder="Enter your email address"
                className="flex-1 h-12 text-base"
                type="email"
              />
              <Button size="lg" className="px-8 font-semibold">
                Subscribe
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

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
