import { Heart, Waves, CloudRain, Wind } from 'lucide-react';

export const RELAXATION_SOUNDS = [
  {
    id: 'heartbeat',
    title: 'Denyut Rahim (Womb Pulse)',
    desc: 'Detak lembut menenangkan janin & meredakan stres Mama',
    shortName: 'Denyut Rahim',
    icon: Heart,
    color: '#D88EAA',
  },
  {
    id: 'waves',
    title: 'Deburan Ombak Lembut',
    desc: 'Ritme pantai menenangkan gelombang pikiran',
    shortName: 'Deburan Ombak',
    icon: Waves,
    color: '#6B8EA8',
  },
  {
    id: 'rain',
    title: 'Hujan Rintik Tenang',
    desc: 'Suara hujan alami untuk tidur lebih lelap',
    shortName: 'Hujan Rintik',
    icon: CloudRain,
    color: '#7EAEB2',
  },
  {
    id: 'breathe',
    title: 'Relaksasi Napas 4-7-8',
    desc: 'Panduan visual & audio untuk tarikan napas mendalam',
    shortName: 'Napas 4-7-8',
    icon: Wind,
    color: '#5B9A8B',
  },
];
