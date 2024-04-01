import { redirect } from '@sveltejs/kit';
import { verifyToken } from '$lib/api/auth.js';
import { getTasks } from '$lib/api/task.js';

export const load = async ({ request }: any) => {
  const token = request.headers.get('cookie')
  
  if (token) {
    try {

      const tokenFormated = token.replace('token=', '');
      
      await verifyToken(tokenFormated);

      const resTasks = await getTasks(tokenFormated);
      console.log(resTasks);

      return {
        user: resTasks.data
      }
    } catch (error) {
      console.error(error);
      return redirect(302, "/login");
    }
  } else {
    return redirect(302, "/login");
  }
}