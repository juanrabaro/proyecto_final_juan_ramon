import { redirect } from '@sveltejs/kit';
import { verifyToken } from '$lib/api/auth.js';

export const load = async ({ request }: any) => {
  const token = request.headers.get('cookie')
  
  if (token) {
    try {
      console.log(token);

      const tokenFormated = token.replace('token=', '');
      
      const res = await verifyToken(tokenFormated);
      console.log(res);
      
      return {
        user: res.data
      }
    } catch (error) {
      console.error(error);
      return redirect(302, "/");
    }
  } else {
    return redirect(302, "/");
  }
}