/**
 * Pens for the pen case (src/components/PenCase.astro).
 *
 * One list per model. `swatch` and `trim` are approximate colours, used for
 * the drawing (until there's a photo) and for the colour dots on small
 * screens. Add `image` once there's a photo: all photos should be framed the
 * same way (lying down, capped, clip up, transparent background, 12:1 crop).
 */
import type { ImageMetadata } from 'astro';

export interface Pen {
  year: number;
  name: string;
  /** Main colour of the pen, as a CSS colour. */
  swatch: string;
  /** Colour of the metal parts (clip, rings, ends). Defaults to steel. */
  trim?: string;
  finish: string;
  nib: string;
  section: string;
  model: string;
  /** Short note, like "Special edition" or "Launch model". */
  edition: string;
  image?: ImageMetadata;
}

export const lamyStudio: Pen[] = [
  { year: 2005, name: 'Brushed', swatch: '#a7abae', finish: 'Brushed steel', nib: 'Steel', section: 'Black rubber', model: '065', edition: 'Launch model' },
  { year: 2005, name: 'Black', swatch: '#2a2a2a', finish: 'Matt lacquer', nib: 'Steel', section: 'Polished steel', model: '067', edition: 'Launch model' },
  { year: 2005, name: 'Palladium', swatch: '#cdbf9f', trim: '#bdb399', finish: 'Matt palladium', nib: 'Gold (14k)', section: 'Textured palladium', model: '068', edition: 'Launch model' },
  { year: 2005, name: 'Blue', swatch: '#2456b3', finish: 'Matt lacquer', nib: 'Steel', section: 'Polished steel', model: '067', edition: 'Regular range, until 2011' },
  { year: 2007, name: 'Pearl White', swatch: '#eeebe3', finish: 'Glossy white lacquer', nib: 'Gold (14k)', section: 'Polished steel', model: '067', edition: 'Special edition' },
  { year: 2008, name: 'Rubin Black', swatch: '#3a1f24', finish: 'Matt lacquer', nib: 'Gold (14k)', section: 'Polished steel', model: '066', edition: 'Special edition' },
  { year: 2009, name: 'Pearl Black', swatch: '#1d1d20', finish: 'Glossy lacquer', nib: 'Gold (14k)', section: 'Polished steel', model: 'Unknown', edition: 'Special edition, Hong Kong only' },
  { year: 2009, name: 'Violet', swatch: '#5d3f86', finish: 'Matt lacquer', nib: 'Gold (14k)', section: 'Polished steel', model: '067', edition: 'Special edition' },
  { year: 2010, name: 'Platinum Grey', swatch: '#5f6368', finish: 'Matt lacquer', nib: 'Gold (14k)', section: 'Polished steel', model: '068', edition: 'Regular range, until 2015' },
  { year: 2011, name: 'Platinum', swatch: '#c6c8ca', trim: '#e4e5e6', finish: 'Polished platinum', nib: 'Gold (14k)', section: 'Polished steel', model: '069', edition: 'Regular range' },
  { year: 2012, name: 'Royal Red', swatch: '#c5412b', finish: 'Matt lacquer', nib: 'Steel', section: 'Polished steel', model: '067', edition: 'Special edition' },
  { year: 2012, name: 'Imperial Blue', swatch: '#1e2b52', finish: 'Matt lacquer', nib: 'Steel', section: 'Polished steel', model: '067', edition: 'Regular range' },
  { year: 2014, name: 'Wild Rubin', swatch: '#7d1626', finish: 'Glossy lacquer', nib: 'Gold (14k) or steel', section: 'Polished steel', model: '067', edition: 'Special edition' },
  { year: 2017, name: 'Racing Green', swatch: '#1d4533', finish: 'Matt lacquer', nib: 'Steel', section: 'Polished steel', model: '067', edition: 'Special edition' },
  { year: 2017, name: 'Piano Black', swatch: '#111214', finish: 'Glossy lacquer', nib: 'Gold (14k)', section: 'Polished steel', model: '068', edition: 'Regular range' },
  { year: 2018, name: 'Olive', swatch: '#66663a', finish: 'Matt lacquer', nib: 'Steel', section: 'Polished steel', model: '067', edition: 'Special edition' },
  { year: 2018, name: 'Terracotta', swatch: '#bd5f39', finish: 'Matt lacquer', nib: 'Steel', section: 'Polished steel', model: '067', edition: 'Special edition' },
  { year: 2018, name: 'Pearl Terracotta', swatch: '#c9714a', finish: 'Glossy lacquer', nib: 'Gold (14k)', section: 'Polished steel', model: 'Unknown', edition: 'Special edition, Hong Kong only' },
  { year: 2019, name: 'Aquamarine', swatch: '#2b9d9a', finish: 'Matt lacquer', nib: 'Steel', section: 'Polished steel', model: '067', edition: 'Special edition' },
  { year: 2019, name: 'Lx All Black', swatch: '#1b1b1b', trim: '#333333', finish: 'Matt lacquer', nib: 'Black steel (PVD)', section: 'Black rubber', model: '067', edition: 'Special edition, later regular range' },
  { year: 2020, name: 'Glacier', swatch: '#a8c9da', finish: 'Matt lacquer', nib: 'Steel', section: 'Polished steel', model: '067', edition: 'Special edition' },
  { year: 2021, name: 'Black Forest', swatch: '#2c3a33', finish: 'Glossy lacquer', nib: 'Steel', section: 'Polished steel', model: '069', edition: 'Special edition' },
  { year: 2022, name: 'Dark Brown', swatch: '#43302a', finish: 'Glossy lacquer', nib: 'Steel', section: 'Polished steel', model: '069', edition: 'Special edition' },
  { year: 2023, name: 'Rose (gloss)', swatch: '#e3b3ba', finish: 'Glossy lacquer', nib: 'Gold (14k)', section: 'Polished steel', model: '069', edition: 'Special edition, EU only' },
  { year: 2023, name: 'Rose (matt)', swatch: '#dcaab2', finish: 'Matt lacquer', nib: 'Steel', section: 'Polished steel', model: '069', edition: 'Special edition' },
  { year: 2024, name: 'Piano Red', swatch: '#a8142b', finish: 'Glossy lacquer', nib: 'Gold (14k)', section: 'Polished steel', model: '068', edition: 'Regular range' },
  { year: 2024, name: 'Royal Red', swatch: '#8f2a2c', finish: 'Matt lacquer', nib: 'Steel', section: 'Polished steel', model: '067', edition: 'Regular range' },
  { year: 2025, name: 'Orion', swatch: '#5b3a4d', finish: 'Matt lacquer', nib: 'Steel', section: 'Polished steel', model: '066', edition: 'Special edition' },
  { year: 2026, name: 'Petrol', swatch: '#1f5559', finish: 'Matt lacquer', nib: 'Steel', section: 'Polished steel', model: '069', edition: 'Special edition' },
];
