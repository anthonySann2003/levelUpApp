import { Quest } from '../types';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface UserContext {
  habits: { name: string; attribute: string }[];
  attributes: Record<string, number>;
  level: number;
}

export async function fetchBounties(context: UserContext): Promise<Quest[]> {
    console.log('API URL:', API_URL);
    console.log('Attempting fetch to:', `${API_URL}/generate-bounties`);
  try {
    const response = await fetch(`${API_URL}/generate-bounties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(context),
    });

    if (!response.ok) return [];

    const data = await response.json();
    return data.quests;
  } catch (e) {
    console.log('Failed to fetch bounties:', e);
    return [];
  }
}
