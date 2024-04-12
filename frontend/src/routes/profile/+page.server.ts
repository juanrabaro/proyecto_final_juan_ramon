import { redirect } from '@sveltejs/kit';
import { verifyToken } from '$lib/api/auth.js';
import { getTasks } from '$lib/api/task.js';
import { extractToken } from '$lib/api/extractToken';

export const load = async ({ request }: any) => {
  const token = request.headers.get('cookie')
  
  if (token) {
    try {
      
      const tokenFormated = extractToken(token);

      const res = await verifyToken({token: tokenFormated});
      //console.log(res);

      return {
        user: res.data
      }
    } catch (error) {
      console.error(error);
      return redirect(302, "/login");
    }
  } else {
    return redirect(302, "/login");
  }
}