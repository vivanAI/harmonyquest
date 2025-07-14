import Image from "next/image"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const religions = [
  { name: "Buddhism", image: "https://placehold.co/400x300", hint: "buddha statue" },
  { name: "Christianity", image: "https://placehold.co/400x300", hint: "church window" },
  { name: "Islam", image: "https://placehold.co/400x300", hint: "mosque interior" },
  { name: "Hinduism", image: "https://placehold.co/400x300", hint: "ganesha statue" },
  { name: "Sikhism", image: "https://placehold.co/400x300", hint: "golden temple" },
  { name: "Judaism", image: "https://placehold.co/400x300", hint: "torah scroll" },
  { name: "Taoism", image: "https://placehold.co/400x300", hint: "yin yang" },
  { name: "Baháʼí Faith", image: "https://placehold.co/400x300", hint: "lotus temple" },
  { name: "Jainism", image: "https://placehold.co/400x300", hint: "jain symbol" },
]

const races = [
  { name: "Chinese", image: "https://placehold.co/400x300", hint: "chinese lantern" },
  { name: "Malay", image: "https://placehold.co/400x300", hint: "malay house" },
  { name: "Indian", image: "https://placehold.co/400x300", hint: "indian spices" },
  { name: "Eurasian", image: "https://placehold.co/400x300", hint: "cultural fusion" },
]

function CultureCard({ name, image, hint }: { name: string, image: string, hint: string }) {
  return (
    <Card className="overflow-hidden group cursor-pointer">
      <div className="relative aspect-video">
        <Image src={image} alt={name} data-ai-hint={hint} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg">{name}</h3>
      </CardContent>
    </Card>
  )
}

export default function LibraryPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Cultural Encyclopedia</h1>
      </div>
      <p className="text-muted-foreground">
        Explore a wealth of information about world cultures and religions.
      </p>
      <Tabs defaultValue="religions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="religions">Religions</TabsTrigger>
          <TabsTrigger value="races">Races</TabsTrigger>
        </TabsList>
        <TabsContent value="religions">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
            {religions.map((item) => (
              <CultureCard key={item.name} {...item} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="races">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
            {races.map((item) => (
              <CultureCard key={item.name} {...item} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
