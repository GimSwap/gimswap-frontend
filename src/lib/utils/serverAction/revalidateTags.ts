'use server';

import { revalidateTag } from 'next/cache';
import { fetchSendLog } from '../api/fetchSendLog';

export const revalidateTags = async (tags: string) => {
  try {
    await revalidateTag(tags);
  } catch (error) {
    fetchSendLog({ name: 'revalidate', error });
  }
};
