'use client';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../lib/firebaseConfig';
import { collection, doc, getDocs, getDoc, query, where, QueryDocumentSnapshot } from 'firebase/firestore';
import { FirebaseInstitutionData } from '../lib/types.js';


type ResponseData = {
    lat?: number;
    lng?: number;
    error?: string;
  };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const address = req.query.address as string;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; 

  if (!address) {
    res.status(400).json({ error: 'Address is required' });
    return;
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.status === 'OK') {
      const { lat, lng } = data.results[0].geometry.location;
      res.status(200).json({ lat, lng });
    } else {
      res.status(404).json({ error: 'No location found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
}