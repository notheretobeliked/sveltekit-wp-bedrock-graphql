import { redirect } from '@sveltejs/kit'

import type { PageServerLoad } from './$types'

// ... existing imports ...

export const load: PageServerLoad = async function load({ params, url, request }) {
  // Get the Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') || '';
  
  // Check if Arabic is one of the preferred languages
  const prefersArabic = acceptLanguage.toLowerCase().includes('ar');
  
  // Redirect based on language preference
  throw redirect(307, prefersArabic ? '/ar' : '/en');

}
