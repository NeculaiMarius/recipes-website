"use client"
import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname } from 'next/navigation';
import { mainFeatures } from '@/constants';
import Link from 'next/link';
import { Menu } from 'lucide-react';

const FeatureSelector = () => {
  const pathname=usePathname();
  const curFeature=mainFeatures.find(feature=>feature.route===pathname);
  return (
    <DropdownMenu>
        <DropdownMenuTrigger >
          <div className='flex items-center gap-2 bg-emerald-700 text-white rounded-md px-2 py-1 shadow-md font-semibold'>
            {curFeature?.label}
            <Menu size={36}></Menu>
          </div>     
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {
            mainFeatures.filter(feature => feature!=curFeature).map(feature=>{
              return(
                <Link key={feature.label} href={feature.route}>
                  <DropdownMenuItem >
                    {feature.label}
                  </DropdownMenuItem>
                </Link> 
              )
            })
          }
        </DropdownMenuContent>
      </DropdownMenu>
  )
}

export default FeatureSelector