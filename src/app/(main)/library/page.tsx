import Image from "next/image"
import Link from "next/link"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const religions = [
  { name: "Buddhism", image: "/images/buddhism-card.png", hint: "buddha meditation silhouette" },
  { name: "Christianity", image: "/images/christianity-card.png", hint: "christian symbols cross dove bible" },
  { name: "Islam", image: "/images/islam-card.png", hint: "islamic symbols mosque crescent" },
  { name: "Hinduism", image: "/images/hinduism-card.png", hint: "hindu symbols om ganesha" },
  { name: "Sikhism", image: "/images/sikhism-card.png", hint: "sikh symbols khanda golden temple" },
  { name: "Judaism", image: "/images/judaism-card.png", hint: "torah scroll" },
  { name: "Taoism", image: "/images/taoism-card.png", hint: "yin yang" },
  { name: "Baháʼí Faith", image: "/images/bahai-faith-card.png", hint: "lotus temple" },
  { name: "Jainism", image: "/images/jainism-card.png", hint: "jain symbol" },
]

function CultureCard({ name, image, hint, category }: { name: string, image: string, hint: string, category: string }) {
  const slug = name.toLowerCase().replace(/ /g, "-").replace(/ʼ/g, "");
  return (
    <Link href={`/library/${category}/${slug}`} className="block h-full">
        <Card className="overflow-hidden group cursor-pointer h-full flex flex-col">
        <div className="relative aspect-square">
            <Image src={image} alt={name} data-ai-hint={hint} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <CardContent className="p-4 flex-grow">
            <h3 className="font-semibold text-lg">{name}</h3>
        </CardContent>
        </Card>
    </Link>
  )
}

export default function LibraryPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Cultural Encyclopedia</h1>
      </div>
      <p className="text-muted-foreground">
        Explore a wealth of information about world religions and spiritual traditions.
      </p>
      
      <div className="mt-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {religions.map((item) => (
            <CultureCard key={item.name} {...item} category="religions" />
          ))}
        </div>
      </div>
    </div>
  )
}
