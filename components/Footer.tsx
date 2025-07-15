import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"
import { mainFeatures } from "@/constants"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-emerald-700 text-white">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="flex flex-col space-y-4">
            <h2 className="text-2xl font-bold">CulinaryApp</h2>
            <p className="max-w-xs text-emerald-100">
              Descoperă rețete delicioase și gestionează ingredientele din frigiderul tău cu ușurință.
            </p>

            {/* Social Media Links */}
            <div className="mt-4 flex space-x-4">
              <div className="rounded-full bg-emerald-600 p-2 hover:bg-emerald-500">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </div>
              <div className="rounded-full bg-emerald-600 p-2 hover:bg-emerald-500">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </div>
              <div className="rounded-full bg-emerald-600 p-2 hover:bg-emerald-500">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold">Navigare</h3>
            <ul className="flex flex-col space-y-2">
              {mainFeatures.map((item) => (
                
                  (item.label!='ADMINISTRARE') &&
                    (<li key={item.route}>
                  <Link
                    href={item.route}
                    className="text-emerald-100 transition-colors hover:text-white hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>)
                
                
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <ul className="flex flex-col space-y-3">
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-emerald-200" />
                <span>contact@culinaryapp.ro</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-emerald-200" />
                <span>+40 712 345 678</span>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin size={18} className="text-emerald-200" />
                <span>București, România</span>
              </li>
            </ul>
          </div>          
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-emerald-600 bg-emerald-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-4 py-6 md:flex-row md:px-8">
          <p className="text-sm text-emerald-200">&copy; {currentYear} CulinaryApp. Toate drepturile rezervate.</p>
          <div className="mt-4 flex space-x-6 md:mt-0">
            <Link href="/terms" className="text-sm text-emerald-200 hover:text-white hover:underline">
              Termeni și condiții
            </Link>
            <Link href="/privacy" className="text-sm text-emerald-200 hover:text-white hover:underline">
              Politica de confidențialitate
            </Link>
            <Link href="/cookies" className="text-sm text-emerald-200 hover:text-white hover:underline">
              Politica de cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

