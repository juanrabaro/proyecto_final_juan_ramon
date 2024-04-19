import { redirect } from '@sveltejs/kit';
import { verifyToken } from '$lib/api/auth.js';
import { getTimerTasks } from '$lib/api/timerTask.js';
import { getCronoTasks } from '$lib/api/cronoTask.js';
import { extractToken } from '$lib/api/extractToken';

export const load = async ({ request }: any) => {
  const token = request.headers.get('cookie')
  
  if (token) {
    try {
      
      const tokenFormated = extractToken(token);

      await verifyToken({token: tokenFormated});

      const resTimerTasks = await getTimerTasks(tokenFormated);
      const resCronoTasks = await getCronoTasks(tokenFormated);

      return {
        timerTasks: resTimerTasks.data,
        cronoTasks: resCronoTasks.data,
        token: tokenFormated
      }
    } catch (error) {
      console.error(error);
      return redirect(302, "/login");
    }
  } else {
    return redirect(302, "/login");
  }
}