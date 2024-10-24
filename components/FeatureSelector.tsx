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

const FeatureSelector = () => {
  const pathname=usePathname();
  const curFeature=mainFeatures.find(feature=>feature.route===pathname);
  return (
    <DropdownMenu>
        <DropdownMenuTrigger>
          <div className='flex items-center'>
            {curFeature?.label}
              <span className="material-symbols-outlined">unfold_more</span>
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