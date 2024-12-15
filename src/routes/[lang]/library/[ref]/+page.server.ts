// [lang]/library/[ref]/+page.server.ts
import { load as parentLoad } from '../+page.server.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    // Get all the data from the parent route
    const parentData = await parentLoad(event);
    
    // Add our targetRef to it
    return {
        ...parentData,
        targetRef: event.params.ref
    };
};