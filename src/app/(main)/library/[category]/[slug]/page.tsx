import { notFound } from 'next/navigation';
import Image from "next/image"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';

// This is mock data. In a real application, you'd fetch this from a CMS or database.
const contentData: { [key: string]: { [key: string]: any } } = {
  religions: {
    buddhism: { title: "Buddhism", image: "https://placehold.co/1200x400", hint: "buddha statue", category: "Religion", summary: "Buddhism is a faith that was founded by Siddhartha Gautama (“the Buddha”) more than 2,500 years ago in India. With about 470 million followers, scholars consider Buddhism one of the major world religions. Its practice has historically been most prominent in East and Southeast Asia, but its influence is growing today in the West.", sections: [{ title: "Key Beliefs", content: "The basic doctrines of early Buddhism, which remain common to all Buddhism, include the four noble truths: existence is suffering (dukhka); suffering has a cause, namely craving and attachment (trishna); there is a cessation of suffering, which is nirvana; and there is a path to the cessation of suffering." }, { title: "Practices", content: "Meditation is a central practice in Buddhism. It is a tool to transform the mind. Buddhist meditation practices are techniques that encourage and develop concentration, clarity, emotional positivity, and a calm seeing of the true nature of things." }] },
  },
  races: {
    chinese: { title: "Chinese Culture", image: "https://placehold.co/1200x400", hint: "great wall", category: "Race & Culture", summary: "Chinese culture is one of the world's oldest cultures, originating thousands of years ago. The culture is diverse and varies significantly between provinces, cities, and even towns. The terms 'China' and the geographical landmass of 'China' has shifted across the centuries, with the last dynasty being the Great Qing before the Republic of China and the subsequent People's Republic of China.", sections: [{ title: "Cuisine", content: "Chinese cuisine is an important part of Chinese culture, which includes cuisine originating from the diverse regions of China as well as from Overseas Chinese who have settled in other parts of the world. Because of the Chinese diaspora and historical power of the country, Chinese cuisine has influenced many other cuisines in Asia, with modifications made to cater to local palates." }, { title: "Language", content: "The traditional written language was Classical Chinese. It was used for thousands of years, but was mostly reserved for scholars and intellectuals. By the 20th century, millions of people were illiterate, and many different, mutually unintelligible dialects were spoken. The government, since the May Fourth Movement, has put a lot of effort into promoting a standard language, Mandarin Chinese." }] },
  }
};

export default function LibraryDetailPage({ params }: { params: { category: string; slug: string } }) {
  const { category, slug } = params;
  const data = contentData[category]?.[slug];

  if (!data) {
    notFound();
  }

  const { title, image, hint, category: badgeText, summary, sections } = data;

  return (
    <div className="flex flex-col gap-8">
      <div className="relative h-64 w-full rounded-lg overflow-hidden">
        <Image src={image} alt={title} data-ai-hint={hint} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <Badge variant="secondary" className="mb-2">{badgeText}</Badge>
          <h1 className="text-4xl font-extrabold text-white">{title}</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground">{summary}</p>
        </CardContent>
      </Card>

      {sections.map((section: { title: string, content: string }, index: number) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-line">{section.content}</p>
          </CardContent>
        </Card>
      ))}

    </div>
  )
}
