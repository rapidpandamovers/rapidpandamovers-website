import {
  Shield, Users, DollarSign, Clock, Phone, CheckCircle,
  Award, Heart, Truck, Package, MapPin, Calendar, Headphones, FileCheck,
  HelpCircle, BookOpen, Lightbulb, CheckSquare, BookMarked, Star,
  ClipboardList, AlertCircle, Info, ArrowRight,
  type LucideIcon
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Shield,
  Users,
  DollarSign,
  Clock,
  Phone,
  CheckCircle,
  Award,
  Heart,
  Truck,
  Package,
  MapPin,
  Calendar,
  Headphones,
  FileCheck,
  HelpCircle,
  BookOpen,
  Lightbulb,
  CheckSquare,
  BookMarked,
  Star,
  ClipboardList,
  AlertCircle,
  Info,
  ArrowRight,
}

export function resolveIcon(name: string, fallback: LucideIcon = CheckCircle): LucideIcon {
  return iconMap[name] || fallback
}
