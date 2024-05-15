import { redirect } from '@sveltejs/kit';
import { verifyToken } from '$lib/api/auth.js';
import { getTimerTasks } from '$lib/api/timerTask.js';
import { getCronoTasks } from '$lib/api/cronoTask.js';
import { extractToken } from '$lib/api/extractToken';

function replaceId(array: Array<any>) {
  return array.map((item) => {
    const newItem = { ...item, id: item._id };
    delete newItem._id;
    return newItem;
  });
}

export const load = async ({ request }: any) => {
  const token = request.headers.get('cookie')
  
  if (token) {
    try {
      
      const tokenFormated = extractToken(token);

      await verifyToken({token: tokenFormated});

      let resTimerTasks = await getTimerTasks(tokenFormated);
      let resCronoTasks = await getCronoTasks(tokenFormated);

      resTimerTasks = replaceId(resTimerTasks.data);
      resCronoTasks = replaceId(resCronoTasks.data);

      return {
        timerTasks: resTimerTasks,
        cronoTasks: resCronoTasks,
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