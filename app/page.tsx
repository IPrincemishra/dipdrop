import AddProductForm from "@/components/AddProductForm";
import AuthButton from "@/components/AuthButton";
import { FEATURES } from "@/constants/features";
import { createClient } from "@/utils/supabase/server";
import { TrendingDown } from "lucide-react";
import Image from "next/image";
import { getProducts } from "./action";
import ProductCard from "@/components/ProductCard";

export default async function home() {

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const products = user ? await getProducts() : []

  return (
    <main className="min-h-screen bg-linear-to-br from-orange-100/50 via-white to-orange-100/50">
      <header className="bg-white/50 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center justify-center gap-3">
            <Image
              src={"/dipdrop-logo.png"}
              alt="logo"
              width={600}
              height={200}
              className="h-10 w-auto"
            />
          </div>
          {/* btn */}
          <AuthButton user={user} />
        </div>
      </header>
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-6 py-2n rounded-full text-sm font-medium">Made with 🧡 by Prince</div>
          <h2 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">Never Miss a Price Drop</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">Track prices from any e-commerce site. Get instant alerts when prices drop. Save money effortlessly</p>

          {/* Add */}
          <AddProductForm user={user} />

          {/* Features */}
          {
            products.length === 0 && (
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
                {
                  FEATURES.map(({ description, icon: Icon, title }, i) => (
                    <div
                      key={i}
                      className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col items-center justify-center"
                    >
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                        <Icon className="w-6 h-6 text-[#ff5622]" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                      <p className="text-sm text-gray-600">{description}</p>
                    </div>
                  ))
                }
              </div>
            )
          }
        </div>
      </section>

      {user && products.length > 0 && <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Your Tracked Products</h3>
          <span className="text-sm text-gray-500">
            {products.length} {products.length === 1 ? "product" : "products"}
          </span>
        </div>
        <div className="grid md:grid-cols-2 gap-6 items-start">
          {
            products.map(product => <ProductCard key={product.id} product={product} />)
          }
        </div>
      </section>}
      {
        user && products.length === 0 && (
          <section className="max-w-2xl mx-auto px-4 pb-20 text-center">
            <div className="bg-white p-12 rounded-xl border-2 border-dashed border-gray-300">
              <TrendingDown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Products yet
              </h3>
              <p className="text-gray-600">
                Add your first product above to start tracking prices!
              </p>
            </div>
          </section>
        )
      }
    </main >
  )
}