import {
  Ear, Info, ArrowRight, BookMarked, BookOpen, Check, ChevronDown, Clipboard, Cog, Eye, FileText,
  Image, Languages, Lightbulb, Menu, MessageCircle, MessageSquareMore, PencilLine,
  Search, ShieldCheck, Sparkles, Presentation, X,
} from 'lucide-react'
import type { LucideProps } from 'lucide-react'

const icons = { Ear, Info, ArrowRight, BookMarked, BookOpen, Check, ChevronDown, Clipboard, Cog, Eye, FileText, Image, Languages, Lightbulb, Menu, MessageCircle, MessageSquareMore, PencilLine, Search, ShieldCheck, Sparkles, Presentation, X }

export type IconName = keyof typeof icons

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Component = icons[name]
  return <Component aria-hidden="true" {...props} />
}
